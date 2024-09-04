import { EARTH_AU, EARTH_RADIUS } from '../util/solarsystem.util';
import { SpaceObjectName } from '../util/scene.util';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';

function EarthGroundMesh(props: InitMeshProps) {
  return (
    <mesh
      name={ SpaceObjectName.EARTH_SPHERE }
      position={ [0, 0, EARTH_AU] }>
      <sphereGeometry args={[EARTH_RADIUS, 256, 256, (-Math.PI/2) - .002, Math.PI*2]}/>
      <meshLambertMaterial args={[{
        map: props.textures[0],
        bumpMap: props.textures[1],
        bumpScale: 5,
        specularMap: props.textures[2]
      }]} />
    </mesh>
  )
}

export default EarthGroundMesh;