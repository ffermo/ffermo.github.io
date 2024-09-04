import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { InitMeshProps } from '../space-canvas/SpaceCanvas';

function GalaxyMesh(props: InitMeshProps) {
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
        map: props.textures[0],
        side: THREE.BackSide,
      }]} />
    </mesh>
  )
}

export default GalaxyMesh;