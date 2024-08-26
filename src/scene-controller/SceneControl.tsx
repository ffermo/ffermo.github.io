import { useEffect, useRef } from 'react';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { EARTH_RADIANS_PER_SECOND, EARTH_RADIUS, SUN_RADIANS_PER_SECOND, SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceObjectName } from '../util/scene.util';
import { selectCameraTarget } from '../space-store/space.hooks';
import { useSelector } from 'react-redux';
import { CameraControls } from '@react-three/drei';

function SceneControl() {
  console.log("SceneControl Rendered");
  const controlsRef = useRef<CameraControls>(null);
  const cameraControls: CameraControls  = controlsRef?.current as CameraControls;
  const state: RootState = useThree();
  const cameraTarget = useSelector(selectCameraTarget);

  // Mouse handlers
  let isCameraAtRest: boolean = true;
  let isMouseDown: boolean = false;
  let isMouseDragging: boolean = false;

  // Scene objects
  let sun = state?.scene?.getObjectByName(SpaceObjectName.SUN_SPHERE);
  let earth = state?.scene?.getObjectByName(SpaceObjectName.EARTH_SPHERE);
  // let earthEllipse = state?.scene?.getObjectByName(SpaceObjectName.EARTH_ELLIPSE);
  let clouds = state?.scene?.getObjectByName(SpaceObjectName.CLOUD_SPHERE);
  useEffect(() => {
    if (cameraControls) {
      document.body.addEventListener("mousedown", (event: MouseEvent) => {
        const target = event?.target as HTMLElement;
        if (event.button == 0 && target?.nodeName === "CANVAS") {
          isMouseDown = true;
        }
      });

      document.body.addEventListener("mousemove", (event: MouseEvent) => {
        if (isMouseDown && event?.button === 0) {
          isMouseDragging = true;
          isCameraAtRest = false;
        }
      });

      document.body.addEventListener("mouseup", event => {
        if (event.button === 0) {
          isMouseDown = false;
          isMouseDragging = false;
        }
      });

      cameraControls.addEventListener("rest", () => {
        isCameraAtRest = true;
      });

      switch (cameraTarget) {
        case SpaceObjectName.EARTH_SPHERE:
          focusEarth(cameraControls, true);
          break;
        case SpaceObjectName.SUN_SPHERE:
          focusSun(cameraControls, true);
          break;
        default:
          console.log("TARGET NOT IMPLEMENTED: " + cameraTarget + " - FOCUSING EARTH");
          focusEarth(cameraControls, false);
          break;
      }
    }
  })

  useFrame((_state: RootState, delta: number) => {
    if (isCameraAtRest && !isMouseDragging) {
      cameraControls?.rotate(camRadiansPerSecond() * delta * 1000, 0, true);
    }

    sun?.rotateY(SUN_RADIANS_PER_SECOND * delta * 1000);
    earth?.rotateY(EARTH_RADIANS_PER_SECOND * delta * 1000);
    // earthEllipse?.rotateX(EARTH_RADIANS_PER_SECOND * delta * 1000);
    clouds?.rotateY((EARTH_RADIANS_PER_SECOND * delta * 999));

    const updated = cameraControls?.update(state?.clock.getDelta());
    if (updated) {
      state?.gl.render(state?.scene, state?.camera);
    }
  })

  function focusEarth(cameraControls: CameraControls, transition: boolean): void {
    if (earth && clouds) {
      cameraControls.setTarget(earth.position.x, earth.position.y, earth.position.z, transition);
      const minDistance = cameraControls.getDistanceToFitSphere(EARTH_RADIUS);
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = minDistance * 10;
      cameraControls.dollyTo(((cameraControls.maxDistance - cameraControls.minDistance) * .50) + cameraControls.minDistance);
    }
  }

  function focusSun(cameraControls: CameraControls, transition: boolean): void {
    if (sun) {
      cameraControls.setTarget(sun.position.x, sun.position.y, sun.position.z, transition);
      const minDistance = cameraControls.getDistanceToFitSphere(SUN_RADIUS);
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = minDistance * 10;
      cameraControls.dollyTo(((cameraControls.maxDistance - cameraControls.minDistance) * .15) + cameraControls.minDistance);
    }
  }

  function camRadiansPerSecond(): number {
    switch (cameraTarget) {
      case SpaceObjectName.EARTH_SPHERE:
        return EARTH_RADIANS_PER_SECOND;
      case SpaceObjectName.SUN_SPHERE:
        return SUN_RADIANS_PER_SECOND;
      default:
        return 0;
    }
  }

  return (
    <CameraControls 
      ref={ controlsRef }
      camera={ state?.camera }
      domElement={ state?.gl.domElement }
      dollySpeed={ .25 }
      mouseButtons={ {
        left: 1, // Rotate
        middle: 0, // None
        right: 0, // None
        wheel: 8 // Dolly
      } }
      restThreshold={ .00125 }/>
  )
}

export default SceneControl;