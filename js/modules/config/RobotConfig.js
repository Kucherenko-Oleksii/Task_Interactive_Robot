import * as THREE from 'three';

export const ROBOT_CONFIG = {
  movement: {
    walking: {
      speed: 2,
      minDistance: 0.1,
      turnSpeed: 0.1
    },
    head: {
      tracking: {
        horizontalSensitivity: 1.2,
        verticalSensitivity: 0.8,
        smoothness: 0.2,
        maxRotationX: Math.PI / 2,
        maxRotationY: Math.PI / 1.2
      },
      default: {
        x: 0,         
        y: 0,           
        z: 0,          
        smoothness: 0.1 
      }
    }
  },
  animation: {
    crossFadeDuration: 0.3,
    timeScale: {
      default: 1.0,
      walking: 1.2,
      idle: 1.0
    }
  },
  physics: {
    gravity: -9.8,
    groundOffset: 0.1
  }
};

/**
 * 
 * @returns {import('./types').SceneState & 
 *          import('./types').RobotState & 
 *          import('./types').BoneState & 
 *          import('./types').PositionState & 
 *          import('./types').AnimationState & 
 *          import('./types').TrackingState & 
 *          import('./types').StateFlags}
 */
export function createInitialState() {
  return {
    scene: null,
    camera: null,
    renderer: null,
    canvas: null,

    robot: null,
    mixer: null,
    animations: {},
    ground: null,

    headBone: null,
    leftArmBone: null,
    rightArmBone: null,
    leftLegBone: null,
    rightLegBone: null,

    targetPosition: new THREE.Vector3(),
    originalPosition: new THREE.Vector3(),
    originalRotation: new THREE.Euler(),
    originalHeadRotation: null,

    isWalking: false,
    isIdleState: true,
    isHeadTracking: true,

    animationId: null,
    armAnimationTime: 0,
    customRunAnimation: false,
    customAnimationTime: 0,
    lastMouseMoveTime: 0,

    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
    globalMouse: new THREE.Vector2(),
    clock: new THREE.Clock()
  };
} 