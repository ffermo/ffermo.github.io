import * as THREE from 'three';
import { EARTH_AU } from '../util/solarsystem.util';
import { Line } from '@react-three/drei';
import { SpaceObjectName } from '../util/scene.util';
import { useEffect, useRef } from 'react';


function EarthEllipseCurve() {
  const earthEllipseRef = useRef<any>(null);
  const earthEllipse = new THREE.EllipseCurve(
    0,
    0,
    EARTH_AU,
    EARTH_AU,
  );
  const ellipsePoints = earthEllipse.getPoints(1000);

  useEffect(() => {
    const ellipse = earthEllipseRef.current;
    if (ellipse) {
      ellipse.rotateX(0.124878308 + (Math.PI / 2));
    }
  })

  return (
    <Line
      ref= { earthEllipseRef }
      name= { SpaceObjectName.EARTH_ELLIPSE}
      lineWidth={ 2 }
      color={ "dimgray" }
      points={ ellipsePoints }
      position={ [0, 0, 0] }/>
  )
}

export default EarthEllipseCurve;