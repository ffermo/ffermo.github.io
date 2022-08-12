import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  IMAGE_LOADER: THREE.ImageLoader = new THREE.ImageLoader();
  BACKGROUND_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/milkyway.jpg');
  EARTH_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/earth_night.jpg');
  MAX_FOV: number = 125;
  MIN_FOV: number = 50;

  TARGET_LOCAL_POINT = new THREE.Vector3(1.5, .67, 2.5);
  isPaused = false;

  @ViewChild("spaceCanvas") space: ElementRef;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  tweenCamera: TWEEN.Tween<any>
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  pointer: THREE.Vector2 = new THREE.Vector2();
  renderer: THREE.WebGLRenderer;

  animationFrame: number;

  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  get spaceCanvas() { return this.space.nativeElement }

  @HostListener('mousewheel', ['$event']) handleMouseWheel(event: any){
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
    this.scene.background = this.BACKGROUND_TEXTURE;
    this.camera = new THREE.PerspectiveCamera(this.MAX_FOV, window.innerWidth / window.innerHeight, .1, 1000);
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
    const earthSphere = new THREE.SphereGeometry(3, 256, 256);
    const normalTexture = new THREE.TextureLoader().load('assets/textures/earth_normal.jpg');
    const specularTexture = new THREE.TextureLoader().load('assets/textures/earth_spec.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: this.EARTH_TEXTURE,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(5, 5),
      specularMap: specularTexture,
    });

    // Cloud textures and mesh
    const cloudSphere = new THREE.SphereGeometry(3.01, 256, 256);
    const cloudTexture = new THREE.TextureLoader().load('assets/textures/earth_clouds.jpg');

    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: .15,
    })

    this.earth = new THREE.Mesh(earthSphere, earthMaterial);
    this.clouds = new THREE.Mesh(cloudSphere, cloudMaterial);
    this.scene.add(this.earth);
    this.scene.add(this.clouds);
  }

  setLights() {
    const light = new THREE.DirectionalLight(0xfdfbd3, .75);
    light.position.set( 0, 0, 1 ).normalize();
    light.castShadow = true;

    this.scene.add(light)
    this.scene.add(new THREE.AmbientLight(0xfdfbd3, .1))
  }

  setRenderer() {
    this.renderer = new THREE.WebGL1Renderer({canvas: this.spaceCanvas, antialias: true});
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
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
    this.earth.rotateX(.00005)
    this.earth.rotateY(-.0001);
    this.clouds.rotateX(.00005)
    this.clouds.rotateY(-.0001);

    this.camera.position.z = 5;
    this.renderer.render(this.scene, this.camera);
  }

  isNearTarget(localPoint: THREE.Vector3, targetPoint: THREE.Vector3): boolean {
    return Math.abs(localPoint.x - targetPoint.x) < .1 && 
      Math.abs(localPoint.y - targetPoint.y) < .1 &&
      Math.abs(localPoint.z - targetPoint.z) < .1;
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
        if (this.isNearTarget(localPoint, this.TARGET_LOCAL_POINT)) {
          console.log(localPoint);
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
    const minOrMaxFov = Math.max( Math.min( newFov, this.MAX_FOV ), this.MIN_FOV );

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
