import  * as THREE  from 'three';
import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import GalaxyModel from '../galaxy-model/GalaxyModel';
import SunModel from '../sun-model/SunModel';
import SceneControl from '../scene-controller/SceneControl';
import { CAMERA_FAR_PLANE, CAMERA_FOV, CAMERA_NEAR_PLANE } from '../util/scene.util';
import GALAXY_TEXTURE_IMAGE from '../assets/textures/milkyway.jpg';
import SUN_TEXTURE from '../assets/textures/sun.jpg';
import EARTH_TEXTURE from '../assets/textures/earth.jpg';
import EARTH_BUMP from '../assets/textures/earth_bump.jpg';
import EARTH_SPEC from '../assets/textures/earth_spec.jpg';
import EARTH_CLOUDS from '../assets/textures/earth_clouds.jpg';
import { Loader } from '@react-three/drei';
import EarthModel from '../earth-model/EarthModel';

export interface MeshTextureProps {
  map?: THREE.Texture;
  bumpMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  alphaMap?: THREE.Texture;
}

class SRGBTextureLoader extends THREE.TextureLoader {
  load(
    url: string,
    onLoad?: (data: THREE.Texture<HTMLImageElement>) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void
  ): THREE.Texture<HTMLImageElement> {
    return super.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      onLoad?.(texture);
    }, onProgress, onError);
  }
}

function SpaceScene() {
  const [
    galaxyTexture,
    sunTexture,
    earthTexture,
    earthBumpTexture,
    earthSpecTexture,
    earthCloudTexture,
  ] = useLoader(SRGBTextureLoader, [
    GALAXY_TEXTURE_IMAGE,
    SUN_TEXTURE,
    EARTH_TEXTURE,
    EARTH_BUMP,
    EARTH_SPEC,
    EARTH_CLOUDS,
  ]);

  return (
    <>
      <ambientLight
        color={ 0xfdfbd3 }
        intensity={ .1 }
        position={ [0, 0, 0] } />
      <GalaxyModel
        galaxyTexture={ galaxyTexture }
      />
      <SunModel
        sunTexture={ sunTexture }
      />
      <EarthModel
        earthTexture={ earthTexture }
        earthBumpTexture={ earthBumpTexture }
        earthSpecTexture={ earthSpecTexture }
        earthCloudTexture={ earthCloudTexture }
      />
      <Suspense fallback={ <Loader /> }>
        <SceneControl />
      </Suspense>
    </>
  )
}

function SpaceCanvas() {
  const camera: THREE.PerspectiveCamera = useMemo(() => {
    const cam = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR_PLANE, CAMERA_FAR_PLANE);
    cam.position.set(0, 0, 8);
    return cam;
  }, []);

  return (
    <Canvas camera={ camera }>
      <Suspense fallback={ null }>
        <SpaceScene />
      </Suspense>
    </Canvas>
  )
}

export default SpaceCanvas