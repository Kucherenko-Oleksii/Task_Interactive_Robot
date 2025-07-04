const createMockWithMethods = (methods) => 
    Object.fromEntries(methods.map(method => [method, jest.fn()]));
  
  global.localStorage = createMockWithMethods(['getItem', 'setItem', 'removeItem', 'clear']);
  global.console = {
    ...console,
    ...createMockWithMethods(['error', 'warn', 'info', 'log'])
  };
  
  const createStyleProxy = () => new Proxy({}, {
    get: (target, prop) => target[prop] || '',
    set: (target, prop, value) => (target[prop] = value, true)
  });
  
  const createClassList = () => ({
    ...createMockWithMethods(['add', 'remove', 'toggle']),
    contains: jest.fn(() => false)
  });
  
  const parseProgressBarHTML = (html, element) => {
    const matchers = {
      width: /width:\s*(\d+)%/,
      backgroundColor: /background-color:\s*([^;]+)/
    };
  
    if (html.includes('progress-bar-fill')) {
      const fillElement = createMockElement('div', { className: 'progress-bar-fill' });
      
      Object.entries(matchers).forEach(([prop, regex]) => {
        const match = html.match(regex);
        if (match) {
          fillElement.style[prop] = prop === 'width' ? `${match[1]}%` : match[1];
        }
      });    
      element._fillElement = fillElement;
    }
    
    if (html.includes('progress-bar-text')) {
      element._textElement = createMockElement('div', { 
        className: 'progress-bar-text',
        textContent: '0%'
      });
    }
  };
  
  const SELECTOR_MAP = {
    '.progress-bar-fill': (element) => element._fillElement || createMockElement('div', { className: 'progress-bar-fill' }),
    '.progress-bar-text': (element) => element._textElement || createMockElement('div', { className: 'progress-bar-text' }),
    '.progress-bar-track': () => createMockElement('div', { className: 'progress-bar-track' })
  };
  
  const createMockElement = (tagName = 'div', attributes = {}) => {
    const element = {
      tagName: tagName.toUpperCase(),
      style: createStyleProxy(),
      classList: createClassList(),
      textContent: '',
      className: '',
      children: [],
      parentNode: null,
      offsetWidth: 100,
      offsetHeight: 100,
      clientWidth: 100,
      clientHeight: 100,
      _innerHTML: '',
      ...createMockWithMethods(['setAttribute', 'getAttribute', 'appendChild', 'removeChild', 'addEventListener', 'removeEventListener']),
      ...attributes,

      get innerHTML() {
        return this._innerHTML;
      },
      set innerHTML(value) {
        this._innerHTML = value;
        parseProgressBarHTML(value, this);
      },
      querySelector: jest.fn((selector) => 
        SELECTOR_MAP[selector]?.(element) || createMockElement()
      ),
      querySelectorAll: jest.fn(() => [])
    };
    return element;
  };
  
  global.document = {
    ...document,
    ...createMockWithMethods(['addEventListener', 'removeEventListener']),
    querySelector: jest.fn((selector) => createMockElement(selector)),
    getElementById: jest.fn((id) => createMockElement('div', { id })),
    createElement: jest.fn((tagName) => createMockElement(tagName)),
    body: createMockElement('body')
  };
  
  global.window = {
    ...window,
    ...createMockWithMethods(['addEventListener', 'removeEventListener']),
    innerWidth: 1920,
    innerHeight: 1080,
    devicePixelRatio: 1,
    location: { reload: jest.fn() }
  };
  
  global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
  global.cancelAnimationFrame = jest.fn();
  
  [global.WebGLRenderingContext, global.WebGL2RenderingContext] = [{}, {}];
  
  global.HTMLElement = class HTMLElement {
    constructor() {
      Object.assign(this, {
        style: createStyleProxy(),
        classList: createClassList()
      });
    }
    querySelector = (selector) => createMockElement(selector);
    appendChild = (child) => child;
  };