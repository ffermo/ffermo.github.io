import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import GALAXY_TEXTURE_IMAGE from '../assets/textures/milkyway.jpg';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';

function GalaxyMesh(props: InitMeshProps) {
  const galaxyRef = useRef<any>();
  
  const galaxyPlane = new THREE.SphereGeometry(1024, 1024, 1024);
  const galaxyTexture = props.textureLoader.load(GALAXY_TEXTURE_IMAGE);
  galaxyTexture.colorSpace = THREE.SRGBColorSpace;

  const galaxyMaterial = new THREE.MeshBasicMaterial( {
    map: galaxyTexture,
    side: THREE.BackSide
  } );


  useEffect(() => {
    // galaxyRef.current?.position.setX(0);
    galaxyRef.current?.rotateZ(Math.PI/4);
    galaxyRef.current?.rotateY(Math.PI/32);
  });
  return (
    <mesh 
      ref={galaxyRef}
      geometry={galaxyPlane}
      material={galaxyMaterial}>
    </mesh>
  )
}

export default GalaxyMesh;