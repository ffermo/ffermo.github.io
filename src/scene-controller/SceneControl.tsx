import { useCallback, useEffect } from 'react';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { EARTH_RADIANS_PER_SECOND, EARTH_RADIUS, SUN_RADIANS_PER_SECOND, SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceObject } from '../util/scene.util';
import { selectCameraControls, selectCameraTarget, } from '../space-store/space.hooks';
import { useDispatch, useSelector } from 'react-redux';
import { CameraControls } from '@react-three/drei';
import { SetCameraControlsAction } from '../space-store/space.actions';
import { AppDispatch } from '../space-store/space.store';
import { Scene } from 'three';

function SceneControl() {
  console.log("SceneControl Rendered");
  const dispatch = useDispatch<AppDispatch>();
  const scene: Scene = useThree(state => state.scene);
  const cameraControls: CameraControls = useSelector(selectCameraControls) as CameraControls;
  const cameraTarget: SpaceObject = useSelector(selectCameraTarget);

  // Mouse handlers
  let isCameraAtRest: boolean = true;
  let isPointerDown: boolean = false;
  let isPointerDragging: boolean = false;

  // Scene objects
  let sun = scene?.getObjectByName(SpaceObject.SUN_SPHERE);
  let earth = scene?.getObjectByName(SpaceObject.EARTH_SPHERE);
  let clouds = scene?.getObjectByName(SpaceObject.CLOUD_SPHERE);

  const setCameraControls = useCallback((cameraControls: CameraControls) => {
    if (cameraControls) {
      // cameraControls = cameraControlsRef;
      dispatch(SetCameraControlsAction(cameraControls))
    } else {
      console.warn("CameraControls CB did not initialize correctly.");
    }
  }, []);

  useEffect(() => {
    if (cameraControls) {
      document.body.addEventListener("mousedown", (event: MouseEvent) => {
        const target = event?.target as HTMLElement;
        if (event.button == 0 && target?.nodeName === "CANVAS") {
          isPointerDown = true;
        }
      });

      document.body.addEventListener("touchstart", (event: TouchEvent) => {
        const target = event?.target as HTMLElement;
        if (event.touches.length <= 1 && target?.nodeName === "CANVAS") {
          isPointerDown = true;
        }
      });

      document.body.addEventListener("mousemove", (event: MouseEvent) => {
        if (isPointerDown && event?.button === 0) {
          isPointerDragging = true;
          isCameraAtRest = false;
        }
      });

      document.body.addEventListener("touchmove", (event: TouchEvent) => {
        if (isPointerDown && event.touches.length <= 2) {
          isPointerDragging = true;
          isCameraAtRest = false;
        }
      });

      document.body.addEventListener("mouseup", event => {
        if (event.button === 0) {
          isPointerDown = false;
          isPointerDragging = false;
        }
      });

      document.body.addEventListener("touchend", event => {
        if (event.touches.length === 0) {
          isPointerDown = false;
          isPointerDragging = false;
        }
      });

      cameraControls.addEventListener("rest", () => isCameraAtRest = true);
      switch (cameraTarget) {
        case SpaceObject.EARTH_SPHERE:
          focusEarth(cameraControls, true);
          break;
        case SpaceObject.SUN_SPHERE:
          focusSun(cameraControls, true);
          break;
        default:
          console.log("TARGET NOT IMPLEMENTED: " + cameraTarget + " - FOCUSING EARTH");
          focusEarth(cameraControls, true);
          break;
      }
    }
  })

  useFrame((state: RootState, delta: number) => {
    if (cameraControls) {
      if (cameraControls.update(delta)) {
        state.gl.render(state.scene, state.camera);
      };
  
      if (isCameraAtRest && !isPointerDragging) {
        cameraControls.rotate(camRadiansPerSecond() * delta * 1000, 0, false);
      }
    }
  });

  function focusEarth(cameraControls: CameraControls, transition: boolean): void {
    if (earth && clouds) {
      isCameraAtRest = false;
      cameraControls.setTarget(earth.position.x, earth.position.y, earth.position.z, transition);
      const minDistance = cameraControls.getDistanceToFitSphere(EARTH_RADIUS);
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = minDistance * 10;
      cameraControls.dollyTo(((cameraControls.maxDistance - cameraControls.minDistance) * .50) + cameraControls.minDistance);
    }
  }

  function focusSun(cameraControls: CameraControls, transition: boolean): void {
    if (sun) {
      isCameraAtRest = false;
      cameraControls.setTarget(sun.position.x, sun.position.y, sun.position.z, transition);
      const minDistance = cameraControls.getDistanceToFitSphere(SUN_RADIUS);
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = minDistance * 10;
      cameraControls.dollyTo(((cameraControls.maxDistance - cameraControls.minDistance) * .15) + cameraControls.minDistance);
    }
  }

  function camRadiansPerSecond(): number {
    switch (cameraTarget) {
      case SpaceObject.EARTH_SPHERE:
        return EARTH_RADIANS_PER_SECOND;
      case SpaceObject.SUN_SPHERE:
        return SUN_RADIANS_PER_SECOND;
      default:
        return 0;
    }
  }

  return (
    <>
      <CameraControls
        ref={ setCameraControls }
        azimuthRotateSpeed={ .5 }
        polarRotateSpeed={ .5 }
        dollySpeed={ .25 }
        maxSpeed={ 50 }
        mouseButtons={ {
          left: 1, // Rotate
          middle: 0, // None
          right: 0, // None
          wheel: 8 // Dolly
        } }
        touches={ {
          one: 32, // Touch Rotate
          two: 4096, // Touch Dolly
          three: 0 // None
        } }
        draggingSmoothTime={ .25 }
        restThreshold={ .00125 }/>
    </>
  )
}

export default SceneControl;