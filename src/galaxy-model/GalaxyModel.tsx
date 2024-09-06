import * as THREE from 'three';
import { useEffect, useRef } from 'react';

export interface GalaxyModelProps {
  galaxyTexture: THREE.Texture;
}

function GalaxyModel(props: GalaxyModelProps) {
  const galaxyRef = useRef<any>();

  useEffect(() => {
    galaxyRef.current?.rotateZ(Math.PI/4);
    galaxyRef.current?.rotateY(Math.PI/32);
  });

  return (
    <mesh
      ref={ galaxyRef }>
      <sphereGeometry args={[1024, 1024, 1024]}/>
      <meshBasicMaterial args={[{
        map: props.galaxyTexture,
        side: THREE.BackSide,
      }]} />
    </mesh>
  )
}

export default GalaxyModel;