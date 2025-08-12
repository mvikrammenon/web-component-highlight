const StorageManager = {
  async saveToStorage(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  },

  async getFromStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key] || null);
      });
    });
  },

  async initializeSettings() {
    const storedSettings = await this.getFromStorage(defaultSettings.storageKeyName);

    if (storedSettings) {
      // A simple merge, stored settings take precedence
      const mergedSettings = { ...defaultSettings, ...storedSettings };
      // Ensure componentsConfig is merged correctly if it exists in both
      if (storedSettings.componentsConfig) {
        mergedSettings.componentsConfig = [
          ...defaultSettings.componentsConfig,
          ...storedSettings.componentsConfig
        ];
      }
      await this.saveToStorage(defaultSettings.storageKeyName, mergedSettings);
      return mergedSettings;
    }

    await this.saveToStorage(defaultSettings.storageKeyName, defaultSettings);
    return defaultSettings;
  }
};

const ComponentHighlighter = {
  createHighlightElement(component) {
    const highlightEl = document.createElement('div');
    highlightEl.style.position = 'absolute';
    highlightEl.style.border = component.borderHighlightStyle;
    highlightEl.style.pointerEvents = 'none';
    highlightEl.style.zIndex = '10000';
    highlightEl.setAttribute('data-component-name', component.name);
    highlightEl.setAttribute('title', `${component.name}\nContent Type: ${component.contentTypeUrl}\nUX Docs: ${component.uxDocsUrl}`);
    return highlightEl;
  },

  positionHighlight(highlightEl, targetEl) {
    const rect = targetEl.getBoundingClientRect();
    highlightEl.style.top = `${rect.top + window.scrollY}px`;
    highlightEl.style.left = `${rect.left + window.scrollX}px`;
    highlightEl.style.width = `${rect.width}px`;
    highlightEl.style.height = `${rect.height}px`;
  },

  highlightComponent(element, component) {
    const highlightEl = this.createHighlightElement(component);
    this.positionHighlight(highlightEl, element);
    document.body.appendChild(highlightEl);

    highlightEl.addEventListener('click', () => {
      window.open(component.contentTypeUrl, '_blank');
    });
  },

  removeHighlight() {
    const highlightElements = document.querySelectorAll(`[data-component-name]`);
    highlightElements.forEach(el => el.remove());
  },

  toggleHighlights(settings) {
    this.removeHighlight(); // Clear previous highlights
    if (!settings.isHighlightEnabled) {
      return;
    }

    settings.componentsConfig.forEach(component => {
      const selector = component.identifiers.id
        ? `#${component.identifiers.id}`
        : `.${component.identifiers.className}`;

      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        this.highlightComponent(el, component);
      });
    });
  },

  updateHighlightPositions(settings) {
    if (!settings.isHighlightEnabled) {
        return;
    }
    this.toggleHighlights(settings); // Re-run the highlight logic to reposition
  }
};

class ContentScript {
  constructor() {
    this.settings = null;
    this.initialize();
  }

  async initialize() {
    try {
      this.settings = await StorageManager.initializeSettings();
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
      window.addEventListener('scroll', () => this.handleScroll(), true); // Use capturing to get scroll events
      window.addEventListener('resize', () => this.handleResize());
      console.log('Content script initialized successfully');
    } catch (error) {
      console.error('Failed to initialize content script:', error);
    }
  }

  handleMessage(message) {
    if (message.action === 'toggleHighlight') {
      this.settings.isHighlightEnabled = !this.settings.isHighlightEnabled;
      StorageManager.saveToStorage(this.settings.storageKeyName, this.settings)
        .then(() => {
          ComponentHighlighter.toggleHighlights(this.settings);
        })
        .catch((error) => {
          console.error('Failed to save settings:', error);
        });
    }
  }

  handleScroll() {
    if (this.settings && this.settings.isHighlightEnabled) {
      ComponentHighlighter.updateHighlightPositions(this.settings);
    }
  }

  handleResize() {
    if (this.settings && this.settings.isHighlightEnabled) {
      ComponentHighlighter.updateHighlightPositions(this.settings);
    }
  }
}

new ContentScript();
