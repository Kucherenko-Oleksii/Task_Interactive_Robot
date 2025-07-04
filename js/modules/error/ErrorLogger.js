export class ErrorLogger {
  constructor() {
    this.errors = [];
    this.maxErrorHistory = 50;
    this.lastErrorTime = 0;
    this.errorCooldown = 1000;
    
    this.severity = {
      LOW: 'low',
      MEDIUM: 'medium',
      HIGH: 'high',
      CRITICAL: 'critical'
    };
  }

  storeError(errorObj) {
    this.errors.push(errorObj);
    
    if (this.errors.length > this.maxErrorHistory) {
      this.errors.shift();
    }
  }

  logError(errorObj) {
    const emoji = this.getErrorEmoji(errorObj.severity);
    const prefix = `${emoji} [${errorObj.category.toUpperCase()}]`;
    
    switch (errorObj.severity) {
      case this.severity.CRITICAL:
        console.error(`${prefix} CRITICAL:`, errorObj.message, errorObj);
        break;
      case this.severity.HIGH:
        console.error(`${prefix} HIGH:`, errorObj.message, errorObj);
        break;
      case this.severity.MEDIUM:
        console.warn(`${prefix} MEDIUM:`, errorObj.message, errorObj);
        break;
      case this.severity.LOW:
        console.info(`${prefix} LOW:`, errorObj.message, errorObj);
        break;
      default:
        console.log(`${prefix}`, errorObj.message, errorObj);
    }
  }

  getErrorEmoji(severityLevel) {
    switch (severityLevel) {
      case this.severity.CRITICAL: return 'Critical';
      case this.severity.HIGH: return 'High';
      case this.severity.MEDIUM: return 'Medium';
      case this.severity.LOW: return 'Low';
      default: return 'Unknown';
    }
  }

  shouldThrottleError() {
    const currentTime = Date.now();
    if (currentTime - this.lastErrorTime < this.errorCooldown) {
      return true;
    }
    this.lastErrorTime = currentTime;
    return false;
  }

  reportError(errorObj) {
    try {
      const errorReports = JSON.parse(localStorage.getItem('errorReports') || '[]');
      errorReports.push(errorObj);
      
      if (errorReports.length > 10) {
        errorReports.splice(0, errorReports.length - 10);
      }
      localStorage.setItem('errorReports', JSON.stringify(errorReports));
    } catch (e) {
    }
  }

  getErrorStats() {
    const stats = {
      total: this.errors.length,
      bySeverity: {},
      byCategory: {},
      recent: this.errors.slice(-10)
    };

    Object.values(this.severity).forEach(level => {
      stats.bySeverity[level] = this.errors.filter(e => e.severity === level).length;
    });
    return stats;
  }

  clearErrors() {
    this.errors = [];
  }

  exportErrorLogs() {
    const exportData = {
      timestamp: new Date().toISOString(),
      stats: this.getErrorStats(),
      errors: this.errors
    };
    return JSON.stringify(exportData, null, 2);
  }

  getAllErrors() {
    return this.errors;
  }

  getRecentErrors(count = 10) {
    return this.errors.slice(-count);
  }
} 