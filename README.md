# Interactive 3D Robot Scene
This project demonstrates a 3D robot that responds to user interactions:
- Click on ground → robot walks to target
- Click on robot → plays a random animation
- Idle animation when nothing else is happening Includes a bonus feature: head follows the mouse cursor during idle state

## Features

✅ Idle animation by default  
✅ Walk animation and movement on ground click  
✅ Robot plays random animation on click  
✅ Smooth animation transitions  
✅ Bonus: Head tracking follows mouse during idle

## Demo: https://interactive-robot-3d.netlify.app/
## Video: https://drive.google.com/file/d/18YQnQqOhdiiDCqNraaH8Zt26E1YUJ21r/view?usp=sharing

## Architecture

**Core Implementation**
- Modular ES6 architecture with dependency injection
- Three.js for WebGL rendering and scene management
- GLTF/GLB model format with bone-based animations
- Event-driven interaction system with raycasting
- Error boundary implementation for graceful error handling

**Performance Optimizations**
- Animation state machine with transition mixing
- Bone transform caching
- Event throttling for performance-critical operations
- Optimized asset loading with progress tracking

## Future Improvements

**Technical Stack Enhancement**
- Migration to React + TypeScript + Vite for better developer experience
- Implementation of React Three Fiber for declarative 3D scene management
- State management with Zustand for predictable state updates
- Module bundling optimization with Vite for faster development and builds
- Integration of React Suspense for progressive asset loading

**Feature Enhancements**
- Advanced animation system with procedural generation
- Physics-based interaction using Rapier physics engine
- Implementation of WebGL post-processing effects to enhance visual content quality
- WebAssembly integration for performance-critical computations

## Getting Started

**1. Clone the repository:**
```bash
git clone https://github.com/Kucherenko-Oleksii/Task_Interactive_Robot.git
cd Task_Interactive_Robot
```

**2. Install dependencies:**
```bash
npm install
```

**3. Deploy locally:**
- Using your IDE or code editor:
  - Install "Live Server" extension
  - Right-click on `index.html` and select "Open with Live Server"
- Using any HTTP server:
  - Python: `python -m http.server`
  - Node: `npx serve`
  - PHP: `php -S localhost:8000`

**Note:** Opening `index.html` directly in browser won't work due to CORS restrictions when loading 3D models

**3. To run the tests, you need to enter the commands listed below:**
   ```bash
   # Run tests
   npm test
   
   # Run with coverage
   npm run test:coverage
   
   ```