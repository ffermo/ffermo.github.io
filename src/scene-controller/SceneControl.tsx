import { useCallback, useEffect, useRef } from 'react';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { EARTH_RADIANS_PER_SECOND, EARTH_RADIUS, SUN_RADIANS_PER_SECOND, SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceTarget } from '../util/scene.util';
import { selectCameraControls, selectSpaceTarget, } from '../space-store/space.hooks';
import { useDispatch, useSelector } from 'react-redux';
import { CameraControls } from '@react-three/drei';
import { SetCameraControlsAction, SetEarthTargetAction } from '../space-store/space.actions';
import { AppDispatch } from '../space-store/space.store';
import { Scene } from 'three';
import { LONGMONT_CO_LOC } from '../util/location.util';

function SceneControl() {
  console.log("SceneControl Rendered");
  const dispatch = useDispatch<AppDispatch>();
  const scene: Scene = useThree(state => state.scene);
  const cameraControls: CameraControls = useSelector(selectCameraControls) as CameraControls;
  const spaceTarget: SpaceTarget = useSelector(selectSpaceTarget);

  // Mouse handlers
  const cameraAtRest = useRef<boolean>(true);
  const cameraTransition = useRef<boolean>(false);
  const isPointerDown = useRef<boolean>(false);
  const isPointerDragging = useRef<boolean>(false);

  // Scene objects
  const sun = scene?.getObjectByName(SpaceTarget.SUN_SPHERE);
  const earth = scene?.getObjectByName(SpaceTarget.EARTH_SPHERE);
  const clouds = scene?.getObjectByName(SpaceTarget.CLOUD_SPHERE);

  const setCameraControls = useCallback((cameraControls: CameraControls) => {
    if (cameraControls) {
      // cameraControls = cameraControlsRef;
      dispatch(SetCameraControlsAction(cameraControls))
    } else {
      console.warn("CameraControls CB did not initialize correctly.");
    }
  }, [dispatch]);

  async function focusEarth(cameraControls: CameraControls, transition: boolean): Promise<void> {
    if (earth && clouds) {
      cameraAtRest.current = false;
      await cameraControls.setTarget(earth.position.x, earth.position.y, earth.position.z, transition);
      const minDistance = cameraControls.getDistanceToFitSphere(EARTH_RADIUS);
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = minDistance * 10;
      await cameraControls.dollyTo(((cameraControls.maxDistance - cameraControls.minDistance) * .50) + cameraControls.minDistance, transition);
      cameraTransition.current = false;
      dispatch(SetEarthTargetAction(LONGMONT_CO_LOC));
    }
  }

  async function focusSun(cameraControls: CameraControls, transition: boolean): Promise<void> {
    if (sun) {
      cameraAtRest.current = false;
      await cameraControls.setTarget(sun.position.x, sun.position.y, sun.position.z, transition);
      const minDistance = cameraControls.getDistanceToFitSphere(SUN_RADIUS);
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = minDistance * 10;
      await cameraControls.dollyTo(((cameraControls.maxDistance - cameraControls.minDistance) * .15) + cameraControls.minDistance, transition);
    }
  }

  function camRadiansPerSecond(): number {
    switch (spaceTarget) {
      case SpaceTarget.EARTH_SPHERE:
        return EARTH_RADIANS_PER_SECOND;
      case SpaceTarget.SUN_SPHERE:
        return SUN_RADIANS_PER_SECOND;
      default:
        return 0;
    }
  }

  useEffect(() => {
    if (cameraControls) {
      document.body.addEventListener("mousedown", (event: MouseEvent) => {
        const target = event?.target as HTMLElement;
        if (event.button == 0 && target?.nodeName === "CANVAS") {
          isPointerDown.current = true;
        }
      });

      document.body.addEventListener("touchstart", (event: TouchEvent) => {
        const target = event?.target as HTMLElement;
        if (event.touches.length <= 1 && target?.nodeName === "CANVAS") {
          isPointerDown.current = true;
        }
      });

      document.body.addEventListener("mousemove", (event: MouseEvent) => {
        if (isPointerDown.current && event?.button === 0) {
          isPointerDragging.current = true;
          cameraAtRest.current = false;
        }
      });

      document.body.addEventListener("touchmove", (event: TouchEvent) => {
        if (isPointerDown.current && event.touches.length <= 2) {
          isPointerDragging.current = true;
          cameraAtRest.current = false;
        }
      });

      document.body.addEventListener("mouseup", event => {
        if (event.button === 0) {
          isPointerDown.current = false;
          isPointerDragging.current = false;
        }
      });

      document.body.addEventListener("touchend", event => {
        if (event.touches.length === 0) {
          isPointerDown.current = false;
          isPointerDragging.current = false;
        }
      });

      cameraControls.addEventListener("rest", () => {
        cameraAtRest.current = true;
        cameraTransition.current = false;
      });
      cameraControls.addEventListener("transitionstart", () => cameraTransition.current = !isPointerDown.current && !isPointerDragging.current);
      switch (spaceTarget) {
        case SpaceTarget.EARTH_SPHERE:
          focusEarth(cameraControls, true);
          break;
        case SpaceTarget.SUN_SPHERE:
          focusSun(cameraControls, true);
          break;
        default:
          console.log("TARGET NOT IMPLEMENTED: " + spaceTarget + " - FOCUSING EARTH");
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
  
      if (cameraAtRest.current && !cameraTransition.current) {
        cameraControls.rotate(camRadiansPerSecond() * delta * 1000, 0, false);
      }
    }
  });

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
          wheel: 16 // Dolly
        } }
        touches={ {
          one: 64, // Touch Rotate
          two: 4096, // Touch Dolly+Truck
          three: 0 // None
        } }
        draggingSmoothTime={ .25 }
        restThreshold={ .00125 }/>
    </>
  )
}

export default SceneControl;