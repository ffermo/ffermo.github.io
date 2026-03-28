import * as THREE from 'three';
import { MeshTextureProps } from "../space-canvas/SpaceCanvas";
import { EllipseProps, SpaceTarget } from "../util/scene.util";
import { EARTH_AU, EARTH_RADIANS_PER_SECOND, EARTH_RADIUS } from "../util/solarsystem.util";
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { EllipsePath } from '../ellipse-model/EllipseModel';
import { CameraControls, Line } from '@react-three/drei';
import { shallowEqual, useSelector } from 'react-redux';
import { selectCameraControls, selectEarthTarget } from '../space-store/space.hooks';
import { GeoCoordinates } from '../util/location.util';
import { useEffect, useRef } from 'react';

export interface EarthModelProps {
  earthTexture: THREE.Texture;
  earthBumpTexture: THREE.Texture;
  earthSpecTexture: THREE.Texture;
  earthCloudTexture: THREE.Texture;
}

function EarthModel(props: EarthModelProps) {
  const ellipsePath = new EllipsePath(EARTH_AU / 2, EARTH_AU, Math.PI / 2);
  const ellipsePoints = ellipsePath.getPoints(2000);

  return (
    <>
      <EarthEllipseCurve
        ellipsePoints={ ellipsePoints }
      />
      <EarthGroundMesh
        map= {props.earthTexture }
        bumpMap={ props.earthBumpTexture }
        specularMap={ props.earthSpecTexture }
      />
      <EarthCloudMesh
        alphaMap={ props.earthCloudTexture }
      />
      <EarthScene
        ellipsePath={ ellipsePath }
      />
    </>
  )
}

export default EarthModel;

function EarthGroundMesh(props: MeshTextureProps) {
  return (
    <mesh
      name={ SpaceTarget.EARTH_SPHERE }
      position={ [0, 0, EARTH_AU] }>
      <sphereGeometry args={[EARTH_RADIUS, 256, 256, -Math.PI/2, Math.PI*2]}/>
      <meshLambertMaterial args={[{
        map: props.map,
        bumpMap: props.bumpMap,
        bumpScale: 5,
        specularMap: props.specularMap
      }]} />
    </mesh>
  )
}

function EarthCloudMesh(props: MeshTextureProps) {
  return (
    <mesh
      name={ SpaceTarget.CLOUD_SPHERE }
      position={ [0, 0, EARTH_AU] }>
      <sphereGeometry args={[EARTH_RADIUS + (EARTH_RADIUS * .005), 256, 256, -Math.PI/2, Math.PI*2]}/>
      <meshLambertMaterial args={[{
        alphaMap: props.alphaMap,
        transparent: true,
      }]} />
    </mesh>
  )
}

function EarthEllipseCurve(props: EllipseProps) {
  console.log("EARTH ELLIPSE LOADED!");

  return (
    <Line
      name= { SpaceTarget.EARTH_ELLIPSE}
      lineWidth={ 2 }
      color={ "dimgray" }
      points={ props.ellipsePoints as THREE.Vector3[] }
      position={ [0, 0, 0] }
    />
  )
}

function EarthScene(props: EllipseProps) {
  console.log("EARTH SCENE LOADING");
  const isCameraAtRest = useRef<boolean>(true);
  const earthRotation = useRef<number>(0);

  const ellipsePath = props.ellipsePath;
  const scene: THREE.Scene = useThree(state => state.scene);
  const cameraControls: CameraControls = useSelector(selectCameraControls) as CameraControls;
  const earthTarget = useSelector(selectEarthTarget, shallowEqual);
  const earth = scene?.getObjectByName(SpaceTarget.EARTH_SPHERE) as THREE.Object3D;
  const ellipse = scene?.getObjectByName(SpaceTarget.EARTH_ELLIPSE);
  const clouds = scene?.getObjectByName(SpaceTarget.CLOUD_SPHERE);

  async function viewEarthTarget(nextTarget: GeoCoordinates): Promise<void> {
    isCameraAtRest.current = false;
    const rawAzimuth = THREE.MathUtils.degToRad(nextTarget.lon) + earthRotation.current;
    const delta = THREE.MathUtils.euclideanModulo(rawAzimuth - cameraControls.azimuthAngle + Math.PI, 2 * Math.PI) - Math.PI;
    const azimuth = cameraControls.azimuthAngle + delta;
    const polar = Math.PI / 2 - THREE.MathUtils.degToRad(nextTarget.lat);
    await cameraControls.dollyTo(cameraControls.minDistance, true);
    await cameraControls.rotateTo(azimuth, polar, true);
  }

  useEffect(() => {
    if (earth && cameraControls && earthTarget?.prevTarget && earthTarget.nextTarget) {
      cameraControls?.addEventListener("rest", () => isCameraAtRest.current = true);
      viewEarthTarget(earthTarget.nextTarget)
    }
  });

  useFrame((state: RootState, delta: number) => {
    if (earth && clouds && ellipse && ellipsePath) {
      const time = (state.clock.getElapsedTime() * .0005) % 1;
      const point = ellipsePath.getPointAt(time);

      if (cameraControls && isCameraAtRest.current) {
        earth.position.copy(point);
        earth.position.applyMatrix4(ellipse.matrixWorld);
        clouds.position.copy(point);
        clouds.position.applyMatrix4(ellipse.matrixWorld);

        if (earthTarget?.nextTarget) {
          cameraControls.moveTo(point.x, point.y, point.z, false);

          const dTheta = EARTH_RADIANS_PER_SECOND * delta * 1000;
          earth.rotateY(dTheta);
          earthRotation.current += dTheta;
          clouds.rotateY(EARTH_RADIANS_PER_SECOND * delta * 999);

          // Instant when idle, smooth when user is interacting (preserves drag smoothing)
          cameraControls.rotate(dTheta, 0, false);
        }
      }

      if (cameraControls.update(delta)) {
        state.gl.render(state.scene, state.camera);
      };
    }
  });
  return (
    <>
    </>
  )
}