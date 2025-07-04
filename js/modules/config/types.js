/**
 * @typedef {Object} SceneState
 * @property {THREE.Scene} scene
 * @property {THREE.Camera} camera
 * @property {THREE.WebGLRenderer} renderer
 * @property {HTMLCanvasElement} canvas
 */

/**
 * @typedef {Object} RobotState
 * @property {THREE.Object3D} robot
 * @property {THREE.AnimationMixer} mixer
 * @property {Object.<string, THREE.AnimationAction>} animations
 * @property {THREE.Object3D} ground
 */

/**
 * @typedef {Object} BoneState
 * @property {THREE.Bone} headBone
 * @property {THREE.Bone} leftArmBone
 * @property {THREE.Bone} rightArmBone
 * @property {THREE.Bone} leftLegBone
 * @property {THREE.Bone} rightLegBone
 */

/**
 * @typedef {Object} PositionState
 * @property {THREE.Vector3} targetPosition
 * @property {THREE.Vector3} originalPosition
 * @property {THREE.Euler} originalRotation
 * @property {THREE.Euler} originalHeadRotation
 */

/**
 * @typedef {Object} AnimationState
 * @property {number} animationId
 * @property {number} armAnimationTime
 * @property {boolean} customRunAnimation
 * @property {number} customAnimationTime
 * @property {number} lastMouseMoveTime
 */

/**
 * @typedef {Object} TrackingState
 * @property {THREE.Raycaster} raycaster
 * @property {THREE.Vector2} mouse
 * @property {THREE.Vector2} globalMouse
 * @property {THREE.Clock} clock
 */

/**
 * @typedef {Object} StateFlags
 * @property {boolean} isWalking
 * @property {boolean} isIdleState
 * @property {boolean} isHeadTracking
 */ 