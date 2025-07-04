export class StatusManager {

  constructor() {
    this.elements = {
      robotStatus: null,
      canvasContainer: null
    };
    
    this.state = {
      robotStatus: 'idle',
      canvasState: 'loading'
    }; 
    this.initialize();
  }

  initialize() {
    this.findDOMElements();
    this.setupRobotStatusIndicator();
  }

  findDOMElements() {
    this.elements.canvasContainer = document.querySelector('.canvas-container');
  }

  setupRobotStatusIndicator() {
    if (!this.elements.canvasContainer) return;

    this.elements.robotStatus = document.createElement('div');
    this.elements.robotStatus.className = 'robot-status';
    this.elements.canvasContainer.appendChild(this.elements.robotStatus);
  }

  showRobotStatus(status) {
    if (!this.statusConfig[status]) {
      return;
    }
    
    this.state.robotStatus = status;
    const config = this.statusConfig[status];
    
    if (this.elements.robotStatus) {
      const indicator = this.elements.robotStatus.querySelector('.robot-status__indicator');
      const dot = this.elements.robotStatus.querySelector('.robot-status__dot');
      const text = this.elements.robotStatus.querySelector('.robot-status__text');
      
      if (dot) {
        dot.className = 'robot-status__dot';
        dot.classList.add(`robot-status__dot--${config.dot}`);
      }
      
      if (text) {
        text.textContent = config.text;
        text.style.color = config.color;
      }
      
      if (indicator) {
        indicator.style.borderColor = config.color;
      }
    }
  }

  updateCanvasState(state) {
    this.state.canvasState = state;
    
    if (this.elements.canvasContainer) {
      this.elements.canvasContainer.className = this.elements.canvasContainer.className
        .replace(/canvas-container--\w+/g, '');
      
      this.elements.canvasContainer.classList.add(`canvas-container--${state}`);
    }
  }

  getStatusConfig(status) {
    return this.statusConfig[status] || null;
  }

  addCustomStatus(status, config) {
    this.statusConfig[status] = {
      text: config.text || status,
      color: config.color || '#95a5a6',
      icon: config.icon || 'robot',
      dot: config.dot || 'idle'
    };
  }

  updateForMobile(isMobile) {
    if (this.elements.robotStatus) {
      if (isMobile) {
        this.elements.robotStatus.style.fontSize = '12px';
        this.elements.robotStatus.style.padding = '8px';
      } else {
        this.elements.robotStatus.style.fontSize = '14px';
        this.elements.robotStatus.style.padding = '12px';
      }
    }
  }
  getState() {
    return {
      ...this.state,
      hasElements: !!this.elements.robotStatus,
      availableStatuses: Object.keys(this.statusConfig)
    };
  }
  
  dispose() {
    if (this.elements.robotStatus && this.elements.robotStatus.parentNode) {
      this.elements.robotStatus.parentNode.removeChild(this.elements.robotStatus);
    }
    this.elements = {};
  }
} 