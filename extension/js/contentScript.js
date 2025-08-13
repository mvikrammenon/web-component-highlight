// Prevent multiple script injections
(function() {
  if (window.componentHighlighterLoaded) {
    return;
  }
  window.componentHighlighterLoaded = true;

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
    const uniqueId = Math.random().toString(36).substring(4, 10);
    const highlightEl = document.createElement('div');
    highlightEl.style.position = 'absolute';
    highlightEl.style.backgroundColor = '#007acc';
    highlightEl.style.color = 'white';
    highlightEl.style.padding = '4px 8px';
    highlightEl.style.borderRadius = '4px';
    highlightEl.style.fontSize = '12px';
    highlightEl.style.fontFamily = 'Arial, sans-serif';
    highlightEl.style.fontWeight = 'bold';
    highlightEl.style.cursor = 'pointer';
    highlightEl.style.zIndex = '10000';
    highlightEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    highlightEl.style.transition = 'all 0.2s ease';
    highlightEl.textContent = component.name;
    highlightEl.setAttribute('data-component-name', `${component.name}_${uniqueId}`);
    
    // Create custom tooltip
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '11px';
    tooltip.style.fontFamily = 'Arial, sans-serif';
    tooltip.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    tooltip.style.zIndex = '10001';
    tooltip.style.display = 'none';
    tooltip.style.minWidth = '200px';
    tooltip.style.maxWidth = '300px';
    tooltip.style.lineHeight = '1.4';
    
    // Create tooltip content with proper links
    tooltip.innerHTML = `
      <div style="margin-bottom: 6px; font-weight: bold;">${component.name}</div>
      ${component.contentTypeUrl ? `<div style="margin-bottom: 4px;"><strong>Content Type:</strong> <a href="${component.contentTypeUrl}" target="_blank" style="color: #4da6ff; text-decoration: none;">View Docs</a></div>` : ''}
      ${component.uxDocsUrl ? `<div><strong>UX Docs:</strong> <a href="${component.uxDocsUrl}" target="_blank" style="color: #4da6ff; text-decoration: none;">View Storybook</a></div>` : ''}
    `;
    
    document.body.appendChild(tooltip);
    
    // Add hover effects and tooltip functionality
     let hideTimeout;
     
     const showTooltip = () => {
       clearTimeout(hideTimeout);
       highlightEl.style.backgroundColor = '#005a9e';
       highlightEl.style.transform = 'scale(1.05)';
       
       // Position and show tooltip
       const rect = highlightEl.getBoundingClientRect();
       tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
       tooltip.style.left = `${rect.left + window.scrollX}px`;
       
       // Adjust tooltip position if it goes off-screen
       setTimeout(() => {
         const tooltipRect = tooltip.getBoundingClientRect();
         if (tooltipRect.right > window.innerWidth) {
           tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10 + window.scrollX}px`;
         }
         if (tooltipRect.bottom > window.innerHeight) {
           tooltip.style.top = `${rect.top + window.scrollY - tooltipRect.height - 5}px`;
         }
       }, 0);
       
       tooltip.style.display = 'block';
     };
     
     const hideTooltip = () => {
       highlightEl.style.backgroundColor = '#007acc';
       highlightEl.style.transform = 'scale(1)';
       hideTimeout = setTimeout(() => {
         tooltip.style.display = 'none';
       }, 300); // 300ms delay before hiding
     };
     
     highlightEl.addEventListener('mouseenter', showTooltip);
     highlightEl.addEventListener('mouseleave', hideTooltip);
     
     // Keep tooltip visible when hovering over it
     tooltip.addEventListener('mouseenter', () => {
       clearTimeout(hideTimeout);
     });
     
     tooltip.addEventListener('mouseleave', () => {
       hideTimeout = setTimeout(() => {
         tooltip.style.display = 'none';
       }, 300); // 300ms delay before hiding
     });
    
    // Store tooltip reference for cleanup
    highlightEl._tooltip = tooltip;
    
    return highlightEl;
  },

  positionHighlight(highlightEl, targetEl) {
    const rect = targetEl.getBoundingClientRect();
    // Position the tag in the top right corner of the component
    highlightEl.style.top = `${rect.top + window.scrollY - 2}px`;
    highlightEl.style.left = `${rect.right + window.scrollX - highlightEl.offsetWidth - 2}px`;
    
    // Ensure the tag doesn't go off-screen
    const tagRect = highlightEl.getBoundingClientRect();
    if (tagRect.right > window.innerWidth) {
      highlightEl.style.left = `${rect.left + window.scrollX + 2}px`;
    }
    if (tagRect.top < 0) {
      highlightEl.style.top = `${rect.top + window.scrollY + 2}px`;
    }
  },

  highlightComponent(element, component) {
    const highlightEl = this.createHighlightElement(component);
    // Append to DOM first so we can get dimensions
    document.body.appendChild(highlightEl);
    this.positionHighlight(highlightEl, element);

    highlightEl.addEventListener('click', () => {
      window.open(component.contentTypeUrl, '_blank');
    });
  },

  removeHighlight() {
    const highlightElements = document.querySelectorAll(`[data-component-name]`);
    highlightElements.forEach(el => {
      // Clean up associated tooltip
      if (el._tooltip) {
        el._tooltip.remove();
      }
      el.remove();
    });
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
})();
