import { RobotSceneApp } from './modules/RobotSceneApp.js';

document.addEventListener('DOMContentLoaded', () => new RobotSceneApp());

globalThis.debugCanvas = () => {
  const elements = {
    canvas: document.querySelector('#robot-canvas'),
    container: document.querySelector('.canvas-container')
  };

  return Object.fromEntries(
    Object.entries(elements)
      .filter(([_, el]) => el)
      .map(([key, el]) => [key, {
        ...Object.fromEntries(['background', 'backgroundColor'].map(prop => 
          [prop, getComputedStyle(el)[prop]])),
        classes: [...el.classList]
      }])
  );
};