import { ErrorLogger } from '../js/modules/error/ErrorLogger.js';

describe('ErrorLogger', () => {
  let errorLogger;

  beforeEach(() => {
    errorLogger = new ErrorLogger();
    localStorage.clear();

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with correct default values', () => {
      expect(errorLogger.errors).toEqual([]);
      expect(errorLogger.maxErrorHistory).toBe(50);
      expect(errorLogger.errorCooldown).toBe(1000);
    });

    test('should have correct severity levels', () => {
      expect(errorLogger.severity.LOW).toBe('low');
      expect(errorLogger.severity.MEDIUM).toBe('medium');
      expect(errorLogger.severity.HIGH).toBe('high');
      expect(errorLogger.severity.CRITICAL).toBe('critical');
    });
  });

  describe('storeError', () => {
    test('should store error in errors array', () => {
      const errorObj = { message: 'Test error', severity: 'high' };
      errorLogger.storeError(errorObj);   
      expect(errorLogger.errors).toHaveLength(1);
      expect(errorLogger.errors[0]).toEqual(errorObj);
    });

    test('should maintain max error history limit', () => {
      errorLogger.maxErrorHistory = 2;
        
      const errorL = { message: 'Error L', severity: 'low' };
      const errorM = { message: 'Error M', severity: 'medium' };
      const errorH = { message: 'Error H', severity: 'high' };

      errorLogger.storeError(errorL);
      errorLogger.storeError(errorM);
      errorLogger.storeError(errorH);
      
      expect(errorLogger.errors).toHaveLength(2);
      expect(errorLogger.errors[0]).toEqual(errorM);
      expect(errorLogger.errors[1]).toEqual(errorH);
    });
  });

  describe('logError', () => {
    test('should log critical errors with console.error', () => {
      const errorObj = { 
        message: 'Critical error', 
        severity: 'critical',
        category: 'system'
      };  
      errorLogger.logError(errorObj);
      
      expect(console.error).toHaveBeenCalledWith(
        'Critical [SYSTEM] CRITICAL:', 
        'Critical error', 
        errorObj
      );
    });

    test('should log high severity errors with console.error', () => {
      const errorObj = { 
        message: 'High error', 
        severity: 'high',
        category: 'network'
      };    
      errorLogger.logError(errorObj);
      
      expect(console.error).toHaveBeenCalledWith(
        'High [NETWORK] HIGH:', 
        'High error', 
        errorObj
      );
    });

    test('should log medium severity errors with console.warn', () => {
      const errorObj = { 
        message: 'Medium error', 
        severity: 'medium',
        category: 'ui'
      };     
      errorLogger.logError(errorObj);  

      expect(console.warn).toHaveBeenCalledWith(
        'Medium [UI] MEDIUM:', 
        'Medium error', 
        errorObj
      );
    });

    test('should log low severity errors with console.info', () => {
      const errorObj = { 
        message: 'Low error', 
        severity: 'low',
        category: 'performance'
      };    
      errorLogger.logError(errorObj);  

      expect(console.info).toHaveBeenCalledWith(
        'Low [PERFORMANCE] LOW:', 
        'Low error', 
        errorObj
      );
    });
  });

  describe('shouldThrottleError', () => {
    test('should return false for first error', () => {
      expect(errorLogger.shouldThrottleError()).toBe(false);
    });

    test('should return true for errors within cooldown period', () => {
      errorLogger.shouldThrottleError();
      expect(errorLogger.shouldThrottleError()).toBe(true);
    });

    test('should return false after cooldown period', (done) => {
      errorLogger.errorCooldown = 100;
      errorLogger.shouldThrottleError();
      
      setTimeout(() => {
        expect(errorLogger.shouldThrottleError()).toBe(false);
        done();
      }, 150);
    });
  });

  describe('getErrorStats', () => {
    test('should return correct stats for stored errors', () => {
      const errors = [
        { severity: 'low', category: 'ui' },
        { severity: 'high', category: 'network' },
        { severity: 'low', category: 'performance' }
      ];
      
      errors.forEach(error => errorLogger.storeError(error));
      
      const stats = errorLogger.getErrorStats();      
      expect(stats.total).toBe(3);
      expect(stats.bySeverity.low).toBe(2);
      expect(stats.bySeverity.high).toBe(1);
      expect(stats.bySeverity.medium).toBe(0);
      expect(stats.bySeverity.critical).toBe(0);
      expect(stats.recent).toHaveLength(3);
    });
  });

  describe('clearErrors', () => {
    test('should clear all errors', () => {
      errorLogger.storeError({ message: 'Test error' });
      expect(errorLogger.errors).toHaveLength(1);  
      errorLogger.clearErrors();
      expect(errorLogger.errors).toHaveLength(0);
    });
  });

  describe('exportErrorLogs', () => {
    test('should export error logs as JSON string', () => {
      const error = { message: 'Test error', severity: 'medium' };
      errorLogger.storeError(error);     
      const exportedLogs = errorLogger.exportErrorLogs();
      const parsedLogs = JSON.parse(exportedLogs);   

      expect(parsedLogs).toHaveProperty('timestamp');
      expect(parsedLogs).toHaveProperty('stats');
      expect(parsedLogs).toHaveProperty('errors');
      expect(parsedLogs.errors).toHaveLength(1);
      expect(parsedLogs.errors[0]).toEqual(error);
    });
  });

  describe('getRecentErrors', () => {
    test('should return specified number of recent errors', () => {
      const errors = [
        { message: 'Error L' },
        { message: 'Error M' },
        { message: 'Error H' },
        { message: 'Error C' }
      ];    
      errors.forEach(error => errorLogger.storeError(error));   
      const recentErrors = errorLogger.getRecentErrors(2);

      expect(recentErrors).toHaveLength(2);
      expect(recentErrors[0].message).toBe('Error H');
      expect(recentErrors[1].message).toBe('Error C');
    });

    test('should return all errors if count is greater than total', () => {
      const error = { message: 'Only error' };
      errorLogger.storeError(error);    
      const recentErrors = errorLogger.getRecentErrors(10);
      expect(recentErrors).toHaveLength(1);
      expect(recentErrors[0]).toEqual(error);
    });
  });
}); 