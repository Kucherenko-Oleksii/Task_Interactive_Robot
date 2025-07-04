import { ROBOT_CONFIG, createInitialState } from '../js/modules/config/RobotConfig.js';

describe('RobotConfig', () => {
  
  describe('ROBOT_CONFIG', () => {
    test('should have correct movement configuration', () => {
      expect(ROBOT_CONFIG.movement).toBeDefined();
      expect(ROBOT_CONFIG.movement.walking.speed).toBe(2);
      expect(ROBOT_CONFIG.movement.walking.minDistance).toBe(0.1);
      expect(ROBOT_CONFIG.movement.walking.turnSpeed).toBe(0.1);
    });

    test('should have correct head tracking configuration', () => {
      const headConfig = ROBOT_CONFIG.movement.head.tracking;
      expect(headConfig.horizontalSensitivity).toBe(1.2);
      expect(headConfig.verticalSensitivity).toBe(0.8);
      expect(headConfig.smoothness).toBe(0.2);
    });

    test('should have correct animation configuration', () => {
      expect(ROBOT_CONFIG.animation.crossFadeDuration).toBe(0.3);
      expect(ROBOT_CONFIG.animation.timeScale.walking).toBe(1.2);
      expect(ROBOT_CONFIG.animation.timeScale.idle).toBe(1.0);
    });

    test('should have correct physics configuration', () => {
      expect(ROBOT_CONFIG.physics.gravity).toBe(-9.8);
      expect(ROBOT_CONFIG.physics.groundOffset).toBe(0.1);
    });
  });

  describe('createInitialState', () => {
    let initialState;

    beforeEach(() => {
      initialState = createInitialState();
    });

    test('should create initial state with correct properties', () => {
      expect(initialState).toHaveProperty('scene');
      expect(initialState).toHaveProperty('camera');
      expect(initialState).toHaveProperty('renderer');
      expect(initialState).toHaveProperty('robot');
      expect(initialState).toHaveProperty('mixer');
      expect(initialState).toHaveProperty('animations');
    });

    test('should initialize boolean flags correctly', () => {
      expect(initialState.isWalking).toBe(false);
      expect(initialState.isIdleState).toBe(true);
      expect(initialState.isHeadTracking).toBe(true);
    });

    test('should initialize vectors and euler angles', () => {
      expect(initialState.targetPosition).toBeDefined();
      expect(initialState.originalPosition).toBeDefined();
      expect(initialState.originalRotation).toBeDefined();
      expect(initialState.mouse).toBeDefined();
      expect(initialState.globalMouse).toBeDefined();
    });

    test('should initialize Three.js objects', () => {
      expect(initialState.raycaster).toBeDefined();
      expect(initialState.clock).toBeDefined();
    });

    test('should initialize animation properties', () => {
      expect(initialState.animationId).toBe(null);
      expect(initialState.armAnimationTime).toBe(0);
      expect(initialState.customRunAnimation).toBe(false);
      expect(initialState.customAnimationTime).toBe(0);
      expect(initialState.lastMouseMoveTime).toBe(0);
    });
  });
}); 