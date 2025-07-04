import { LoadingManager } from '../js/modules/ui/LoadingManager.js';

describe('LoadingManager', () => {
  let loadingManager;
  let mockLoadingIndicator;
  let mockLoadingText;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loading-indicator">
        <div class="loading-spinner"></div>
        <p class="loading-text">Завантаження 3D моделі...</p>
      </div>
    `;
    mockLoadingIndicator = document.getElementById('loading-indicator');
    mockLoadingText = document.querySelector('.loading-text');
    
    loadingManager = new LoadingManager();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllTimers();
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with correct default state', () => {
      expect(loadingManager.state.isLoading).toBe(false);
      expect(loadingManager.elements.loadingIndicator).toBe(mockLoadingIndicator);
      expect(loadingManager.elements.loadingText).toBe(mockLoadingText);
    });

    test('should find DOM elements correctly', () => {
      expect(loadingManager.elements.loadingIndicator).toBe(mockLoadingIndicator);
      expect(loadingManager.elements.loadingText).toBe(mockLoadingText);
    });

    test('should handle missing DOM elements gracefully', () => {
      document.body.innerHTML = '';
      const newLoadingManager = new LoadingManager();
      expect(newLoadingManager.elements.loadingIndicator).toBe(null);
      expect(newLoadingManager.elements.loadingText).toBe(null);
    });
  });

  describe('show', () => {
    test('should show loading indicator with default message', () => {
      loadingManager.show();
      expect(loadingManager.state.isLoading).toBe(true);
      expect(mockLoadingIndicator.style.display).toBe('block');
      expect(mockLoadingIndicator.classList.contains('animate-fade-in')).toBe(true);
      expect(mockLoadingText.textContent).toBe('Завантаження 3D моделі...');
    });

    test('should show loading indicator with custom message', () => {
      const customMessage = 'Завантаження моделей роботів...';
      loadingManager.show(customMessage);    
      expect(loadingManager.state.isLoading).toBe(true);
      expect(mockLoadingText.textContent).toBe(customMessage);
    });

    test('should handle missing elements gracefully', () => {
      loadingManager.elements.loadingIndicator = null;
      loadingManager.elements.loadingText = null;  
      expect(() => loadingManager.show()).not.toThrow();
      expect(loadingManager.state.isLoading).toBe(true);
    });
  });

  describe('hide', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should hide loading indicator', () => {
      loadingManager.show();
      loadingManager.hide(); 
      expect(loadingManager.state.isLoading).toBe(false);
      expect(mockLoadingIndicator.classList.contains('animate-fade-out')).toBe(true);
    });

    test('should hide loading indicator after timeout', () => {
      loadingManager.show();
      loadingManager.hide(); 
      jest.advanceTimersByTime(400);
      expect(mockLoadingIndicator.style.display).toBe('none');
      expect(mockLoadingIndicator.classList.contains('animate-fade-in')).toBe(false);
      expect(mockLoadingIndicator.classList.contains('animate-fade-out')).toBe(false);
    });

    test('should handle missing elements gracefully', () => {
      loadingManager.elements.loadingIndicator = null;    
      expect(() => loadingManager.hide()).not.toThrow();
      expect(loadingManager.state.isLoading).toBe(false);
    });
  });

  describe('updateMessage', () => {
    test('should update loading text message', () => {
      const newMessage = 'Завантаження текстур...';
      loadingManager.updateMessage(newMessage);     
      expect(mockLoadingText.textContent).toBe(newMessage);
    });

    test('should handle missing text element gracefully', () => {
      loadingManager.elements.loadingText = null;
      expect(() => loadingManager.updateMessage('New message')).not.toThrow();
    });
  });

  describe('createProgressBar', () => {
    let container;
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    test('should create progress bar with default options', () => {
      const progressBar = loadingManager.createProgressBar(container);
      expect(progressBar.element).toBeDefined();
      expect(progressBar.setProgress).toBeDefined();
      expect(progressBar.destroy).toBeDefined();
      expect(container.querySelector('.ui-progress-bar')).toBeTruthy();
    });

    test('should create progress bar with custom options', () => {
      const options = {
        initial: 50,
        animated: false,
        showPercentage: false,
        color: '#ff0000'
      };
      
      const progressBar = loadingManager.createProgressBar(container, options);
      const fillElement = progressBar.element.querySelector('.progress-bar-fill');   
      expect(fillElement.style.width).toBe('50%');
      expect(fillElement.style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(progressBar.element.querySelector('.progress-bar-text')).toBeFalsy();
    });

    test('should update progress correctly', () => {
      const progressBar = loadingManager.createProgressBar(container);  
      progressBar.setProgress(75);  
      const fillElement = progressBar.element.querySelector('.progress-bar-fill');
      const textElement = progressBar.element.querySelector('.progress-bar-text');   
      expect(fillElement.style.width).toBe('75%');
      expect(textElement.textContent).toBe('75%');
    });

    test('should clamp progress values', () => {
      const progressBar = loadingManager.createProgressBar(container);  
      progressBar.setProgress(150);
      const fillElement = progressBar.element.querySelector('.progress-bar-fill');
      expect(fillElement.style.width).toBe('100%');    
      progressBar.setProgress(-50);
      expect(fillElement.style.width).toBe('0%');
    });

    test('should destroy progress bar correctly', () => {
      const progressBar = loadingManager.createProgressBar(container); 
      expect(container.querySelector('.ui-progress-bar')).toBeTruthy();
      progressBar.destroy();
      expect(container.querySelector('.ui-progress-bar')).toBeFalsy();
    });
  });

  describe('getState', () => {
    test('should return correct state with elements', () => {
      const state = loadingManager.getState();
      expect(state.isLoading).toBe(false);
      expect(state.hasElements).toBe(true);
    });

    test('should return correct state without elements', () => {
      loadingManager.elements.loadingIndicator = null; 
      const state = loadingManager.getState();
      expect(state.isLoading).toBe(false);
      expect(state.hasElements).toBe(false);
    });
  });

  describe('dispose', () => {
    test('should dispose correctly', () => {
      loadingManager.show();
      loadingManager.dispose();
      expect(loadingManager.state.isLoading).toBe(false);
      expect(loadingManager.elements).toEqual({});
    });
  });
}); 