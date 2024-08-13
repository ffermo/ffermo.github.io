import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { Coordinates, isNearTarget, ORLANDO_FL_LOC, QUEZON_PH_LOC } from '../../util/location.util';
import CameraControls from 'camera-controls';


@Component({
  selector: 'app-mobile-galaxy-canvas',
  templateUrl: './mobile-galaxy-canvas.component.html',
  styleUrls: ['./mobile-galaxy-canvas.component.scss']
})
export class MobileGalaxyCanvasComponent implements OnInit {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: CameraControls;
  directLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  tweenCamera: TWEEN.Tween<any>;
  renderer: THREE.WebGLRenderer;
  isPaused = false;

  raycaster: THREE.Raycaster = new THREE.Raycaster();
  spherical: THREE.Spherical = new THREE.Spherical();

  // // Mouse helpers.
  // pointer: THREE.Vector2 = new THREE.Vector2();
  // touches: TouchList;
  // isHoveringTarget: boolean = false;

  animationFrame: number;

  galaxy: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  constructor() {
  }

  ngOnInit() {
    window.addEventListener('touchstart', ev => {
      ev.preventDefault();
    }, { passive: false });

    // window.addEventListener('touchend', ev => {
    //   // this.onTouchEnd(ev);
    // }, { passive: false });

    // this.scene = new THREE.Scene(); 
  }

  // ngAfterViewInit(): void {
  //   this.setCanvas();
  //   this.setGalaxy();
  //   this.setEarth();
  //   this.setLights();
  //   this.setRenderer();
  //   this.setCamera();
  //   this.animate();
  // }
  
  // ngOnDestroy(): void {
  //   this.galaxy.material.dispose();
  //   this.galaxy.geometry.dispose();
  //   this.earth.material.dispose();
  //   this.earth.geometry.dispose();
  //   this.clouds.material.dispose();
  //   this.clouds.geometry.dispose();
  //   this.directLight.dispose();
  //   this.ambientLight.dispose();
  //   this.renderer.dispose();
  // }

  // setCanvas() {
  //   this.spaceCanvas.width = window.innerWidth;
  //   this.spaceCanvas.height = window.innerHeight;
  // }

  // setGalaxy() {
  //   new THREE.TextureLoader().load('assets/textures/milkyway.jpg', texture => {
  //     const galaxyPlane = new THREE.SphereGeometry(64, 256, 256);
  //     const galaxyTexture = texture;
  //     const galaxyMaterial = new THREE.MeshBasicMaterial( {
  //       map: galaxyTexture,
  //       side: THREE.DoubleSide
  //     } );
  //     this.galaxy = new THREE.Mesh(galaxyPlane, galaxyMaterial);
  
  //     this.galaxy.position.z = 0;
  //     this.galaxy.rotateZ(-Math.PI/8);
  //     this.scene.add(this.galaxy);
  //   });
  // }

  // setEarth() {
  //   // Earth textures and mesh.
  //   const earthSphere = new THREE.SphereGeometry(1, 256, 256, (-Math.PI/2) - .002, Math.PI*2);
  //   const normalTexture = new THREE.TextureLoader().load('assets/textures/earth_normal.jpg');
  //   const specularTexture = new THREE.TextureLoader().load('assets/textures/earth_spec.jpg');
  //   const earthMaterial = new THREE.MeshPhongMaterial({
  //     map: EARTH_TEXTURE,
  //     normalMap: normalTexture,
  //     normalScale: new THREE.Vector2(10, 10),
  //     specularMap: specularTexture,
  //   });

  //   // Cloud textures and mesh
  //   const cloudSphere = new THREE.SphereGeometry(1.01, 256, 256);
  //   const cloudTexture = new THREE.TextureLoader().load('assets/textures/earth_clouds.jpg');

  //   const cloudMaterial = new THREE.MeshBasicMaterial({
  //     map: cloudTexture,
  //     transparent: true,
  //     opacity: .25,
  //   })

  //   this.earth = new THREE.Mesh(earthSphere, earthMaterial);
  //   this.clouds = new THREE.Mesh(cloudSphere, cloudMaterial);
  //   this.scene.add(this.earth);
  //   this.scene.add(this.clouds);
  // }

  // setLights() {
  //   this.directLight = new THREE.DirectionalLight(0xfdfbd3, .75);
  //   this.directLight.position.set( 4, 0, 1 );
  //   this.directLight.castShadow = true;
  //   this.directLight.target = this.earth;

  //   this.ambientLight = new THREE.AmbientLight(0xfdfbd3, .1);
  // }

  // setRenderer() {
  //   this.renderer = new THREE.WebGL1Renderer({canvas: this.spaceCanvas, antialias: true});
  //   this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
  //   this.renderer.setPixelRatio(window.devicePixelRatio);
  // }

  // setCamera() {
  //   this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, .1, 1000);
  //   this.camera.position.set(0, 0, 8);
  //   this.scene.add(this.camera);

  //   this.camera.add(this.directLight);
  //   this.camera.add(this.ambientLight);

  //   this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  //   this.controls.enableDamping = true;
  //   this.controls.enableRotate = true;
  //   this.controls.enableZoom = true;
  //   this.controls.maxDistance = 48;
  //   this.controls.minDistance = 2;
  //   this.controls.enablePan = false;
  //   this.controls.rotateSpeed = .4;
  //   this.controls.dampingFactor = .025;
  //   this.controls.target = this.earth.position;
  // }

  // updateScene() {
  //   this.camera.aspect = this.spaceCanvas.width / this.spaceCanvas.height;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
  //   this.renderer.setPixelRatio(window.devicePixelRatio);
  // }

  // animate(): void {
  //   if (this.animationFrame) {
  //     cancelAnimationFrame(this.animationFrame);
  //   }
  //   TWEEN.update();
  //   this.controls.update();
  //   this.animationFrame = requestAnimationFrame(() => this.animate());
  //   this.renderer.render(this.scene, this.camera);
  // }

  // onMouseClick(event: any) {
  //   this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  //   this.pointer.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  //   this.raycaster.setFromCamera(this.pointer, this.camera)

  //   const intersects = this.raycaster.intersectObject(this.earth);

  //   if (intersects.length > 0) {
  //     intersects.forEach(intersect => {
  //       const localPoint = new THREE.Vector3();
  //       this.earth.worldToLocal(localPoint.copy(intersect.point)); 
  //       this.spherical.setFromVector3(localPoint);

  //       const lat = THREE.MathUtils.radToDeg(Math.PI / 2 - this.spherical.phi);
  //       const lon = THREE.MathUtils.radToDeg(this.spherical.theta);
  //       const localCoords: Coordinates = {lon: lon, lat: lat};

  //       if (this.isNearTarget(localCoords, QUEZON_PH_LOC)) {
  //         this.isPaused = true;
  //       } else if (this.isNearTarget(localCoords, ORLANDO_FL_LOC)){
  //         this.isPaused = true;
  //       } else {
  //         this.isPaused = false;
  //       }
  //     });
  //   }
  // }

  onTouchStart(event: any) {
    // TODO
  }

  onTouchMove(event: any) {
    // TODO
  }
}

