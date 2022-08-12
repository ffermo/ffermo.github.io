import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

const BACKGROUND_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/milkyway.jpg');
const EARTH_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/earth.jpg');
const MAX_FOV: number = 50;
const MIN_FOV: number = 5;

const QUEZON_TARGET: LatLon = {lat: 14.4, lon: 121}
const ORLANDO_TARGET: LatLon = {lat: 28.3, lon: -81.2}

export interface LatLon {
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  
  isPaused = false;

  @ViewChild("spaceCanvas") space: ElementRef;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  tweenCamera: TWEEN.Tween<any>
  renderer: THREE.WebGLRenderer;

  raycaster: THREE.Raycaster = new THREE.Raycaster();
  pointer: THREE.Vector2 = new THREE.Vector2();
  spherical: THREE.Spherical = new THREE.Spherical();

  animationFrame: number;

  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  get spaceCanvas() { return this.space.nativeElement }

  @HostListener('wheel', ['$event']) handleMouseWheel(event: any){
    if (event) {
      this.onMouseWheel(event);
    }
  }
  
  @HostListener('click', ['$event']) handleMouseClick(event: any){
    if (event) {
      this.onMouseClick(event);
    }
  }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.scene.background = BACKGROUND_TEXTURE;
    this.camera = new THREE.PerspectiveCamera(MAX_FOV, window.innerWidth / window.innerHeight, .1, 1000);
  }

  ngAfterViewInit(): void {
    this.setCanvas();
    this.setEarth();
    this.setLights();
    this.setRenderer();
    this.animate();
  }

  setCanvas() {
    this.spaceCanvas.width = window.innerWidth;
    this.spaceCanvas.height = window.innerHeight;
  }

  setEarth() {
    // Earth textures and mesh.
    const earthSphere = new THREE.SphereGeometry(1, 256, 256, (-Math.PI/2) - .002, Math.PI*2);
    const normalTexture = new THREE.TextureLoader().load('assets/textures/earth_normal.jpg');
    const specularTexture = new THREE.TextureLoader().load('assets/textures/earth_spec.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: EARTH_TEXTURE,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(10, 10),
      specularMap: specularTexture,
    });
    // const earthSphere = new THREE.SphereGeometry(1, 256, 256, (-Math.PI/2) - .002, Math.PI*2-.002);


    // Cloud textures and mesh
    const cloudSphere = new THREE.SphereGeometry(1.01, 256, 256);
    const cloudTexture = new THREE.TextureLoader().load('assets/textures/earth_clouds.jpg');

    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: .25,
    })

    this.earth = new THREE.Mesh(earthSphere, earthMaterial);
    this.clouds = new THREE.Mesh(cloudSphere, cloudMaterial);
    this.scene.add(this.earth);
    this.scene.add(this.clouds);
  }

  setLights() {
    const light = new THREE.DirectionalLight(0xfdfbd3, .75);
    light.position.set( 1, 0, 1 ).normalize();
    light.castShadow = true;

    this.scene.add(light)
    this.scene.add(new THREE.AmbientLight(0xfdfbd3, .1))
  }

  setRenderer() {
    this.renderer = new THREE.WebGL1Renderer({canvas: this.spaceCanvas, antialias: true});
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  updateScene() {
    this.camera.aspect = this.spaceCanvas.width / this.spaceCanvas.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);

    this.animate();
  }

  animate(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animationFrame = requestAnimationFrame(() => this.animate());
    this.render();
    TWEEN.update();
  }

  render(): void {
    if (this.isPaused) {
      return;
    }
    // this.earth.rotateX(.00005)
    this.earth.rotateY(-.0003);
    // this.clouds.rotateX(.00005)
    this.clouds.rotateY(-.0003);

    this.camera.position.z = 5;
    this.renderer.render(this.scene, this.camera);
  }

  isNearTarget(local: LatLon, target: LatLon): boolean {
    return Math.abs(local.lat - target.lat) < .5 && 
      Math.abs(local.lon - target.lon) < .5
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
          console.log(localPoint);
          
          const lat = THREE.MathUtils.radToDeg(Math.PI / 2 - this.spherical.phi);
          const lon = THREE.MathUtils.radToDeg(this.spherical.theta);

          const localCoords: LatLon = {lat: lat, lon: lon};

          console.log("lat: " + lat + ", lon: " + lon);
        if (this.isNearTarget(localCoords, QUEZON_TARGET)) {
          this.isPaused = true;
        } else if (this.isNearTarget(localCoords, ORLANDO_TARGET)){
          this.isPaused = true;
        } else {
          this.isPaused = false;
        }
      });
    }
  }

  onWindowResize(event: any) {
    this.setCanvas();
    this.updateScene();
  }

  onMouseWheel(event: any) {
    const newFov = this.camera.fov - event.wheelDeltaY * .1;
    const minOrMaxFov = Math.max( Math.min( newFov, MAX_FOV ), MIN_FOV );

    TWEEN.removeAll();
    this.tweenCamera = new TWEEN.Tween({ fov: this.camera.fov })
      .to({ fov: minOrMaxFov }, 100 )
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate((camera) => {
        this.camera.fov = camera.fov;
        this.camera.updateProjectionMatrix();
        this.renderer.render(this.scene, this.camera);
      });
    
    this.tweenCamera.start();
  }
}
