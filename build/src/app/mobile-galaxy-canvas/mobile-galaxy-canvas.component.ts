import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export interface LatLon {
  lat: number;
  lon: number;
}

const EARTH_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/earth.jpg');
const MAX_FOV: number = 120;
const MIN_FOV: number = 40;

const QUEZON_TARGET: LatLon = {lat: 14.4, lon: 121}
const ORLANDO_TARGET: LatLon = {lat: 28.3, lon: -81.2}

@Component({
  selector: 'app-mobile-galaxy-canvas',
  templateUrl: './mobile-galaxy-canvas.component.html',
  styleUrls: ['./mobile-galaxy-canvas.component.scss']
})
export class MobileGalaxyCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild("spaceCanvas") space: ElementRef;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  directLight: THREE.DirectionalLight;
  ambientLight: THREE.AmbientLight;
  tweenCamera: TWEEN.Tween<any>;
  renderer: THREE.WebGLRenderer;
  isPaused = false;

  raycaster: THREE.Raycaster = new THREE.Raycaster();
  spherical: THREE.Spherical = new THREE.Spherical();

  // Mouse helpers.
  pointer: THREE.Vector2 = new THREE.Vector2();
  touches: TouchList;
  isMouseDownEarth: boolean = false;
  isMouseRotatingEarth: boolean = false;
  isHoveringTarget: boolean = false;

  animationFrame: number;

  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  get spaceCanvas() { return this.space.nativeElement }
  constructor() {
  }

  ngOnInit() {
    window.addEventListener('touchstart', ev => {
      this.onTouchStart(ev);
    }, { passive: false });
    
    window.addEventListener('touchmove', ev => {
      this.onTouchMove(ev);
    });

    window.addEventListener('touchend', ev => {
      this.onTouchEnd(ev);
    });

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
  }

  setCanvas() {
    this.spaceCanvas.width = window.innerWidth;
    this.spaceCanvas.height = window.innerHeight;
  }

  setGalaxy() {
    new THREE.TextureLoader().load('assets/textures/milkyway_sphere.jpg', texture => {
      const galaxyPlane = new THREE.SphereGeometry(64, 256, 256);
      const galaxyTexture = texture;
      const galaxyMaterial = new THREE.MeshBasicMaterial( {
        map: galaxyTexture,
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
    const normalTexture = new THREE.TextureLoader().load('assets/textures/earth_normal.jpg');
    const specularTexture = new THREE.TextureLoader().load('assets/textures/earth_spec.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: EARTH_TEXTURE,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(10, 10),
      specularMap: specularTexture,
    });

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
    this.renderer = new THREE.WebGL1Renderer({canvas: this.spaceCanvas, antialias: true});
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(MAX_FOV, window.innerWidth / window.innerHeight, .1, 1000);
    this.camera.position.set(0, 0, 4);
    this.scene.add(this.camera);

    this.camera.add(this.directLight);
    this.camera.add(this.ambientLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableRotate = false;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = .25;
    this.controls.dampingFactor = .025;
    this.controls.target = this.earth.position;
  }

  updateScene() {
    this.camera.aspect = this.spaceCanvas.width / this.spaceCanvas.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // this.animate();
  }

  animate(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    TWEEN.update();
    this.controls.update();
    this.animationFrame = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  isNearTarget(local: LatLon, target: LatLon): boolean {
    return Math.abs(local.lat - target.lat) < .5 && 
      Math.abs(local.lon - target.lon) < .5
  }

  onWindowResize(event: any) {
    this.setCanvas();
    this.updateScene();
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

        const lat = THREE.MathUtils.radToDeg(Math.PI / 2 - this.spherical.phi);
        const lon = THREE.MathUtils.radToDeg(this.spherical.theta);
        const localCoords: LatLon = {lat: lat, lon: lon};

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

  onTouchStart(event: any) {
    event.preventDefault();
    this.touches = event.touches;

    if (this.touches.length === 1) {
      this.pointer.x = ( this.touches[0].clientX / window.innerWidth ) * 2 - 1;
      this.pointer.y = -( this.touches[0].clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera(this.pointer, this.camera)
    }
    
    const intersects = this.raycaster.intersectObject(this.earth);

    if (intersects && intersects.length > 0) {
      console.log("TOUCHED EARTH");
      this.isMouseDownEarth = true;
    } else {
      console.log("TOUCHED SPACE");
    }
  }

  onTouchMove(event: any) {
    this.pointer.x = ( this.touches[0].clientX / window.innerWidth ) * 2 - 1;
    this.pointer.y = -( this.touches[0].clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera)

    const intersects = this.raycaster.intersectObject(this.earth);
    if (intersects && intersects.length > 0 && !this.controls.enableRotate) {
      this.controls.enableRotate = true;
      console.log("ENABLED ROTATE")
    } else if ((!intersects || intersects.length === 0) && this.controls.enableRotate) {
      if (!this.isMouseRotatingEarth) {
        this.controls.enableRotate = false;
      }
    }
    if (this.isMouseDownEarth) {
      this.isMouseRotatingEarth = true;
    }
  }

  onMouseEnter(event: any) {
    if (event.buttons === 0) {
      this.isMouseDownEarth = false;
      this.isMouseRotatingEarth = false;
    }
  }

  onTouchEnd(event: any) {
    this.isMouseDownEarth = false;
    this.isMouseRotatingEarth = false;
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

