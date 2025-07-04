export class ErrorUI {
  constructor() {
    this.elements = {
      errorBoundary: null,
      errorContent: null,
      errorRetry: null
    };
    
    this.isVisible = false;
    
    this.setupDOMElements();
  }

  setupDOMElements() {
    this.elements.errorBoundary = document.querySelector('#error-boundary');
    
    if (this.elements.errorBoundary) {
      this.elements.errorContent = this.elements.errorBoundary.querySelector('.error-content');
      this.elements.errorRetry = this.elements.errorBoundary.querySelector('.error-retry');
      
      if (this.elements.errorRetry) {
        this.elements.errorRetry.addEventListener('click', () => {
          this.hideError();
          window.location.reload();
        });
      }
    }
  }

  showError(errorObj, options = {}) {
    if (!this.elements.errorBoundary) return;

    const {
      title = 'Error',
      message = this.getUserFriendlyMessage(errorObj),
      showRetry = true,
      blocking = false
    } = options;

    if (this.elements.errorContent) {
      const titleElement = this.elements.errorContent.querySelector('h3');
      const messageElement = this.elements.errorContent.querySelector('p');
      
      if (titleElement) titleElement.textContent = title;
      if (messageElement) messageElement.textContent = message;
    }

    if (this.elements.errorRetry) {
      this.elements.errorRetry.style.display = showRetry ? 'block' : 'none';
    }

    this.elements.errorBoundary.style.display = 'flex';
    this.isVisible = true;

    if (!blocking) {
      setTimeout(() => {
        this.hideError();
      }, 5000);
    }
  }

  showCriticalError(errorObj) {
    this.showError(errorObj, {
      title: 'Critical Error',
      message: this.getCriticalErrorMessage(errorObj),
      showRetry: true,
      blocking: true
    });
  }

  getCriticalErrorMessage(errorObj) {
    const categories = {
      WEBGL: 'webgl',
      LOADING: 'loading'
    };

    switch (errorObj.category) {
      case categories.WEBGL:
        return 'Your browser or graphics card doesn\'t support WebGL, which is required for this 3D experience. Please try updating your browser or enabling hardware acceleration';
      case categories.LOADING:
        return 'Failed to load required resources. Please check your internet connection and try again';
      default:
        return 'A critical error occurred that prevents the application from running properly. Please refresh the page or try again later';
    }
  }

  getUserFriendlyMessage(errorObj) {
    const categories = {
      WEBGL: 'webgl',
      LOADING: 'loading',
      ANIMATION: 'animation',
      INTERACTION: 'interaction',
      NETWORK: 'network'
    };

    switch (errorObj.category) {
      case categories.WEBGL:
        return 'Graphics error: Please ensure your browser supports WebGL and hardware acceleration is enabled';
      case categories.LOADING:
        return 'Loading error: Unable to load required files. Please check your internet connection';
      case categories.ANIMATION:
        return 'Animation error: There was a problem with the 3D animation system';
      case categories.INTERACTION:
        return 'Interaction error: There was a problem processing your input';
      case categories.NETWORK:
        return 'Network error: Please check your internet connection and try again';
      default:
        return 'An unexpected error occurred. The application will attempt to continue running';
    }
  }

  hideError() {
    if (this.elements.errorBoundary) {
      this.elements.errorBoundary.style.display = 'none';
      this.isVisible = false;
    }
  }

  isErrorVisible() {
    return this.isVisible;
  }

  dispose() {
    if (this.elements.errorRetry) {
      this.elements.errorRetry.removeEventListener('click', this.handleRetry);
    }
    this.hideError();
  }
} 