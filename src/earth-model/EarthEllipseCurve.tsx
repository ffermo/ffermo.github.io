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
    // TODO: Set up earth's eccentricity
    EARTH_AU / 2,
    EARTH_AU,
  );
  const ellipsePoints = earthEllipse.getPoints(2000);

  useEffect(() => {
    // TODO: Set up earth's inclination.
    const ellipse = earthEllipseRef.current;
    if (ellipse) {
      ellipse.rotateX(Math.PI / 2);
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