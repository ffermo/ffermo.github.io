import { Canvas } from '@react-three/fiber';
import  * as THREE  from 'three';
import GalaxyMesh from '../galaxy-mesh/GalaxyMesh';
import SunMesh from '../sun-mesh/SunMesh';
import EarthGroundMesh from '../earth-model/EarthGroundMesh';
import CameraControl from '../scene-controller/SceneControl';
import { CAMERA_FAR_PLANE, CAMERA_FOV, CAMERA_NEAR_PLANE } from '../util/scene.util';
import EarthCloudMesh from '../earth-model/EarthCloudMesh';
import EarthEllipseCurve from '../earth-model/EarthEllipseCurve';

export interface InitMeshProps {
  textureLoader: THREE.TextureLoader;
}
function SpaceCanvas() {
  const loadingManager: THREE.LoadingManager = THREE.DefaultLoadingManager;
  const textureLoader: THREE.TextureLoader = new THREE.TextureLoader(loadingManager);

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR_PLANE, CAMERA_FAR_PLANE);
  camera.position.set(0, 0, 8);

  return (
    <Canvas camera={ camera }>
      <ambientLight
        color={ 0xfdfbd3 }
        intensity={ .1 }
        position={ [0, 0, 0] } />
      <GalaxyMesh
        textureLoader={ textureLoader } />
      <SunMesh
        textureLoader={ textureLoader } />
      <EarthGroundMesh
        textureLoader={ textureLoader } />
      <EarthCloudMesh
        textureLoader={ textureLoader } />
      <EarthEllipseCurve />
      <CameraControl />
    </Canvas>
  )
}

export default SpaceCanvas