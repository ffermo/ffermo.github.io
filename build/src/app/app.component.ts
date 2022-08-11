import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  IMAGE_LOADER: THREE.ImageLoader = new THREE.ImageLoader();
  BACKGROUND_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/milkyway.jpg');
  EARTH_TEXTURE: THREE.Texture = new THREE.TextureLoader().load('assets/textures/earth_night.jpg');

  @ViewChild("spaceCanvas") space: ElementRef;

  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  animationFrame: number;

  earth: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial>;
  clouds: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;

  get spaceCanvas() { return this.space.nativeElement }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.scene.background = this.BACKGROUND_TEXTURE;
    this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  }

  ngAfterViewInit(): void {
    this.setScene();
  }

  setScene() {
    this.setCanvas();;
    this.renderer = new THREE.WebGL1Renderer({canvas: this.spaceCanvas, antialias: true, logarithmicDepthBuffer: true});
    this.renderer.setSize(this.spaceCanvas.width, this.spaceCanvas.height);
    const sphere = new THREE.SphereGeometry(3, 256, 256);
    const cloudSphere = new THREE.SphereGeometry(3.01, 256, 256);
    const texture = new THREE.TextureLoader().load('assets/textures/earth_night.jpg');
    const normalTexture = new THREE.TextureLoader().load('assets/textures/earth_normal.jpg');
    const specularTexture = new THREE.TextureLoader().load('assets/textures/earth_spec.jpg');
    const cloudTexture = new THREE.TextureLoader().load('assets/textures/earth_clouds.jpg')
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(5, 5),
      specularMap: specularTexture,
    });

    const cloudMaterial = new THREE.MeshBasicMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: .15,
    })

    this.earth = new THREE.Mesh(sphere, material);
    this.clouds = new THREE.Mesh(cloudSphere, cloudMaterial);
    this.scene.add(this.earth);
    this.scene.add(this.clouds);

    const light = new THREE.DirectionalLight(0xfdfbd3, 1);
    light.position.set( 1, 0, 1 ).normalize();
    light.castShadow = true;

    this.scene.add(new THREE.AmbientLight(0xfdfbd3, .1))
    this.scene.add(light);

    this.animate();
  }

  onResize(event: any) {
    this.setCanvas();
    this.updateScene();
  }

  setCanvas() {
    this.spaceCanvas.width = window.innerWidth;
    this.spaceCanvas.height = window.innerHeight;
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
  }

  render(): void {
    this.earth.rotateX(.00005)
    this.earth.rotateY(-.0001);
    this.clouds.rotateX(.00005)
    this.clouds.rotateY(-.0001);

    this.camera.position.z = 5;
    this.renderer.render(this.scene, this.camera);
  }
}
