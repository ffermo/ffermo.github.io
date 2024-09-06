import * as THREE from 'three';
import { MeshTextureProps } from "../space-canvas/SpaceCanvas";
import { EllipseProps, SpaceObject } from "../util/scene.util";
import { EARTH_AU, EARTH_RADIANS_PER_SECOND, EARTH_RADIUS } from "../util/solarsystem.util";
import { RootState, useFrame } from '@react-three/fiber';
import { EllipsePath } from '../ellipse-model/EllipseModel';
import { Line } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { selectCameraControls, selectCameraTarget } from '../space-store/space.hooks';

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
      name={ SpaceObject.EARTH_SPHERE }
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
      name={ SpaceObject.CLOUD_SPHERE }
      position={ [0, 0, EARTH_AU] }>
      <sphereGeometry args={[EARTH_RADIUS + (EARTH_RADIUS * .005), 256, 256, (-Math.PI/2) - .002, Math.PI*2]}/>
      <meshLambertMaterial args={[{
        alphaMap: props.alphaMap,
        transparent: true,
      }]} />
    </mesh>
  )
}

function EarthEllipseCurve(props: EllipseProps) {
  console.log("EARTH ELLIPSE LOADED");

  return (
    <Line
      name= { SpaceObject.EARTH_ELLIPSE}
      lineWidth={ 2 }
      color={ "dimgray" }
      points={ props.ellipsePoints as THREE.Vector3[] }
      position={ [0, 0, 0] }
    />
  )
}

function EarthScene(props: EllipseProps) {
  console.log("EARTH SCENE LOADING");
  let earth: THREE.Object3D<THREE.Object3DEventMap> | undefined = undefined;
  let clouds: THREE.Object3D<THREE.Object3DEventMap> | undefined = undefined;
  let ellipse: THREE.Object3D<THREE.Object3DEventMap> | undefined = undefined;
  let isCameraAtRest: boolean = false;
  const ellipsePath = props.ellipsePath;
  const cameraControls = useSelector(selectCameraControls);
  const cameraTarget = useSelector(selectCameraTarget);

  if (cameraControls) {
    cameraControls.addEventListener("rest", () => isCameraAtRest = true);
  }
  useFrame((state: RootState, delta: number) => {
    if (earth && clouds && ellipse && ellipsePath) {
      const time = (state.clock.getElapsedTime() * .0005) % 1;
      const point = ellipsePath.getPointAt(time);

      if (cameraControls && isCameraAtRest) {
        earth.rotateY(EARTH_RADIANS_PER_SECOND * delta * 1000);
        clouds.rotateY(EARTH_RADIANS_PER_SECOND * delta * 999);

        earth.position.copy(point);
        earth.position.applyMatrix4(ellipse.matrixWorld);

        clouds.position.copy(point);
        clouds.position.applyMatrix4(ellipse.matrixWorld);
        if (cameraTarget === SpaceObject.EARTH_SPHERE) {
          cameraControls.moveTo(point.x, point.y, point.z, false);
        }
      }
    } else {
      earth = state.scene.getObjectByName(SpaceObject.EARTH_SPHERE);
      ellipse = state.scene.getObjectByName(SpaceObject.EARTH_ELLIPSE);
      clouds = state.scene.getObjectByName(SpaceObject.CLOUD_SPHERE);
    }
  });
  return (
    <>
    </>
  )
}