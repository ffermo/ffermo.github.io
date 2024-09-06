import * as THREE from 'three';

export class EllipsePath extends THREE.Curve<THREE.Vector3> {
  xRadius: number;
  yRadius: number;
  rotation: number; 
  rotationalAxis: THREE.Vector3 = new  THREE.Vector3(1, 0, 0); // Rotation around X-axis

  constructor(xRadius: number, yRadius: number, rotation: number = 0) {
    super();

    this.xRadius = xRadius;
    this.yRadius = yRadius;
    this.rotation = rotation;
  }

  getPoint(t: number) {
    var radians = 2 * Math.PI * t;
    const vector = new THREE.Vector3(
      this.xRadius * Math.cos( radians ),
      this.yRadius * Math.sin( radians ),
      0
    );
    if (this.rotation === 0) {
      return vector;
    } else {
      return vector.applyAxisAngle(this.rotationalAxis, this.rotation);
    }
    
  }
}