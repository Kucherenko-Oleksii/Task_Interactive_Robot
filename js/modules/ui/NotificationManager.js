export class NotificationManager {
  constructor() {
    this.notifications = [];
    this.maxNotifications = 5;
  }

  create(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon">${this.getIcon(type)}</span>
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Закрити">&times;</button>
      </div>
    `;
    
    this.styleNotification(notification, type);
    this.addNotification(notification, duration);
    
    return notification;
  }

  styleNotification(notification, type) {
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getColor(type)};
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      max-width: 300px;
      font-size: 14px;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      margin-bottom: 8px;
    `;
  }

  addNotification(notification, duration) {
    if (this.notifications.length >= this.maxNotifications) {
      this.remove(this.notifications[0]);
    }
    
    const index = this.notifications.length;
    notification.style.top = `${20 + (index * 60)}px`;
    
    document.body.appendChild(notification);
    this.notifications.push(notification);
    
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    });
    
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
      this.remove(notification);
    });
    
    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }
  }

  remove(notification) {
    const index = this.notifications.indexOf(notification);
    if (index === -1) return;
    
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      this.notifications.splice(index, 1);
      this.repositionNotifications();
    }, 300);
  }

  repositionNotifications() {
    this.notifications.forEach((notification, index) => {
      notification.style.top = `${20 + (index * 60)}px`;
    });
  }

  getIcon(type) {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info':
      default: return 'info';
    }
  }

  getColor(type) {
    switch (type) {
      case 'success': return '#2ecc71';
      case 'error': return '#e74c3c';
      case 'warning': return '#f39c12';
      case 'info':
      default: return '#3498db';
    }
  }

  showSuccess(message, duration = 3000) {
    return this.create(message, 'success', duration);
  }

  showError(message, duration = 5000) {
    return this.create(message, 'error', duration);
  }

  showWarning(message, duration = 4000) {
    return this.create(message, 'warning', duration);
  }

  showInfo(message, duration = 3000) {
    return this.create(message, 'info', duration);
  }

  clearAll() {
    [...this.notifications].forEach(notification => {
      this.remove(notification);
    });
  }

  getCount() {
    return this.notifications.length;
  }

  dispose() {
    this.clearAll();
    this.notifications = [];
  }
} 