import * as THREE from 'three';

export class SceneSetup {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.ground = null;
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null;
    
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.5,
      1000
    );
    this.camera.position.set(8, 4, 8); 
    this.camera.lookAt(0, 1, 0); 

    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true,
      alpha: true, 
      premultipliedAlpha: false, 
      preserveDrawingBuffer: true 
    });
    this.renderer.setClearColor(0x000000, 0); 
    this.renderer.setClearAlpha(0); 
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    this.renderer.autoClear = true;
    this.renderer.autoClearColor = true;
    this.renderer.autoClearDepth = true;
    this.renderer.autoClearStencil = true;
    
    return { scene: this.scene, camera: this.camera, renderer: this.renderer };
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 1.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    this.scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1.2, 25);
    pointLight.position.set(0, 5, 5);
    this.scene.add(pointLight);

    const sideLight = new THREE.PointLight(0xffffff, 1.0, 20);
    sideLight.position.set(-5, 3, 0);
    this.scene.add(sideLight);

    const topLight = new THREE.PointLight(0xffffff, 0.8, 30);
    topLight.position.set(0, 8, 0);
    this.scene.add(topLight);
  }

  setupGround() {
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xDEB887, 
      roughness: 0.8,
      metalness: 0.1
    });
    
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.receiveShadow = true;
    this.ground.name = 'ground';
    this.scene.add(this.ground);

    return this.ground;
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  getSceneObjects() {
    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      ground: this.ground
    };
  }
} 