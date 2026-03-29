import { useCallback, useEffect, useRef } from 'react';
import { RootState, useFrame, useThree } from '@react-three/fiber';
import { EARTH_RADIUS, SUN_RADIANS_PER_SECOND, SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceTarget } from '../util/scene.util';
import { selectCameraControls, selectSpaceTarget, } from '../space-store/space.hooks';
import { useDispatch, useSelector } from 'react-redux';
import { CameraControls } from '@react-three/drei';
import { SetCameraControlsAction, SetEarthTargetAction } from '../space-store/space.actions';
import { AppDispatch } from '../space-store/space.store';
import * as THREE from 'three';
import { LONGMONT_CO_LOC } from '../util/location.util';

function SceneControl() {
  console.log("SceneControl Rendered");
  const dispatch = useDispatch<AppDispatch>();
  const scene: THREE.Scene = useThree(state => state.scene);
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
      const targetPos = earth.getWorldPosition(new THREE.Vector3());

      // Compute Earth-scale constraints
      const minDistance = cameraControls.getDistanceToFitSphere(EARTH_RADIUS);
      const maxDistance = minDistance * 10;
      const midDistance = ((maxDistance - minDistance) * .50) + minDistance;

      // Widen constraints before transition to prevent mid-flight clamping
      cameraControls.minDistance = Math.min(cameraControls.minDistance, minDistance);
      cameraControls.maxDistance = Math.max(cameraControls.maxDistance, maxDistance);

      // Animate target and dolly simultaneously for a smooth swoop
      cameraControls.setTarget(targetPos.x, targetPos.y, targetPos.z, transition);
      await cameraControls.dollyTo(midDistance, transition);

      // Apply final Earth constraints
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = maxDistance;

      cameraTransition.current = false;
      dispatch(SetEarthTargetAction(LONGMONT_CO_LOC));
    }
  }

  async function focusSun(cameraControls: CameraControls, transition: boolean): Promise<void> {
    if (sun) {
      cameraAtRest.current = false;

      const minDistance = cameraControls.getDistanceToFitSphere(SUN_RADIUS);
      const maxDistance = minDistance * 10;
      const targetDistance = ((maxDistance - minDistance) * .15) + minDistance;

      // Widen constraints before transition to prevent mid-flight clamping
      cameraControls.minDistance = Math.min(cameraControls.minDistance, minDistance);
      cameraControls.maxDistance = Math.max(cameraControls.maxDistance, maxDistance);

      // Animate target and dolly simultaneously for a smooth swoop
      cameraControls.setTarget(sun.position.x, sun.position.y, sun.position.z, transition);
      await cameraControls.dollyTo(targetDistance, transition);

      // Apply final Sun constraints
      cameraControls.minDistance = minDistance;
      cameraControls.maxDistance = maxDistance;
    }
  }

  function camRadiansPerSecond(): number {
    switch (spaceTarget) {
      case SpaceTarget.EARTH_SPHERE:
        return 0; // EarthScene co-locates Earth + camera rotation
      case SpaceTarget.SUN_SPHERE:
        return SUN_RADIANS_PER_SECOND;
      default:
        return 0;
    }
  }

  // Register DOM and CameraControls event listeners once when cameraControls is available.
  useEffect(() => {
    if (!cameraControls) return;

    const onMouseDown = (event: MouseEvent) => {
      const target = event?.target as HTMLElement;
      if (event.button == 0 && target?.nodeName === "CANVAS") {
        isPointerDown.current = true;
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      const target = event?.target as HTMLElement;
      if (event.touches.length <= 1 && target?.nodeName === "CANVAS") {
        isPointerDown.current = true;
      }
    };
    const onMouseMove = (event: MouseEvent) => {
      if (isPointerDown.current && event?.button === 0) {
        isPointerDragging.current = true;
        cameraAtRest.current = false;
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      if (isPointerDown.current && event.touches.length <= 2) {
        isPointerDragging.current = true;
        cameraAtRest.current = false;
      }
    };
    const onMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        isPointerDown.current = false;
        isPointerDragging.current = false;
      }
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        isPointerDown.current = false;
        isPointerDragging.current = false;
      }
    };
    const onRest = () => {
      cameraAtRest.current = true;
      cameraTransition.current = false;
    };
    const onTransitionStart = () => {
      cameraTransition.current = !isPointerDown.current && !isPointerDragging.current;
    };

    document.body.addEventListener("mousedown", onMouseDown);
    document.body.addEventListener("touchstart", onTouchStart);
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("touchmove", onTouchMove);
    document.body.addEventListener("mouseup", onMouseUp);
    document.body.addEventListener("touchend", onTouchEnd);
    cameraControls.addEventListener("rest", onRest);
    cameraControls.addEventListener("transitionstart", onTransitionStart);

    return () => {
      document.body.removeEventListener("mousedown", onMouseDown);
      document.body.removeEventListener("touchstart", onTouchStart);
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("touchmove", onTouchMove);
      document.body.removeEventListener("mouseup", onMouseUp);
      document.body.removeEventListener("touchend", onTouchEnd);
      cameraControls.removeEventListener("rest", onRest);
      cameraControls.removeEventListener("transitionstart", onTransitionStart);
    };
  }, [cameraControls]);

  // Switch camera target when spaceTarget changes.
  useEffect(() => {
    if (!cameraControls) return;
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
  }, [cameraControls, spaceTarget])

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