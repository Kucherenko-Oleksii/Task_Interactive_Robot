import * as THREE from 'three';
import { SceneSetup } from './SceneSetup.js';
import { UIUtils } from './UIUtils.js';
import { UIController } from './UIController.js';
import { loadRobot } from './RobotLoader.js';
import { createInitialState, ROBOT_CONFIG } from './config/RobotConfig.js';

export class RobotSceneApp {

  constructor() {
    Object.assign(this, createInitialState());

    this.sceneSetup = null;
    this.uiUtils = new UIUtils();
    this.uiController = new UIController();
    
    this.lastCursorMoveTime = 0;
    this.cursorIdleTimeout = 2000;
    
    this.init();
  }

  async init() {
    try {
      this.canvas = document.querySelector('#robot-canvas');
      if (!this.canvas) {
        throw new Error('Canvas not found');
      }
      this.uiUtils.init();
      this.uiUtils.setupCanvasTransparency(this.canvas);
      this.uiController.init();
   
      this.sceneSetup = new SceneSetup(this.canvas);
      const sceneObjects = this.sceneSetup.setupScene();
      this.scene = sceneObjects.scene;
      this.camera = sceneObjects.camera;
      this.renderer = sceneObjects.renderer;
      
      this.sceneSetup.setupLighting();
      this.sceneSetup.setupGround();
      this.setupEventListeners();
      
      await this.loadRobot();
      
      this.animate();
      this.uiUtils.hideLoading(); 
    } catch (error) {
      this.uiUtils.showError(error.message);
    }
  }

  async loadRobot() {
    const robotData = await loadRobot(this.scene);
    
    this.robot = robotData.robot;
    this.mixer = robotData.mixer;
    this.animations = robotData.animations;
    this.headBone = robotData.bones.head;
    this.leftArmBone = robotData.bones.leftArm;
    this.rightArmBone = robotData.bones.rightArm;
    this.leftLegBone = robotData.bones.leftLeg;
    this.rightLegBone = robotData.bones.rightLeg;
    this.originalPosition.copy(robotData.originalPosition);
    this.originalRotation.copy(robotData.originalRotation);

    if (this.headBone) {
      this.originalHeadRotation = this.headBone.rotation.clone();
      this.headBone.matrixAutoUpdate = false;
    }

    if (this.animations['Idle']) {

      const idleAction = this.animations['Idle'];  
      const idleClip = idleAction.getClip();
      const tracks = idleClip.tracks.filter(track => !track.name.toLowerCase().includes('head'));
      const newIdleClip = new THREE.AnimationClip('IdleNoHead', idleClip.duration, tracks);
      
      this.animations['Idle'] = this.mixer.clipAction(newIdleClip);
      this.animations['Idle'].play();      
      this.isHeadTracking = true;
      this.isIdleState = true;
    }
  } 

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => e.preventDefault());
    this.canvas.addEventListener('mouseup', (e) => e.preventDefault());
    this.canvas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.onCanvasClick(e);
    }); 
    
    document.addEventListener('mousemove', this.onGlobalMouseMove.bind(this)); 
    this.canvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      this.onCanvasMouseMove(e);
    });
    
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    this.canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
    
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  onCanvasClick(event) {
    event.preventDefault();
    
    this.updateMousePosition(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true); 
    if (intersects.length > 0) {
      const intersect = intersects[0];
      if (intersect.object.name === 'ground' || intersect.object.parent?.name === 'ground') { 
        this.moveRobotTo(intersect.point);
      } else if (this.isRobotClicked(intersect.object)) {
        this.playRandomAnimation();
      }
    }
  }

  onGlobalMouseMove(event) {
    if (!this.isHeadTracking || !this.headBone) return;
    
    this.lastMouseMoveTime = Date.now();
    this.lastCursorMoveTime = Date.now();
    
    this.globalMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.globalMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    const { horizontalSensitivity, verticalSensitivity, smoothness } = ROBOT_CONFIG.movement.head.tracking;
    
    const mouseX = this.globalMouse.x * horizontalSensitivity;
    const mouseY = this.globalMouse.y * verticalSensitivity;
    
    if (this.headBone) {
      this.headBone.matrixAutoUpdate = true;
      this.headBone.rotation.y = THREE.MathUtils.lerp(this.headBone.rotation.y, mouseX, smoothness);
      this.headBone.rotation.x = THREE.MathUtils.lerp(this.headBone.rotation.x, -mouseY, smoothness);
      this.headBone.updateMatrix();
    }
  }

  onCanvasMouseMove(event) {
    this.updateMousePosition(event);
  }

  onTouchStart(event) {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      this.onCanvasClick(touch);
    }
  }

  updateMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  isRobotClicked(object) {
    for (let obj = object; obj; obj = obj.parent) {
        if (obj.name === 'robot' || obj === this.robot) return true;
    }
    return false;
  }

  moveRobotTo(targetPoint) {
    this.targetPosition.copy(targetPoint).setY(0.1);
    
    if (this.isWalking) return;
    
    Object.assign(this, {
        isWalking: true,
        isIdleState: false,
        isHeadTracking: false
    });
    
    this.stopAllAnimations();
    this.animations.Walking?.play();
  }

  playRandomAnimation() {
    if (this.isWalking) {
      return;
    }
    
    const excludeAnimations = ['Idle', 'Walking'];
    const availableAnimations = Object.keys(this.animations)
      .filter(name => !excludeAnimations.includes(name));
    
    if (availableAnimations.length === 0) {
      return;
    }
    
    const randomAnimation = availableAnimations[Math.floor(Math.random() * availableAnimations.length)];
    
    this.isIdleState = false;
    this.stopAllAnimations();
    
    const action = this.animations[randomAnimation];
    action.reset();
    action.setLoop(THREE.LoopOnce);
    action.clampWhenFinished = true;
    action.play();
    
    setTimeout(() => {
      if (this.animations['Idle'] && !this.isWalking) {
        this.stopAllAnimations();
        this.animations['Idle'].play();
        this.isIdleState = true;
      }
    }, action.getClip().duration * 1000);
  }

  stopAllAnimations() {
    Object.values(this.animations).forEach(action => {
      action.stop();
    });
    this.customRunAnimation = false;
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
  
    this.mixer?.update(delta);
    this.updateHeadRotation();
    
    this.isWalking && this.robot && this.updateMovement(delta);
    this.renderer.render(this.scene, this.camera);
  }
  
  updateMovement(delta) {
    const distance = this.robot.position.distanceTo(this.targetPosition);
    distance > ROBOT_CONFIG.movement.walking.minDistance 
      ? this.moveToTarget(delta) 
      : this.arrivedAtTarget();
  }

  moveToTarget(delta) {
    const { position, rotation } = this.robot;
    const direction = this.targetPosition.clone().sub(position);
    const distance = direction.length();
    
    if (distance < 0.01) return;
    
    direction.normalize();
      
    const targetY = Math.atan2(direction.x, direction.z);
    const diff = ((targetY - rotation.y + Math.PI) % (2 * Math.PI)) - Math.PI;
    rotation.y += Math.sign(diff) * Math.min(Math.abs(diff), 8 * delta);

    const speed = ROBOT_CONFIG.movement.walking.speed;
    const moveDistance = Math.min(speed * delta, distance);
    position.add(direction.multiplyScalar(moveDistance));
  }
  
  arrivedAtTarget() {
    this.robot.position.copy(this.targetPosition);
    this.robot.rotation.copy(this.originalRotation);
    
    Object.assign(this, {
      isWalking: false,
      isIdleState: true,
      isHeadTracking: true
    });

    this.lastCursorMoveTime = 0;  
    this.stopAllAnimations();
    this.animations.Idle?.play();
  }

  onWindowResize() {
    this.sceneSetup.onWindowResize();
  }

  resetHeadPosition() {
    if (this.headBone && this.originalHeadRotation) {
      this.headBone.rotation.copy(this.originalHeadRotation);
      this.headBone.updateMatrix();
    }
  }

  updateHeadRotation() {
    if (!this.headBone || !this.isHeadTracking) return;
    
    const isIdle = Date.now() - this.lastCursorMoveTime > this.cursorIdleTimeout;
    if (!isIdle) return;
    
    const { default: defaultPos } = ROBOT_CONFIG.movement.head;
    const { rotation } = this.headBone;
    
    this.headBone.matrixAutoUpdate = true;
    rotation.x = THREE.MathUtils.lerp(rotation.x, defaultPos.x, defaultPos.smoothness);
    rotation.y = THREE.MathUtils.lerp(rotation.y, defaultPos.y, defaultPos.smoothness);
    rotation.z = THREE.MathUtils.lerp(rotation.z, defaultPos.z, defaultPos.smoothness);
    this.headBone.updateMatrix();
  }
}