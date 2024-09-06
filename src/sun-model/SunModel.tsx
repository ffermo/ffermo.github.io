import * as THREE from 'three';
import { SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceObject } from '../util/scene.util';
import { degToRad } from 'three/src/math/MathUtils.js';

export interface SunModelProps {
  sunTexture: THREE.Texture;
}
function SunModel(props: SunModelProps) {
  return (
    <mesh
      name={ SpaceObject.SUN_SPHERE }
      position={ [0, 0, 0] }>
      <sphereGeometry
        args={[SUN_RADIUS, 256, 256, (-Math.PI/2) - .002, (Math.PI*2 + degToRad(7.155))]}
      />
      <meshBasicMaterial
        args={[{ map: props.sunTexture }]}
      />
      <pointLight
        color={ 0xfdfbd3 }
        intensity={ 30000 }
        castShadow={ true }
      />
    </mesh>
  )
}

export default SunModel;