import { EARTH_AU, EARTH_RADIUS } from '../util/solarsystem.util';
import { SpaceObjectName } from '../util/scene.util';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';

function EarthCloudMesh(props: InitMeshProps) {
  return (
    <mesh
      name={ SpaceObjectName.CLOUD_SPHERE }
      position={ [0, 0, EARTH_AU] }>
      <sphereGeometry args={[EARTH_RADIUS + (EARTH_RADIUS * .005), 256, 256, (-Math.PI/2) - .002, Math.PI*2]}/>
      <meshLambertMaterial args={[{
        alphaMap: props.textures[0],
        transparent: true,
      }]} />
    </mesh>
  )
}

export default EarthCloudMesh;