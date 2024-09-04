import { Canvas, useLoader } from '@react-three/fiber';
import  * as THREE  from 'three';
import GalaxyMesh from '../galaxy-mesh/GalaxyMesh';
import SunMesh from '../sun-mesh/SunMesh';
import EarthGroundMesh from '../earth-model/EarthGroundMesh';
import SceneControl from '../scene-controller/SceneControl';
import { CAMERA_FAR_PLANE, CAMERA_FOV, CAMERA_NEAR_PLANE } from '../util/scene.util';
import EarthCloudMesh from '../earth-model/EarthCloudMesh';
import EarthEllipseCurve from '../earth-model/EarthEllipseCurve';
import GALAXY_TEXTURE_IMAGE from '../assets/textures/milkyway.jpg';
import SUN_TEXTURE from '../assets/textures/sun.jpg';
import EARTH_TEXTURE from '../assets/textures/earth.jpg';
import EARTH_BUMP from '../assets/textures/earth_bump.jpg';
import EARTH_SPEC from '../assets/textures/earth_spec.jpg';
import EARTH_CLOUDS from '../assets/textures/earth_clouds.jpg';
import { Suspense } from 'react';
import { Loader } from '@react-three/drei';

export interface InitMeshProps {
  textures: THREE.Texture[];
}
function SpaceCanvas() {
  const [
    galaxyTexture,
    sunTexture,
    earthTexture,
    earthBumpTexture,
    earthSpecTexture,
    earthCloudTexture,
  ] = useLoader(THREE.TextureLoader, [
    GALAXY_TEXTURE_IMAGE,
    SUN_TEXTURE,
    EARTH_TEXTURE,
    EARTH_BUMP,
    EARTH_SPEC,
    EARTH_CLOUDS,
  ]);

  galaxyTexture.colorSpace = THREE.SRGBColorSpace;
  sunTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthBumpTexture.colorSpace = THREE.SRGBColorSpace;
  earthSpecTexture.colorSpace = THREE.SRGBColorSpace;
  earthCloudTexture.colorSpace = THREE.SRGBColorSpace;

  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR_PLANE, CAMERA_FAR_PLANE);
  camera.position.set(0, 0, 8);

  return (
    <>
      <Canvas camera={ camera }>
        <Suspense fallback={ null }>
          <ambientLight
            color={ 0xfdfbd3 }
            intensity={ .1 }
            position={ [0, 0, 0] } />
          <GalaxyMesh textures={ [galaxyTexture] }/>
          <SunMesh textures={ [sunTexture] }/>
          <EarthGroundMesh textures={ [earthTexture, earthBumpTexture, earthSpecTexture] }/>
          <EarthCloudMesh textures={ [earthCloudTexture] } />
          <EarthEllipseCurve />
        </Suspense>
        <SceneControl />
      </Canvas>
      <Loader />
    </>
  )
}

export default SpaceCanvas