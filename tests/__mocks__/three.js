class BaseVector {
    constructor(...coords) {
      ['x', 'y', 'z'].forEach((axis, i) => coords[i] !== undefined && (this[axis] = coords[i]));
    } 
    copy(v) {
      return Object.assign(this, v);
    }
  }
  
  export class Vector3 extends BaseVector {
    constructor(x = 0, y = 0, z = 0) {
      super(x, y, z);
    }  
    setY(y) {
      this.y = y;
      return this;
    }
  }
  
  export class Vector2 extends BaseVector {
    constructor(x = 0, y = 0) {
      super(x, y);
    }
  }
  
  export class Euler extends BaseVector {
    constructor(x = 0, y = 0, z = 0) {
      super(x, y, z);
    }
  }
  
  export class Raycaster {}
  export class Clock {}
  
  export const MathUtils = {
    degToRad: degrees => degrees * (Math.PI / 180)
  };
  
  export default { Vector3, Vector2, Euler, Raycaster, Clock, MathUtils };