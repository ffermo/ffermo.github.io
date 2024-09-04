import { SUN_RADIUS } from '../util/solarsystem.util';
import { SpaceObjectName } from '../util/scene.util';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';

function SunMesh(props: InitMeshProps) {
  return (
    <mesh
      name={ SpaceObjectName.SUN_SPHERE }
      position={ [0, 0, 0] }>
      <sphereGeometry args={[SUN_RADIUS, 256, 256, (-Math.PI/2) - .002, Math.PI*2]}/>
      <meshBasicMaterial args={[{
        map: props.textures[0]
      }]} />
      <pointLight
        color={ 0xfdfbd3 }
        intensity={ 30000 }
        castShadow={ true } />
    </mesh>
  )
}

export default SunMesh;