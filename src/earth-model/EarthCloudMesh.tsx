import * as THREE from 'three';
import { EARTH_AU, EARTH_RADIUS } from '../util/solarsystem.util';
import EARTH_CLOUDS from '../assets/textures/earth_clouds.jpg';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';
import { SpaceObjectName } from '../util/scene.util';


function EarthCloudMesh(props: InitMeshProps) {
  const earthCloudSphere = new THREE.SphereGeometry(EARTH_RADIUS + (EARTH_RADIUS * .005), 256, 256, (-Math.PI/2) - .002, Math.PI*2);
  const earthCloudTexture = props.textureLoader.load(EARTH_CLOUDS);

  earthCloudTexture.colorSpace = THREE.SRGBColorSpace;
  const earthCloudMaterial = new THREE.MeshLambertMaterial({
    alphaMap: earthCloudTexture,
    transparent: true,
  });

  return (
    <mesh 
      name= { SpaceObjectName.CLOUD_SPHERE }
      geometry={ earthCloudSphere } 
      material={ earthCloudMaterial }
      position={ [0, 0, EARTH_AU] }/>
  )
}

export default EarthCloudMesh;