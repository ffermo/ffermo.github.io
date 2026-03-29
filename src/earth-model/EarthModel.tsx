import * as THREE from 'three';
import { MeshTextureProps } from "../space-canvas/SpaceCanvas";
import { EllipseProps, SpaceTarget } from "../util/scene.util";
import { EARTH_AU, EARTH_FOCAL_DISTANCE, EARTH_RADIUS, EARTH_SEMI_MAJOR, EARTH_SEMI_MINOR, getEarthUtcRotation } from "../util/solarsystem.util";
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { EllipsePath } from '../ellipse-model/EllipseModel';
import { CameraControls, Line } from '@react-three/drei';
import { shallowEqual, useSelector } from 'react-redux';
import { selectCameraControls, selectEarthTarget } from '../space-store/space.hooks';
import { GeoCoordinates } from '../util/location.util';
import { useEffect, useMemo, useRef } from 'react';

export interface EarthModelProps {
  earthTexture: THREE.Texture;
  earthBumpTexture: THREE.Texture;
  earthSpecTexture: THREE.Texture;
  earthCloudTexture: THREE.Texture;
}

function EarthModel(props: EarthModelProps) {
  const ellipsePath = useMemo(() => new EllipsePath(EARTH_SEMI_MINOR, EARTH_SEMI_MAJOR, Math.PI / 2), []);
  const ellipsePoints = useMemo(() => ellipsePath.getPoints(2000), [ellipsePath]);

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
  return (
    <Line
      name= { SpaceTarget.EARTH_ELLIPSE}
      lineWidth={ 2 }
      color={ "dimgray" }
      points={ props.ellipsePoints as THREE.Vector3[] }
      position={ [0, 0, -EARTH_FOCAL_DISTANCE] }
    />
  )
}

/** Orbital correction so the subsolar longitude faces the Sun (at origin). */
function sunFacingOffset(earthWorldPos: THREE.Vector3): number {
  return Math.atan2(-earthWorldPos.x, -earthWorldPos.z) - Math.PI;
}

function EarthScene(props: EllipseProps) {
  console.log("EARTH SCENE LOADING");
  const isCameraAtRest = useRef<boolean>(true);

  // Compute initial rotation from UTC + sun-facing correction at orbital position t=0.
  const initialPoint = props.ellipsePath?.getPointAt(0) ?? new THREE.Vector3();
  const initialWorldPos = new THREE.Vector3(initialPoint.x, initialPoint.y, initialPoint.z - EARTH_FOCAL_DISTANCE);
  const initialRotation = getEarthUtcRotation() + sunFacingOffset(initialWorldPos);
  const earthRotation = useRef<number>(initialRotation);
  const utcInitialized = useRef<boolean>(false);

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
    const minDistance = cameraControls.getDistanceToFitSphere(EARTH_RADIUS);
    const maxDistance = minDistance * 10;

    // Widen constraints before transition to prevent mid-flight clamping
    cameraControls.minDistance = Math.min(cameraControls.minDistance, minDistance);
    cameraControls.maxDistance = Math.max(cameraControls.maxDistance, maxDistance);
    
    await cameraControls.rotateTo(azimuth, polar, true);
    await cameraControls.dollyTo(cameraControls.minDistance, true);


    // Apply final Earth constraints
    cameraControls.minDistance = minDistance;
    cameraControls.maxDistance = maxDistance;
    isCameraAtRest.current = true;

  }

  useEffect(() => {
    if (!earth || !cameraControls || !earthTarget?.prevTarget || !earthTarget.nextTarget) return;

    const onRest = () => { isCameraAtRest.current = true; };
    cameraControls.addEventListener("rest", onRest);
    viewEarthTarget(earthTarget.nextTarget);

    return () => {
      cameraControls.removeEventListener("rest", onRest);
    };
  }, [earth, cameraControls, earthTarget]);

  useFrame((state: RootState, delta: number) => {
    if (earth && clouds && ellipse && ellipsePath) {
      // Apply initial rotation to mesh on very first frame
      if (!utcInitialized.current && isCameraAtRest.current) {
        const initialAngle = initialRotation % (2 * Math.PI);
        earth.rotateY(initialAngle);
        clouds.rotateY(initialAngle);
        utcInitialized.current = true;
      }

      const time = (state.clock.getElapsedTime() * .0005) % 1;
      const point = ellipsePath.getPointAt(time);

      if (cameraControls && isCameraAtRest.current) {
        earth.position.copy(point);
        earth.position.applyMatrix4(ellipse.matrixWorld);
        clouds.position.copy(point);
        clouds.position.applyMatrix4(ellipse.matrixWorld);

        if (earthTarget?.nextTarget) {
          cameraControls.moveTo(earth.position.x, earth.position.y, earth.position.z, false);

          // Compute desired rotation: UTC time-of-day + orbital sun-facing correction
          const desiredRotation = getEarthUtcRotation() + sunFacingOffset(earth.position);
          const dTheta = desiredRotation - earthRotation.current;
          earthRotation.current = desiredRotation;

          earth.rotateY(dTheta);
          clouds.rotateY(dTheta * 0.999);

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