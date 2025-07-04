import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class RobotController {
  constructor(config) {
    this.config = config;
   
    this.robotGroup = new THREE.Group();
    this.robotModel = null;
    this.animations = [];
    this.mixer = null;
    
    this.state = {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      isMoving: false,
      currentAnimation: null,
      targetPosition: null,
      movementSpeed: 2.5,
      rotationSpeed: 8.0
    };
    
    this.headBone = null;
    this.headTrackingEnabled = false;
    this.mousePosition = new THREE.Vector2();
    this.targetHeadRotation = new THREE.Euler();
    
    this.movementTween = null;
    
    this.initialPosition = new THREE.Vector3(0, 0, 0);
    this.initialRotation = new THREE.Euler(0, 0, 0);
  }

  async loadRobot(modelPath) {
    return new Promise((resolve, reject) => {   
      const loader = new GLTFLoader();    
      loader.load(
        modelPath,
        (gltf) => {
          this.onModelLoaded(gltf);
          resolve(gltf);
        },
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          return percent;
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  onModelLoaded(gltf) {

    this.robotModel = gltf.scene;
    this.animations = gltf.animations;
    
    this.setupRobotModel();
    this.setupAnimations();
    this.findHeadBone();
    this.robotGroup.add(this.robotModel);
    this.resetPosition();
  }

  setupRobotModel() {
    this.robotModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });

    this.robotModel.scale.setScalar(1);
    this.robotModel.name = 'Robot';
  }

  setupAnimations() {
    if (this.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.robotModel);
    }
  }

  findHeadBone() {
    this.robotModel.traverse((child) => {
      if (child.isBone || child.isObject3D) {
        const name = child.name.toLowerCase();
        if (name.includes('head') || name.includes('neck')) {
          this.headBone = child;
          this.headTrackingEnabled = true;
          return;
        }
      }
    });

    if (!this.headBone) {
      this.headTrackingEnabled = false;
    }
  }

  moveToPosition(targetPosition) {
    if (this.state.isMoving) {
      this.stopMovement();
    }

    this.state.targetPosition = targetPosition.clone();
    this.state.isMoving = true;

    const direction = new THREE.Vector3()
      .subVectors(targetPosition, this.state.position)
      .normalize();
    
    const targetRotationY = Math.atan2(direction.x, direction.z);

    this.animateMovement(targetPosition, targetRotationY);
  }

  animateMovement(targetPosition, targetRotationY) {
    const startPosition = this.state.position.clone();
    const startRotationY = this.robotGroup.rotation.y;
    
    const distance = startPosition.distanceTo(targetPosition);
    const duration = distance / this.state.movementSpeed * 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
     
      const easedProgress = this.easeInOutCubic(progress);
      this.state.position.lerpVectors(startPosition, targetPosition, easedProgress);
      this.robotGroup.position.copy(this.state.position);
      
      const currentRotationY = this.lerp(startRotationY, targetRotationY, easedProgress);
      this.robotGroup.rotation.y = currentRotationY;
      this.state.rotation.y = currentRotationY;
      
      if (progress < 1) {
        this.movementTween = requestAnimationFrame(animate);
      } else {
        this.onMovementComplete();
      }
    };

    this.movementTween = requestAnimationFrame(animate);
  }

  onMovementComplete() {
    this.state.isMoving = false;
    this.state.targetPosition = null;
    this.movementTween = null;
  }

  stopMovement() {
    if (this.movementTween) {
      cancelAnimationFrame(this.movementTween);
      this.movementTween = null;
    }
    this.state.isMoving = false;
    this.state.targetPosition = null;
  }

  updateMousePosition(mouseX, mouseY, canvasWidth, canvasHeight) {

    if (!this.headTrackingEnabled) return;
    this.mousePosition.x = (mouseX / canvasWidth) * 2 - 1;
    this.mousePosition.y = -(mouseY / canvasHeight) * 2 + 1;
  }

  updateHeadTracking() {
    if (!this.headTrackingEnabled || !this.headBone || this.state.isMoving) {
      return;
    }

    const maxRotationX = Math.PI / 2; 
    const maxRotationY = Math.PI / 1.2; 

    this.targetHeadRotation.x = -this.mousePosition.y * maxRotationX;
    this.targetHeadRotation.y = this.mousePosition.x * maxRotationY;
    this.targetHeadRotation.z = 0;

    if (this.headBone.rotation) {
      this.headBone.matrixAutoUpdate = false;
      
      this.headBone.rotation.x = this.lerp(
        this.headBone.rotation.x,
        this.targetHeadRotation.x,
        0.25 
      );
      this.headBone.rotation.y = this.lerp(
        this.headBone.rotation.y,
        this.targetHeadRotation.y,
        0.25 
      );
      this.headBone.updateMatrix();
    }
  }

  resetPosition() {

    this.stopMovement();  
    this.state.position.copy(this.initialPosition);
    this.state.rotation.copy(this.initialRotation);
    this.robotGroup.position.copy(this.initialPosition);
    this.robotGroup.rotation.copy(this.initialRotation);
  
    if (this.headBone && this.headBone.rotation) {
      this.headBone.rotation.set(0, 0, 0);
    }
  }

  getRandomAnimation() {
    const availableAnimations = this.animations.filter(animation => 
      !this.config.animations.excludeFromRandom.includes(animation.name)
    );
    
    if (availableAnimations.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableAnimations.length);
    return availableAnimations[randomIndex];
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  update(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
    this.updateHeadTracking();
  }

  getRobotGroup() {
    return this.robotGroup;
  }

  getRobotModel() {
    return this.robotModel;
  }

  getMixer() {
    return this.mixer;
  }

  getAnimations() {
    return this.animations;
  }

  getState() {
    return {
      ...this.state,
      hasHeadTracking: this.headTrackingEnabled,
      headBone: this.headBone?.name || null,
      animationCount: this.animations.length
    };
  }

  isValidPosition(position) {
    const groundSize = 10; 
    return Math.abs(position.x) <= groundSize && Math.abs(position.z) <= groundSize;
  }

  getCurrentPosition() {
    return this.state.position.clone();
  }

  setPosition(x, y, z) {
    this.state.position.set(x, y, z);
    this.robotGroup.position.copy(this.state.position);
  }

  setRotation(x, y, z) {
    this.state.rotation.set(x, y, z);
    this.robotGroup.rotation.copy(this.state.rotation);
  }

  setHeadTrackingEnabled(enabled) {
    this.headTrackingEnabled = enabled && !!this.headBone;
    if (this.headBone) {
      this.headBone.matrixAutoUpdate = false;
      if (!enabled) {
        this.headBone.rotation.set(0, 0, 0);
        this.headBone.updateMatrix();
      }
    }
  }

  dispose() {

    this.stopMovement();
    if (this.mixer) {
      this.mixer.stopAllAction();
      const root = this.mixer.getRoot?.();
      if (root) {
        this.mixer.uncacheRoot(root);
      }
    }
    if (!this.robotModel) return;

    this.robotModel.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose();
      const { material } = child;
      if (Array.isArray(material)) {
        material.forEach((mat) => mat?.dispose?.());
      } else {
        material?.dispose?.();
      }
    });
  } 
} 