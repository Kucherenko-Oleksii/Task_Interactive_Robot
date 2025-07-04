export class ErrorInfo {
  constructor() {
    this.errorIdCounter = 0;
  }

  generateErrorId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  getAdditionalInfo() {
    return {
      performance: {
        memory: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : null,
        timing: performance.timing ? {
          loadEventEnd: performance.timing.loadEventEnd,
          navigationStart: performance.timing.navigationStart
        } : null
      },
      webgl: this.getWebGLInfo()
    };
  }

  getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return { supported: false };
      }

      return {
        supported: true,
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
      };
    } catch (e) {
      return { supported: false, error: e.message };
    }
  }

  createErrorObject(error, category, severityLevel) {
    return {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace available',
      category: category,
      severity: severityLevel,
      userAgent: navigator.userAgent,
      url: window.location.href,
      browserInfo: this.getBrowserInfo(),
      additionalInfo: this.getAdditionalInfo()
    };
  }

  getGLErrorName(error) {
    switch (error) {
      case WebGLRenderingContext.NO_ERROR: return 'NO_ERROR';
      case WebGLRenderingContext.INVALID_ENUM: return 'INVALID_ENUM';
      case WebGLRenderingContext.INVALID_VALUE: return 'INVALID_VALUE';
      case WebGLRenderingContext.INVALID_OPERATION: return 'INVALID_OPERATION';
      case WebGLRenderingContext.OUT_OF_MEMORY: return 'OUT_OF_MEMORY';
      case WebGLRenderingContext.CONTEXT_LOST_WEBGL: return 'CONTEXT_LOST_WEBGL';
      default: return 'UNKNOWN_ERROR';
    }
  }
} 