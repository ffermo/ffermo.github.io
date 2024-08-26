import * as THREE from 'three';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';
import EARTH_TEXTURE from '../assets/textures/earth.jpg';
import EARTH_BUMP from '../assets/textures/earth_bump.jpg';
import EARTH_SPEC from '../assets/textures/earth_spec.jpg';
import { EARTH_AU, EARTH_RADIUS } from '../util/solarsystem.util';
import { SpaceObjectName } from '../util/scene.util';


function EarthGroundMesh(props: InitMeshProps) {
  const earthSphere = new THREE.SphereGeometry(EARTH_RADIUS, 256, 256, (-Math.PI/2) - .002, Math.PI*2);
  const earthTexture = props.textureLoader.load(EARTH_TEXTURE);
  const bumpTexture = props.textureLoader.load(EARTH_BUMP);
  const specularTexture = props.textureLoader.load(EARTH_SPEC);
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  bumpTexture.colorSpace = THREE.SRGBColorSpace;
  specularTexture.colorSpace = THREE.SRGBColorSpace;
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpTexture,
    bumpScale: 5,
    specularMap: specularTexture
  });

  return (
    <mesh 
      name= { SpaceObjectName.EARTH_SPHERE }
      geometry={ earthSphere } 
      material={ earthMaterial }
      position={ [0, 0, EARTH_AU] }/>
  )
}

export default EarthGroundMesh;