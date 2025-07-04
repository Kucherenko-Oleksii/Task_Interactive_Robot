export class LoadingManager {
  constructor() {
    this.elements = {
      loadingIndicator: null,
      loadingText: null
    };
    
    this.state = {
      isLoading: false
    };
    
    this.initialize();
  }

  initialize() {
    this.findDOMElements();
  }

  findDOMElements() {
    this.elements.loadingIndicator = document.querySelector('#loading-indicator');
    
    if (this.elements.loadingIndicator) {
      this.elements.loadingText = this.elements.loadingIndicator.querySelector('.loading-text');
    }
  }

  show(message = 'Завантаження 3D моделі...') {
    this.state.isLoading = true;
    
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.style.display = 'block';
      this.elements.loadingIndicator.classList.add('animate-fade-in');
      
      if (this.elements.loadingText) {
        this.elements.loadingText.textContent = message;
      }
    }
  }

  hide() {
    this.state.isLoading = false;
    
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.classList.add('animate-fade-out');
      
      setTimeout(() => {
        this.elements.loadingIndicator.style.display = 'none';
        this.elements.loadingIndicator.classList.remove('animate-fade-in', 'animate-fade-out');
      }, 400);
    }
  }

  updateMessage(message) {
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = message;
    }
  }

  createProgressBar(container, options = {}) {
    const {
      initial = 0,
      animated = true,
      showPercentage = true,
      color = '#3498db'
    } = options;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'ui-progress-bar';
    progressBar.innerHTML = `
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="background-color: ${color}; width: ${initial}%;"></div>
      </div>
      ${showPercentage ? '<div class="progress-bar-text">0%</div>' : ''}
    `;
    
    this.styleProgressBar(progressBar, animated, showPercentage);
    container.appendChild(progressBar);
    
    return {
      element: progressBar,
      setProgress: (percentage) => {
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        const fill = progressBar.querySelector('.progress-bar-fill');
        fill.style.width = `${clampedPercentage}%`;
        
        if (showPercentage) {
          const text = progressBar.querySelector('.progress-bar-text');
          text.textContent = `${Math.round(clampedPercentage)}%`;
        }
      },
      destroy: () => {
        if (progressBar.parentNode) {
          progressBar.parentNode.removeChild(progressBar);
        }
      }
    };
  }

  styleProgressBar(progressBar, animated, showPercentage) {
    progressBar.style.cssText = `
      width: 100%;
      margin: 8px 0;
    `;
    
    const track = progressBar.querySelector('.progress-bar-track');
    track.style.cssText = `
      width: 100%;
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
    `;
    
    const fill = progressBar.querySelector('.progress-bar-fill');
    fill.style.cssText = `
      height: 100%;
      transition: ${animated ? 'width 0.3s ease' : 'none'};
      border-radius: 4px;
    `;
    
    if (showPercentage) {
      const text = progressBar.querySelector('.progress-bar-text');
      text.style.cssText = `
        text-align: center;
        font-size: 12px;
        margin-top: 4px;
        color: #7f8c8d;
      `;
    }
  }

  getState() {
    return {
      ...this.state,
      hasElements: !!this.elements.loadingIndicator
    };
  }

  dispose() {
    this.state.isLoading = false;
    this.elements = {};
  }
} 