// contentScript.js
/**
 * Default settings structure for the extension.
 * Declaring as const has issues - research later
 * Uncaught SyntaxError: Identifier 'defaultSettings' has already been declared
 */
function getDefaultSettings() {
  return {
    isHighlightEnabled: false,
    storageKeyName: "component-highlight-settings",
    elHighlightName: "data-component-highlight",
    componentsConfig: [
      {
        name: "Banner",
        contentTypeUrl: "https://docs.example.com/FooterComponent",
        uxDocsUrl: "https://zeroheight.com/",
        identifiers: {
          className: "sitesBanner",
          id: "730VWGE2yHuzuKqADigbb3",
        },
        borderHighlightStyle: "1px dotted red",
      },
      // Other component configurations...
    ]
  };
}

// ComponentHighlighter class implementation
class ComponentHighlighter {
  static instance;

  static getInstance() {
    if (!ComponentHighlighter.instance) {
      ComponentHighlighter.instance = new ComponentHighlighter();
    }
    return ComponentHighlighter.instance;
  }

  createHighlightElement(component) {
    const highlightEl = document.createElement('div');
    highlightEl.style.position = 'absolute';
    highlightEl.style.border = component.borderHighlightStyle;
    highlightEl.style.pointerEvents = 'none';
    highlightEl.style.zIndex = '10000';
    highlightEl.setAttribute('data-component-name', component.name);
    highlightEl.setAttribute('title', `${component.name}\nContent Type: ${component.contentTypeUrl}\nUX Docs: ${component.uxDocsUrl}`);
    return highlightEl;
  }

  positionHighlight(highlightEl, targetEl) {
    const rect = targetEl.getBoundingClientRect();
    highlightEl.style.top = `${rect.top + window.scrollY}px`;
    highlightEl.style.left = `${rect.left + window.scrollX}px`;
    highlightEl.style.width = `${rect.width}px`;
    highlightEl.style.height = `${rect.height}px`;
  }

  toggleHighlights(settings) {
    // Remove existing highlights
    document.querySelectorAll(`[${settings.elHighlightName}]`).forEach(el => {
      el.remove();
    });

    if (!settings.isHighlightEnabled) {
      return;
    }

    // Add new highlights
    settings.componentsConfig.forEach(component => {
      this.highlightComponent(component, settings);
    });
  }

  highlightComponent(component, settings) {
    const elements = this.findElementsByIdentifiers(component.identifiers);
    
    elements.forEach(el => {
      const highlightEl = this.createHighlightElement(component);
      highlightEl.setAttribute(settings.elHighlightName, 'true');
      this.positionHighlight(highlightEl, el);
      document.body.appendChild(highlightEl);
    });
  }

  findElementsByIdentifiers(identifiers) {
    const elements = [];
    
    if (identifiers.id) {
      const element = document.getElementById(identifiers.id);
      if (element) elements.push(element);
    }
    
    if (identifiers.className) {
      const foundElements = document.getElementsByClassName(identifiers.className);
      for (let i = 0; i < foundElements.length; i++) {
        elements.push(foundElements[i]);
      }
    }
    
    return elements;
  }

  updateHighlightPositions() {
    const highlights = document.querySelectorAll('[data-component-name]');
    
    highlights.forEach(highlight => {
      const componentName = highlight.getAttribute('data-component-name');
      const settings = JSON.parse(localStorage.getItem('component-highlight-settings') || '{}');
      const component = settings.componentsConfig?.find(c => c.name === componentName);
      
      if (component) {
        const elements = this.findElementsByIdentifiers(component.identifiers);
        if (elements.length > 0) {
          this.positionHighlight(highlight, elements[0]);
        }
      }
    });
  }
}

// StorageManager class implementation
class StorageManager {
  static instance;

  static getInstance() {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async saveToStorage(key, value) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getFromStorage(key) {
    return new Promise((resolve, reject) => {
      try {
        const value = localStorage.getItem(key);
        resolve(value ? JSON.parse(value) : null);
      } catch (error) {
        reject(error);
      }
    });
  }

  async initializeSettings() {
    try {
      let settings = await this.getFromStorage('component-highlight-settings');
      
      if (!settings) {
        settings = getDefaultSettings();
        await this.saveToStorage(settings.storageKeyName, settings);
      }
      
      return settings;
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      return getDefaultSettings();
    }
  }
}

// ContentScript class implementation
class ContentScript {
  constructor() {
    this.settings = null;
    this.highlighter = ComponentHighlighter.getInstance();
    this.storageManager = StorageManager.getInstance();
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize settings
      this.settings = await this.storageManager.initializeSettings();

      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

      // Listen for scroll and resize events to update highlight positions
      window.addEventListener('scroll', this.handleScroll.bind(this));
      window.addEventListener('resize', this.handleResize.bind(this));

      console.log('Content script initialized successfully');
    } catch (error) {
      console.error('Failed to initialize content script:', error);
    }
  }

  handleMessage(message) {
    if (!this.settings) return;

    if (message.action === 'toggleHighlight') {
      this.settings.isHighlightEnabled = !this.settings.isHighlightEnabled;
      this.storageManager.saveToStorage(this.settings.storageKeyName, this.settings)
        .then(() => {
          this.highlighter.toggleHighlights(this.settings);
        })
        .catch((error) => {
          console.error('Failed to save settings:', error);
        });
    }
  }

  handleScroll() {
    if (this.settings?.isHighlightEnabled) {
      this.highlighter.updateHighlightPositions();
    }
  }

  handleResize() {
    if (this.settings?.isHighlightEnabled) {
      this.highlighter.updateHighlightPositions();
    }
  }
}

// Initialize the content script
const contentScript = new ContentScript();

// Helper function to inject scripts into the page
function injectScript(file) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(file);
  script.onload = () => {
    console.log(`Injected script: ${file}`);
    //  script.remove(); // Clean up by removing the script tag after execution
  };
  script.onerror = (e) => {
    console.error(`Failed to inject script: ${file}`, e);
  };
  (document.head || document.documentElement).appendChild(script);
}

// Inject the injectedScript.js file
injectScript('injectedScript.js');