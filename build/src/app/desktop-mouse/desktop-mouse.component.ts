import { Component, Input, OnInit } from '@angular/core';
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import { Coordinates, isNearTarget, ORLANDO_FL_LOC, QUEZON_PH_LOC } from '../../util/location.util';

@Component({
  selector: 'desktop-mouse-handler',
  templateUrl: './desktop-mouse.component.html',
  styleUrls: ['./desktop-mouse.component.scss']
})
export class DesktopMouseComponent implements OnInit {
  // @ViewChild("spaceCanvas") space: ElementRef;

  scene: THREE.Scene;
  @Input() camera: THREE.PerspectiveCamera;
  @Input() controls: CameraControls;
  @Input() earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  // directLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  renderer: THREE.WebGLRenderer;
  isPaused = false;

  raycaster: THREE.Raycaster = new THREE.Raycaster();
  spherical: THREE.Spherical = new THREE.Spherical();

  // Mouse helpers.
  pointer: THREE.Vector2 = new THREE.Vector2();
  isMouseDownEarth: boolean = false;
  isMouseRotatingEarth: boolean = false;
  isHoveringTarget: boolean = false;

  animationFrame: number;

  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  constructor() {
  }

  ngOnInit(): void {
    window.addEventListener('mousedown', ev => {
      ev.preventDefault();
      if (ev) {
        this.onMouseClick(ev);
      }
    }, { passive: false });

    window.addEventListener('mousemove', ev => {
      ev.preventDefault();
      if (ev) {
        // this.onMouseMove(ev);
      }
    }, { passive: false });

    window.addEventListener('mouseenter', ev => {
      ev.preventDefault();
      if (ev) {
        // this.onMouseEnter(ev);
      }
    }, { passive: false });

    window.addEventListener('mouseup', ev => {
      ev.preventDefault();
      if (ev) {
        // this.onMouseUp(ev);
      }
    }, { passive: false });
  }

  onMouseClick(event: any) {
    this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = -( event.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersects = this.raycaster.intersectObject(this.earth);

    if (intersects.length > 0) {
      intersects.forEach(intersect => {
        const localPoint = new THREE.Vector3();
        this.earth.worldToLocal(localPoint.copy(intersect.point));
        this.spherical.setFromVector3(localPoint);

        const lon = THREE.MathUtils.radToDeg(this.spherical.theta);
        const lat = THREE.MathUtils.radToDeg(Math.PI / 2 - this.spherical.phi);
        const localCoords: Coordinates = { lon: lon, lat: lat };

        if (isNearTarget(localCoords, QUEZON_PH_LOC)) {
          console.log("NEAR QUEZON");
          this.isPaused = true;
        } else if (isNearTarget(localCoords, ORLANDO_FL_LOC)) {
          console.log("NEAR ORLANDO");
          this.isPaused = true;
        } else {
          this.isPaused = false;
        }
      });
    }
  }
}
