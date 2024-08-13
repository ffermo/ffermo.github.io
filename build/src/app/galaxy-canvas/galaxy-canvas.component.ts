import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { DeviceDetectorService } from 'ngx-device-detector';
import CameraControls from 'camera-controls';
import { 
  CAMERA_FOV, 
  CLOUDS_TEXTURE_PATH, 
  EARTH_NORMAL_PATH, 
  EARTH_SPEC_PATH, 
  EARTH_TEXTURE_PATH, 
  GALAXY_TEXTURE_PATH, 
  MAX_CAMERA_DIST, 
  MIN_CAMERA_DIST } from '../../util/scene.util';

const TEXTURE_PATHS: string[] = [
  GALAXY_TEXTURE_PATH,
  EARTH_TEXTURE_PATH,
  EARTH_NORMAL_PATH, 
  EARTH_SPEC_PATH,
  CLOUDS_TEXTURE_PATH
]
  
@Component({
  selector: 'app-galaxy-canvas',
  templateUrl: './galaxy-canvas.component.html',
  styleUrls: ['./galaxy-canvas.component.scss']
})

export class GalaxyCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild("spaceCanvas") space: ElementRef;
  isDesktop: boolean;
  isMobile: boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private cdr: ChangeDetectorRef
  ) {
    CameraControls.install( { THREE: THREE } );
    if (this.deviceService.isMobile()) {
      console.log("MOBILE LOADED");
      this.isMobile = this.deviceService.isMobile();
    }

    if (this.deviceService.isDesktop()) {
      console.log("DESKTOP LOADED");
      this.isDesktop = this.deviceService.isDesktop();
    }
  }
  
  loadingManager: THREE.LoadingManager = THREE.DefaultLoadingManager;
  textureLoader: THREE.TextureLoader;
  texturesLoaded: THREE.Texture[];
  
  scene: THREE.Scene;
  clock: THREE.Clock;
  camera: THREE.PerspectiveCamera;
  controls: CameraControls;
  directLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  renderer: THREE.WebGLRenderer;
  isPaused = false;

  // Mouse helpers.
  pointer: THREE.Vector2 = new THREE.Vector2();
  isMouseDownEarth: boolean = false;
  isMouseRotatingEarth: boolean = false;
  isHoveringTarget: boolean = false;

  animationFrame: number;

  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  get spaceCanvas() { return this.space.nativeElement }
  
  ngOnInit() {
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.scene = new THREE.Scene(); 
  }

  ngAfterViewInit(): void {
    this.setCanvas();
    this.setGalaxy();
    this.setEarth();
    this.setLights();
    this.setRenderer();
    this.setCamera();
    this.animate();
    this.cdr.detectChanges();
  }

  setCanvas() {
    this.spaceCanvas.width = window.innerWidth;
    this.spaceCanvas.height = window.innerHeight;
  }

  setGalaxy() {
    this.textureLoader.load(GALAXY_TEXTURE_PATH, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const galaxyPlane = new THREE.SphereGeometry(64, 256, 256);
      const galaxyMaterial = new THREE.MeshBasicMaterial( {
        map: texture,
        side: THREE.DoubleSide
      } );
      const galaxy = new THREE.Mesh(galaxyPlane, galaxyMaterial);
  
      galaxy.position.z = 0;
      galaxy.rotateZ(-Math.PI/8);
      this.scene.add(galaxy);
    });
  }

  setEarth() {
    // Earth textures and mesh.
    const earthSphere = new THREE.SphereGeometry(1, 256, 256, (-Math.PI/2) - .002, Math.PI*2);
    const earthTexture = this.textureLoader.load(EARTH_TEXTURE_PATH);
    const normalTexture = this.textureLoader.load(EARTH_NORMAL_PATH);
    const specularTexture = this.textureLoader.load(EARTH_SPEC_PATH);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    normalTexture.colorSpace = THREE.SRGBColorSpace;
    specularTexture.colorSpace = THREE.SRGBColorSpace;
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(10, 10),
      specularMap: specularTexture,
    });

    // Cloud textures and mesh
    const cloudSphere = new THREE.SphereGeometry(1.01, 256, 256);
    const cloudTexture = this.textureLoader.load(CLOUDS_TEXTURE_PATH);
    cloudTexture.colorSpace = THREE.SRGBColorSpace;

    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: .25,
    })

    this.earth = new THREE.Mesh(earthSphere, earthMaterial);
    this.clouds = new THREE.Mesh(cloudSphere, cloudMaterial);
    this.earth.position.z = 2;
    this.clouds.position.z = 2;
    this.scene.add(this.earth);
    this.scene.add(this.clouds);
  }

  setLights() {
    this.directLight = new THREE.DirectionalLight(0xfdfbd3, .75);
    this.directLight.position.set( 4, 0, 1 );
    this.directLight.castShadow = true;
    this.directLight.target = this.earth;

    this.ambientLight = new THREE.AmbientLight(0xfdfbd3, .1);
  }

  setRenderer() {
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({canvas: this.spaceCanvas, antialias: true});
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, .1, 1000);
    this.camera.position.set(0, 0, 8);
    this.scene.add(this.camera);

    this.camera.add(this.directLight);
    this.camera.add(this.ambientLight);

    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.mouseButtons.right = CameraControls.ACTION.NONE;
    this.controls.mouseButtons.middle = CameraControls.ACTION.NONE;
    this.controls.maxDistance = MAX_CAMERA_DIST;
    this.controls.minDistance = MIN_CAMERA_DIST;
    this.controls.azimuthRotateSpeed = .5;
    this.controls.polarRotateSpeed = .5;
    this.controls.draggingSmoothTime = .25;
    this.controls.setTarget(
      this.earth.position.x,
      this.earth.position.y,
      this.earth.position.z
    );
  }

  updateScene() {
    this.camera.aspect = this.spaceCanvas.width / this.spaceCanvas.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  animate(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.controls.update(this.clock.getDelta());
    console.log(this.camera.fov);
    this.animationFrame = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(event: any) {
    this.setCanvas();
    this.updateScene();
  }
}
