import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function loadRobot(scene) {
  return new Promise((resolve, reject) => {
    
    const loader = new GLTFLoader();
    
    loader.load(
      './public/RobotExpressive.glb',
      (gltf) => {
        const robot = gltf.scene;
        const animations = {};
        let mixer = null;
        let headBone = null;
        let leftArmBone = null;
        let rightArmBone = null;
        let leftLegBone = null;
        let rightLegBone = null;
        const originalPosition = new THREE.Vector3();
        const originalRotation = new THREE.Euler();

        robot.scale.set(1, 1, 1);
        robot.position.set(0, 0.1, 0);
        robot.rotation.y = THREE.MathUtils.degToRad(45);
        robot.castShadow = true;
        robot.receiveShadow = true;
        robot.name = 'robot';

        originalPosition.copy(robot.position);
        originalRotation.copy(robot.rotation);

        robot.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }

          if (child.isBone) {
            const boneName = child.name.toLowerCase();
            const bonePatterns = new Map([
              ['headBone', /head/],
              ['leftArmBone', /left(arm|_arm|shoulder)/],
              ['rightArmBone', /right(arm|_arm|shoulder)/],
              ['leftLegBone', /left(leg|_leg|thigh)/],
              ['rightLegBone', /right(leg|_leg|thigh)/]
            ]);

            for (const [property, pattern] of bonePatterns) {
              if (pattern.test(boneName)) {
                switch(property) {
                  case 'headBone': headBone = child; break;
                  case 'leftArmBone': leftArmBone = child; break;
                  case 'rightArmBone': rightArmBone = child; break;
                  case 'leftLegBone': leftLegBone = child; break;
                  case 'rightLegBone': rightLegBone = child; break;
                }
                break;
              }
            }
          }
        });

        scene.add(robot);

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(robot);
          gltf.animations.forEach((clip) => {
            animations[clip.name] = mixer.clipAction(clip);
          });
        }

        resolve({
          robot,
          mixer,
          animations,
          bones: {
            head: headBone,
            leftArm: leftArmBone,
            rightArm: rightArmBone,
            leftLeg: leftLegBone,
            rightLeg: rightLegBone
          },
          originalPosition,
          originalRotation
        });
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(0);
        return percent;
      },
      (error) => {
        reject(error);
      }
    );
  });
}