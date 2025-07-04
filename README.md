# Interactive 3D Robot Scene

WebGL-based interactive 3D scene featuring an animated robot that responds to user interactions through mouse movements and scene navigation

## Demo: https://interactive-robot-3d.netlify.app/

## Architecture

### Core Implementation
- Modular ES6 architecture with dependency injection
- Three.js for WebGL rendering and scene management
- GLTF/GLB model format with bone-based animations
- Event-driven interaction system with raycasting
- Error boundary implementation for graceful error handling

### Performance Optimizations
- Animation state machine with transition mixing
- Bone transform caching
- Event throttling for performance-critical operations
- Optimized asset loading with progress tracking

### Technical Features
- Mouse interaction system
- Dynamic animation blending
- Raycasting-based navigation
- Comprehensive error handling

## Future Improvements

### Technical Stack Enhancement
- Migration to React + TypeScript + Vite
- Implementation of React Three Fiber for better React-Three.js integration
- State management with Zustand
- Module bundling optimization with Vite
- Integration of React Suspense for asset loading

### Feature Enhancements
- Advanced animation system with procedural generation
- Physics-based interaction using Rapier
- WebGL post-processing effects
- WebAssembly integration for performance-critical computations

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Kucherenko-Oleksii/Task_Interactive_Robot.git
cd Task_Interactive_Robot
```

2. Deploy locally:
- Using your IDE or code editor:
  - Install "Live Server" extension
  - Right-click on `index.html` and select "Open with Live Server"
- Using any HTTP server:
  - Python: `python -m http.server`
  - Node: `npx serve`
  - PHP: `php -S localhost:8000`

**Note:** Opening `index.html` directly in browser won't work due to CORS restrictions when loading 3D models