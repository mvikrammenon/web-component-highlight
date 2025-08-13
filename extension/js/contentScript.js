// Prevent multiple script injections
(function() {
  if (window.componentHighlighterLoaded) {
    return;
  }
  window.componentHighlighterLoaded = true;

  const StorageManager = {
    /**
     * Saves a key-value pair to Chrome's local storage
     * @param {string} key - The storage key
     * @param {*} value - The value to store
     * @returns {Promise<void>} Promise that resolves when storage is complete
     */
    async saveToStorage(key, value) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      });
    },

    /**
     * Retrieves a value from Chrome's local storage
     * @param {string} key - The storage key to retrieve
     * @returns {Promise<*>} Promise that resolves with the stored value or null
     */
    async getFromStorage(key) {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
          resolve(result[key] || null);
        });
      });
    },

    /**
     * Initializes extension settings by merging stored settings with defaults
     * @returns {Promise<Object>} Promise that resolves with the merged settings object
     */
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
  /**
   * Creates a highlight tag element with tooltip for a component
   * @param {Object} component - Component configuration object
   * @param {string} component.name - Display name of the component
   * @param {string} [component.contentTypeUrl] - URL to content type documentation
   * @param {string} [component.uxDocsUrl] - URL to UX documentation/Storybook
   * @returns {HTMLElement} The created highlight element with attached tooltip
   */
  createHighlightElement(component) {
    const uniqueId = Math.random().toString(36).substring(4, 10);
    const highlightEl = document.createElement('div');
    highlightEl.className = 'component-highlight-tag';
    highlightEl.textContent = component.name;
    highlightEl.setAttribute('data-component-name', `${component.name}_${uniqueId}`);
    
    // Create custom tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'component-highlight-tooltip';
    
    // Create tooltip content with proper links
    tooltip.innerHTML = `
      <div class="component-highlight-tooltip-title">${component.name}</div>
      ${component.contentTypeUrl ? `<div class="component-highlight-tooltip-item"><strong>Content Type:</strong> <a href="${component.contentTypeUrl}" target="_blank" class="component-highlight-tooltip-link">View Docs</a></div>` : ''}
      ${component.uxDocsUrl ? `<div class="component-highlight-tooltip-item"><strong>UX Docs:</strong> <a href="${component.uxDocsUrl}" target="_blank" class="component-highlight-tooltip-link">View Storybook</a></div>` : ''}
    `;
    
    document.body.appendChild(tooltip);
    
    // Add hover effects and tooltip functionality
     let hideTimeout;
     
     const showTooltip = () => {
       clearTimeout(hideTimeout);
       
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

  /**
   * Positions a highlight element relative to its target component
   * @param {HTMLElement} highlightEl - The highlight tag element to position
   * @param {HTMLElement} targetEl - The target component element to highlight
   */
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

  /**
   * Creates and positions a highlight for a specific DOM element
   * @param {HTMLElement} element - The DOM element to highlight
   * @param {Object} component - Component configuration object
   */
  highlightComponent(element, component) {
    // Check if element is already highlighted
    if (element.hasAttribute('data-component-highlighted')) {
      return;
    }
    
    const highlightEl = this.createHighlightElement(component);
    // Append to DOM first so we can get dimensions
    document.body.appendChild(highlightEl);
    this.positionHighlight(highlightEl, element);
    
    // Mark the source element as highlighted
    element.setAttribute('data-component-highlighted', 'true');
    element.setAttribute('data-highlight-id', highlightEl.getAttribute('data-component-name'));
    
    // Store reference to source element in highlight for cleanup
    highlightEl._sourceElement = element;
  },

  /**
   * Removes all highlight elements and cleans up associated data
   */
  removeHighlight() {
    const highlightElements = document.querySelectorAll(`[data-component-name]`);
    highlightElements.forEach(el => {
      // Clean up associated tooltip
      if (el._tooltip) {
        el._tooltip.remove();
      }
      
      // Remove highlighting marker from source element
      if (el._sourceElement) {
        el._sourceElement.removeAttribute('data-component-highlighted');
        el._sourceElement.removeAttribute('data-highlight-id');
      }
      
      el.remove();
    });
  },

  /**
   * Toggles component highlights based on current settings
   * @param {Object} settings - Extension settings object
   * @param {boolean} settings.isHighlightEnabled - Whether highlighting is enabled
   * @param {Array} settings.componentsConfig - Array of component configurations
   */
  toggleHighlights(settings) {
    this.removeHighlight(); // Clear previous highlights
    if (!settings.isHighlightEnabled) {
      return;
    }

    settings.componentsConfig.forEach(component => {
      const selector = component.identifiers.id
        ? `#${component.identifiers.id}`
        : `.${component.identifiers.className}`;

      // Only select elements that haven't been highlighted yet
      const elements = document.querySelectorAll(`${selector}:not([data-component-highlighted])`);
      
      // Group elements by proximity to avoid overlapping highlights
      const representativeElements = this.getRepresentativeElements(elements);
      
      representativeElements.forEach(el => {
        this.highlightComponent(el, component);
      });
    });
  },

  /**
   * Filters elements to prevent overlapping highlights by selecting representative elements
   * @param {NodeList|Array} elements - Collection of DOM elements to filter
   * @returns {Array} Array of representative elements with minimum distance between them
   */
  getRepresentativeElements(elements) {
    if (elements.length === 0) return [];
    if (elements.length === 1) return [elements[0]];
    
    const representatives = [];
    const processed = new Set();
    const minDistance = 20; // Minimum distance in pixels between highlights
    
    Array.from(elements).forEach(element => {
      if (processed.has(element)) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Check if this element is too close to any existing representative
      const tooClose = representatives.some(rep => {
        const repRect = rep.getBoundingClientRect();
        const repCenterX = repRect.left + repRect.width / 2;
        const repCenterY = repRect.top + repRect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(centerX - repCenterX, 2) + Math.pow(centerY - repCenterY, 2)
        );
        
        return distance < minDistance;
      });
      
      if (!tooClose) {
        representatives.push(element);
        
        // Mark nearby elements as processed to avoid duplicates
        Array.from(elements).forEach(otherElement => {
          if (processed.has(otherElement)) return;
          
          const otherRect = otherElement.getBoundingClientRect();
          const otherCenterX = otherRect.left + otherRect.width / 2;
          const otherCenterY = otherRect.top + otherRect.height / 2;
          
          const distance = Math.sqrt(
            Math.pow(centerX - otherCenterX, 2) + Math.pow(centerY - otherCenterY, 2)
          );
          
          if (distance < minDistance) {
            processed.add(otherElement);
          }
        });
      }
      
      processed.add(element);
    });
    
    return representatives;
  },

  /**
   * Updates positions of existing highlights and handles new elements
   * @param {Object} settings - Extension settings object
   */
  updateHighlightPositions(settings) {
    if (!settings.isHighlightEnabled) {
        return;
    }
    
    // Only reposition existing highlights, don't recreate them
    const highlightElements = document.querySelectorAll(`[data-component-name]`);
    highlightElements.forEach(highlightEl => {
      if (highlightEl._sourceElement && document.contains(highlightEl._sourceElement)) {
        this.positionHighlight(highlightEl, highlightEl._sourceElement);
      } else {
        // Source element no longer exists, remove the highlight
        if (highlightEl._tooltip) {
          highlightEl._tooltip.remove();
        }
        highlightEl.remove();
      }
    });
    
    // Check for new elements that need highlighting
    this.highlightNewElements(settings);
  },
  
  /**
   * Highlights newly added DOM elements that match component selectors
   * @param {Object} settings - Extension settings object
   */
  highlightNewElements(settings) {
    settings.componentsConfig.forEach(component => {
      const selector = component.identifiers.id
        ? `#${component.identifiers.id}`
        : `.${component.identifiers.className}`;

      // Only select elements that haven't been highlighted yet
      const elements = document.querySelectorAll(`${selector}:not([data-component-highlighted])`);
      
      if (elements.length > 0) {
        // Group elements by proximity to avoid overlapping highlights
        const representativeElements = this.getRepresentativeElements(elements);
        
        representativeElements.forEach(el => {
          this.highlightComponent(el, component);
        });
      }
    });
  }
};

  /**
   * Main content script class that manages the extension lifecycle
   */
  class ContentScript {
    /**
     * Creates a new ContentScript instance and initializes it
     */
    constructor() {
      this.settings = null;
      this.initialize();
    }

    /**
     * Initializes the content script by loading settings and setting up event listeners
     * @returns {Promise<void>}
     */
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

    /**
     * Handles messages from the background script
     * @param {Object} message - Message object from background script
     * @param {string} message.action - Action to perform
     */
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

    /**
     * Handles scroll events by updating highlight positions
     */
    handleScroll() {
      if (this.settings && this.settings.isHighlightEnabled) {
        ComponentHighlighter.updateHighlightPositions(this.settings);
      }
    }

    /**
     * Handles resize events by updating highlight positions
     */
    handleResize() {
      if (this.settings && this.settings.isHighlightEnabled) {
        ComponentHighlighter.updateHighlightPositions(this.settings);
      }
    }
  }

  new ContentScript();
})();
