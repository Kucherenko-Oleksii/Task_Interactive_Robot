import { LoadingManager } from './ui/LoadingManager.js';
import { NotificationManager } from './ui/NotificationManager.js';
import { StatusManager } from './ui/StatusManager.js';

export class UIController {
  constructor() {
    this.loadingManager = new LoadingManager();
    this.notificationManager = new NotificationManager();
    this.statusManager = new StatusManager();
  }

  init(){};

  showLoading(message) {
    this.loadingManager.show(message);
  }

  hideLoading() {
    this.loadingManager.hide();
  }

  updateLoadingMessage(message) {
    this.loadingManager.updateMessage(message);
  }

  showRobotStatus(status) {
    this.statusManager.showRobotStatus(status);
  }

  updateCanvasState(state) {
    this.statusManager.updateCanvasState(state);
  }

  showSuccess(message, duration) {
    return this.notificationManager.showSuccess(message, duration);
  }

  showError(message, duration) {
    return this.notificationManager.showError(message, duration);
  }

  showWarning(message, duration) {
    return this.notificationManager.showWarning(message, duration);
  }

  showInfo(message, duration) {
    return this.notificationManager.showInfo(message, duration);
  }

  createProgressBar(container, options) {
    return this.loadingManager.createProgressBar(container, options);
  }

  updateForMobile(isMobile) {
    this.statusManager.updateForMobile(isMobile);
  }

  getState() {
    return {
      loading: this.loadingManager.getState(),
      notifications: this.notificationManager.getCount(),
      status: this.statusManager.getState()
    };
  }

  dispose() {
    this.loadingManager.dispose();
    this.notificationManager.dispose();
    this.statusManager.dispose();
  }
} 