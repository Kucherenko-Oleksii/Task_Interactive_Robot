export class UIUtils {
  constructor() {
    this.loadingIndicator = null;
    this.errorBoundary = null;
  }

  init() {
    this.loadingIndicator = document.querySelector('#loading-indicator');
    this.errorBoundary = document.querySelector('#error-boundary');
  }

  hideLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'none';
    }
  }

  showLoading() {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = 'flex';
    }
  }

  showError(message) {
    this.hideLoading();
    
    if (this.errorBoundary) {
      this.errorBoundary.style.display = 'flex';
      const errorMessage = this.errorBoundary.querySelector('p');
      if (errorMessage) {
        errorMessage.textContent = message;
      }
    }
  }

  hideError() {
    if (this.errorBoundary) {
      this.errorBoundary.style.display = 'none';
    }
  }

  setupCanvasTransparency(canvas) {
    if (!canvas) return;
    
    canvas.classList.add('transparent-canvas');
    const canvasContainer = canvas.parentElement;
    if (canvasContainer) {
      canvasContainer.classList.add('transparent-container');
    }
  }

  createDebugFunction(canvas) {
    if (typeof window !== 'undefined') {
      window.debugCanvas = function() {
        const container = document.querySelector('.canvas-container');
        
        return {
          canvas: {
            background: getComputedStyle(canvas).background,
            backgroundColor: getComputedStyle(canvas).backgroundColor,
            classes: Array.from(canvas.classList)
          },
          container: container ? {
            background: getComputedStyle(container).background,
            backgroundColor: getComputedStyle(container).backgroundColor,
            classes: Array.from(container.classList)
          } : null
        };
      };
    }
  }

  showNotification(message, type = 'info', duration = 3000) {
    let notification = document.querySelector('#notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 6px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
      `;
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `notification-${type}`;
    
    switch (type) {
      case 'success':
        notification.style.background = 'rgba(34, 197, 94, 0.9)';
        break;
      case 'error':
        notification.style.background = 'rgba(239, 68, 68, 0.9)';
        break;
      case 'warning':
        notification.style.background = 'rgba(245, 158, 11, 0.9)';
        break;
      default:
        notification.style.background = 'rgba(59, 130, 246, 0.9)';
    }

    notification.style.opacity = '1';

    setTimeout(() => {
      notification.style.opacity = '0';
    }, duration);
    
  }

  createLoadingOverlay(text = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      color: white;
      font-size: 18px;
    `;
    overlay.textContent = text;
    
    document.body.appendChild(overlay);
    return overlay;
  }

  removeLoadingOverlay() {
    const overlay = document.querySelector('#loading-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  getCanvasDebugInfo(canvas) {

    if (!canvas) return null;

    const container = document.querySelector('.canvas-container');
    return {
      canvas: {
        id: canvas.id,
        classes: Array.from(canvas.classList),
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
        style: {
          background: getComputedStyle(canvas).background,
          backgroundColor: getComputedStyle(canvas).backgroundColor,
          opacity: getComputedStyle(canvas).opacity
        }
      },
      container: container ? {
        classes: Array.from(container.classList),
        style: {
          background: getComputedStyle(container).background,
          backgroundColor: getComputedStyle(container).backgroundColor,
          opacity: getComputedStyle(container).opacity
        }
      } : null
    };
  }
} 