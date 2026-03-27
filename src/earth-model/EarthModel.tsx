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
      <sphereGeometry args={[EARTH_RADIUS, 256, 256, (-Math.PI/2) - .002, Math.PI*2]}/>
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
      <sphereGeometry args={[EARTH_RADIUS + (EARTH_RADIUS * .005), 256, 256, (-Math.PI/2) - .002, Math.PI*2]}/>
      <meshLambertMaterial args={[{
        alphaMap: props.alphaMap,
        transparent: true,
      }]} />
      <axesHelper />
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

  const ellipsePath = props.ellipsePath;
  const scene: THREE.Scene = useThree(state => state.scene);
  const cameraControls: CameraControls = useSelector(selectCameraControls) as CameraControls;
  const earthTarget = useSelector(selectEarthTarget, shallowEqual);
  const earth = scene?.getObjectByName(SpaceTarget.EARTH_SPHERE) as THREE.Object3D;
  const ellipse = scene?.getObjectByName(SpaceTarget.EARTH_ELLIPSE);
  const clouds = scene?.getObjectByName(SpaceTarget.CLOUD_SPHERE);

  async function viewEarthTarget(_prevTarget: GeoCoordinates, nextTarget: GeoCoordinates): Promise<void> {
    isCameraAtRest.current = false;
    const currentSpherical: THREE.Spherical = new THREE.Spherical(
      undefined,
      THREE.MathUtils.degToRad(90 - nextTarget.lat),
      THREE.MathUtils.degToRad(nextTarget.lon)
    )
    // const azimuthAngle = THREE.MathUtils.euclideanModulo(THREE.MathUtils.degToRad(nextTarget.lon) - THREE.MathUtils.degToRad(prevTarget.lon), Math.PI / 2);
    // console.log(azimuthAngle);
    console.log(currentSpherical);
    console.log(earth.rotation.x);

    const azimuthAngle = earth.rotation.x ?
      (2 * (Math.PI - (Math.PI / 2 + earth.rotation.y)) + currentSpherical.theta + Math.PI) :
      (2 * (Math.PI / 2 + earth.rotation.y) + currentSpherical.theta + Math.PI);
    await cameraControls.dollyTo(cameraControls.minDistance, true);
    await cameraControls.rotateTo(azimuthAngle, currentSpherical.phi, true);
    // earth.updateWorldMatrix(false, false);
  }

  useEffect(() => {
    if (earth && cameraControls && earthTarget?.prevTarget && earthTarget.nextTarget) {
      cameraControls?.addEventListener("rest", () => isCameraAtRest.current = true);
      viewEarthTarget(earthTarget.prevTarget, earthTarget.nextTarget)
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

        if (earthTarget) {
          cameraControls.moveTo(point.x, point.y, point.z, false);

          earth.rotateY(EARTH_RADIANS_PER_SECOND * delta * 1000);
          // const azimuthAngle =
          //   earth.rotation.x ?
          //   (2 * Math.PI - (3 * Math.PI / 2 + earth.rotation.y)) :
          //   (3 * Math.PI / 2 + earth.rotation.y);
          // console.log("X=" + earth.rotation.x +
          //   " Y=" + earth.rotation.y +
          //   " A=" + azimuthAngle);
          // console.log();
          clouds.rotateY(EARTH_RADIANS_PER_SECOND * delta * 999);
        }
        // 012101210

        // 012301230
      }

      // console.log("AZIMUTH: " + cameraControls.azimuthAngle + ", POLAR: " + cameraControls.polarAngle);
      cameraControls.normalizeRotations();
      
        
      if (cameraControls.update(delta)) {
        state.gl.render(state.scene, state.camera);
      };
        // console.log("AZIMUTH: " + cameraControls.azimuthAngle + ", POLAR: " + cameraControls.polarAngle);

    }
  });
  return (
    <>
    </>
  )
}