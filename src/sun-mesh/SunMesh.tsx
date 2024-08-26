import  * as THREE  from 'three';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';
import SUN_TEXTURE from '../assets/textures/sun.jpg';
import { SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceObjectName } from '../util/scene.util';



function SunMesh(props: InitMeshProps) {
  const sunSphere = new THREE.SphereGeometry(SUN_RADIUS, 256, 256, (-Math.PI/2) - .002, Math.PI*2);
  const sunTexture = props.textureLoader.load(SUN_TEXTURE);
  sunTexture.colorSpace = THREE.SRGBColorSpace;

  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
  });

  return (
    // <mesh>
      <mesh
        name= { SpaceObjectName.SUN_SPHERE}
        geometry= { sunSphere }
        material= { sunMaterial }
        position={ [0, 0, 0] } >
        <pointLight
          color={ 0xfdfbd3 }
          intensity={ 30000 }
          castShadow={ true } />
      </mesh>
      
    // </mesh>
  )
}

export default SunMesh;