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
      {
        name: "Hero",
        contentTypeUrl: "https://docs.example.com/HeroComponent",
        uxDocsUrl: "https://zeroheight.com/",
        identifiers: {
          className: "heroComponent",
        },
        borderHighlightStyle: "1px solid red",
      },
      {
        name: "Cards Container",
        contentTypeUrl: "https://docs.example.com/HeroComponent",
        uxDocsUrl: "https://zeroheight.com/",
        identifiers: {
          className: "sitesCardsContainer",
        },
        borderHighlightStyle: "1px dotted green",
      },
      {
        name: "Cards",
        contentTypeUrl: "https://docs.example.com/HeroComponent",
        uxDocsUrl: "https://zeroheight.com/",
        identifiers: {
          className: "siemens-cards",
        },
        borderHighlightStyle: "1px dotted blue",
      },
      {
        name: "3 Col Tiles",
        contentTypeUrl: "https://docs.example.com/HeroComponent",
        uxDocsUrl: "https://zeroheight.com/",
        identifiers: {
          className: "sitesThreeColTiles",
        },
        borderHighlightStyle: "1px dotted blue",
      },
      {
        name: "Promo",
        contentTypeUrl: "https://docs.example.com/HeroComponent",
        uxDocsUrl: "https://zeroheight.com/",
        identifiers: {
          className: "promo-section",
        },
        borderHighlightStyle: "1px dotted blue",
      },
    ]
  };
}
/**
 * Function to inject a JavaScript file into the webpage's context.
 * @param {string} file - The filename of the script to inject.
 */
function injectScript(file) {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL(file);
  script.onload = () => {
    console.log(`Injected script: ${file}`);
    script.remove(); // Clean up by removing the script tag after execution
  };
  script.onerror = () => {
    console.error(`Failed to inject script: ${file}`);
  };
  (document.head || document.documentElement).appendChild(script);
}

/**
 * Function to inject a stylesheet into the webpage.
 * @param {string} file - The filename of the stylesheet to inject.
 */
function injectStylesheet(file) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.id = 'extension-component-highlight';
  link.href = chrome.runtime.getURL(file);
  (document.head || document.documentElement).appendChild(link);
}

/**
   * Sends a message to the injected script via Custom Events.
   * @param {Object} message - The message object containing action, key, and value.
   */
function sendMessageToPage(message) {
  const event = new CustomEvent('extensionMessage', { detail: message });
  window.dispatchEvent(event);
  console.log('Sent message to page:', message);
}

/**
 * Listens for a response from the injected script.
 * @param {Function} callback - The function to execute when a response is received.
 */
function receiveMessageFromPage(callback) {
  window.addEventListener('extensionResponse', (event) => {
    console.log('Received response from page:', event.detail);
    callback(event.detail);
  }, { once: true }); // Ensures the listener is removed after handling the first event
}

/**
 * Saves a key-value pair to window.localStorage via the injected script.
 * @param {string} key - The key under which the value is stored.
 * @param {*} value - The value to store.
 * @returns {Promise} - Resolves on successful save, rejects on error.
 */
function saveToLocalStorage(key, value, from) {
  return new Promise((resolve, reject) => {
    sendMessageToPage({ action: 'save', key, value, from});
    receiveMessageFromPage((response) => {
      if (response.status === 'success') {
        console.log(`Successfully saved "${key}" to localStorage.`);
        resolve();
      } else {
        console.error(`Error saving "${key}" to localStorage:`, response.error);
        reject(response.error);
      }
    });
  });
}

/**
 * Retrieves a value from window.localStorage via the injected script.
 * @param {string} key - The key whose value is to be retrieved.
 * @returns {Promise} - Resolves with the retrieved value, rejects on error.
 */
function getFromLocalStorage(key) {
  return new Promise((resolve, reject) => {
    sendMessageToPage({ action: 'get', key });
    receiveMessageFromPage((response) => {
      if (response.data !== undefined) {
        console.log(`Retrieved "${key}" from localStorage:`, response.data);
        resolve(response.data);
      } else {
        console.warn(`"${key}" not found in localStorage.`);
        resolve(null); // Treat undefined as null (key doesn't exist)
      }
    });
  });
}

/**
 * Initializes the extension settings by retrieving them from localStorage,
 * merging with default settings if necessary, and saving them back to localStorage.
 * @returns {Promise<Object>} - Resolves with the initialized settings object.
 */
function initializeSettings() {
  const defaultSettings = getDefaultSettings();
  return new Promise((resolve, reject) => {
    getFromLocalStorage(defaultSettings.storageKeyName)
      .then((storedSettings) => {
        if (storedSettings) {
          // Merge stored settings with default settings
          const mergedSettings = {
            ...defaultSettings,
            ...storedSettings,
            componentsConfig: mergeComponentsConfig(defaultSettings.componentsConfig, storedSettings.componentsConfig)
          };
          // Save the merged settings back to localStorage
          return saveToLocalStorage(defaultSettings.storageKeyName, mergedSettings, 'initializeSettings, found storedSettings, merging default')
            .then(() => resolve(mergedSettings));
        } else {
          // No settings found; save default settings
          return saveToLocalStorage(defaultSettings.storageKeyName, defaultSettings, 'initializeSettings, no storedSettings, saving default')
            .then(() => resolve(defaultSettings));
        }
      })
      .catch((error) => {
        console.error("Error initializing settings:", error);
        reject(error);
      });
  });
}

/**
 * Merges the default componentsConfig with any new components from stored settings.
 * @param {Array} defaultConfig - The default componentsConfig array.
 * @param {Array} storedConfig - The stored componentsConfig array.
 * @returns {Array} - The merged componentsConfig array.
 */
function mergeComponentsConfig(defaultConfig, storedConfig) {
  if (!Array.isArray(storedConfig)) return defaultConfig;
  
  // Create a map of existing component names for quick lookup
  const existingComponents = new Map();
  defaultConfig.forEach(component => existingComponents.set(component.name, component));
  
  // Merge or add new components from storedConfig
  storedConfig.forEach(component => {
    if (existingComponents.has(component.name)) {
      // Merge existing component with stored component
      const defaultComponent = existingComponents.get(component.name);
      existingComponents.set(component.name, { 
        ...defaultComponent, 
        ...component, 
        identifiers: { 
          ...defaultComponent.identifiers, 
          ...component.identifiers 
        } 
      });
    } else {
      // Add new component from storedConfig
      existingComponents.set(component.name, component);
    }
  });
  
  // Return the merged componentsConfig as an array
  return Array.from(existingComponents.values());
}

/**
 * 
 * @param {Array} componentsConfig - The stored componentsConfig array.
 * @returns 
 */
function getHighlightableElements(componentsConfig = []) {
  const elements = [];
  // could use a reduce function?
  console.group('componentsConfig')
  componentsConfig.forEach(component => {
    if (component.identifiers.id) {
      let el = document.getElementById(component.identifiers.id);
      if (el) {
        el.setAttribute(componentsConfig.elHighlightName, component.identifiers.id);
        elements.push(el);
      }
    }

    if (component.identifiers.className) {
      let classElements = document.getElementsByClassName(component.identifiers.className);
      classElements = Array.from(classElements);
      console.group('component', component)
      console.log('classElements after array.from', classElements)
      classElements.forEach(el => {
        if (el) {
          el.setAttribute(componentsConfig.elHighlightName, component.identifiers.className);
          elements.push(el);
        }
      });
      console.log('classElements after loop', classElements, 'elements', elements)
      console.groupEnd('component');
    }
  });
  console.groupEnd('componentsConfig')

  return elements;
}

/**
 * Applies or removes highlights on the webpage based on the current state.
 * @param {boolean} isEnabled - Flag indicating whether highlights should be enabled or disabled.
 * @param {Array} componentsConfig - Array of component configurations.
 * @returns null
 */
function applyHighlights(isEnabled, componentsConfig) {
  const elements = getHighlightableElements(componentsConfig)

  console.group('applyingHighlights')
  elements.forEach(el => {

    const matchedComponent = componentsConfig.find((component) => {
      const highlightVal = el.getAttribute(componentsConfig.elHighlightName);
      const { identifiers } = component;
      return highlightVal === identifiers?.className || highlightVal === identifiers?.id;
    });

    if (isEnabled) {
      highlightElement(el, matchedComponent, componentsConfig);
    } else {
      removeHighlight(el, matchedComponent, componentsConfig);
    }
  
  });
  console.groupEnd('applyingHighlights')
}

/**
 * Highlights a specific element by applying styles and appending documentation links.
 * @param {HTMLElement} el - The target DOM element to highlight.
 * @param {Object} component - The component configuration object.
 * @param {Array} componentsConfig - The stored componentsConfig array.
 */
function highlightElement(el, component, componentsConfig) {
  if(!component) {
    console.log('fix me later. I should not have been called like so', el, component)
    return;
  }
  console.log('Highlighted', component, el);
  el.style.border = component.borderHighlightStyle;
  el.style.position = 'relative';

  // Avoid duplicating link containers
  if (el.querySelector('.component-highlight-links')) return;

  // Create a container for links
  const linkContainer = document.createElement('div');
  linkContainer.className = 'component-highlight-links';
  linkContainer.style.position = 'absolute';
  linkContainer.style.top = '0';
  linkContainer.style.right = '0';
  linkContainer.style.background = 'rgba(255, 255, 255, 0.8)';
  linkContainer.style.padding = '2px';
  linkContainer.style.zIndex = '1000';
  linkContainer.style.fontSize = '12px';

  // Create content type link
  const contentLink = document.createElement('a');
  contentLink.href = component.contentTypeUrl;
  contentLink.target = '_blank';
  contentLink.textContent = 'Docs';
  contentLink.style.marginRight = '5px';
  contentLink.className = 'extension-component-highlight-reset-style';

  // Create UX docs link
  const uxLink = document.createElement('a');
  uxLink.href = component.uxDocsUrl;
  uxLink.target = '_blank';
  uxLink.textContent = 'UX Docs';
  uxLink.className = 'extension-component-highlight-reset-style';

  // Append links to container
  linkContainer.appendChild(contentLink);
  linkContainer.appendChild(uxLink);

  // Append container to the element
  el.appendChild(linkContainer);

  // Tag the element with a data attribute for future reference
  el.setAttribute(componentsConfig.elHighlightName, component.name);
}

/**
 * Removes highlighting and documentation links from a specific element.
 * @param {HTMLElement} el - The target DOM element to remove highlights from.
 * @param {Object} component - The component configuration object.
 * @param {Array} componentsConfig - The stored componentsConfig array.
 */
function removeHighlight(el, component, componentsConfig) {
  el.style.border = '';
  el.style.position = '';

  // Remove the link container if it exists
  const linkContainer = el.querySelector('.component-highlight-links');
  if (linkContainer) {
    el.removeChild(linkContainer);
  }

  // Remove the data attribute
  el.removeAttribute(componentsConfig.elHighlightName);
}

/**
 * Listener for messages from the background script to toggle highlights.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHighlight') {
    // Initialize settings
    initializeSettings()
      .then((settings) => {
        const newState = !settings.isHighlightEnabled; // Toggle the state
        settings.isHighlightEnabled = newState;

        // Save the updated settings back to localStorage
        return saveToLocalStorage(settings.storageKeyName, settings, `on toggleHighlight, new isHighlightEnabled: ${newState}`)
          .then(() => settings);
      })
      .then((updatedSettings) => {
        // Apply or remove highlights based on the new state
        const newEnabledSetting = !settings.isHighlightEnabled;
        console.log('Applying highlights based on initial settings:', newEnabledSetting);
        applyHighlights(updatedSettings.isHighlightEnabled, updatedSettings.componentsConfig);
        sendResponse({ status: 'success', isHighlightEnabled: updatedSettings.isHighlightEnabled });
      })
      .catch((error) => {
        console.error('Error toggling highlight:', error);
        sendResponse({ status: 'error', error });
      });

    // Indicate that the response will be sent asynchronously
    return true;
  }
});

/**
   * Automatically initialize settings and apply highlights on page load.
   * This ensures that highlights are applied based on the saved state when the page is first loaded.
   */
initializeSettings()
.then((settings) => {
  const newEnabledSetting = !settings.isHighlightEnabled;
  console.log('Applying highlights based on initial settings:', newEnabledSetting);
  applyHighlights(newEnabledSetting, settings.componentsConfig);
})
.catch((error) => {
  console.error('Error during initial settings initialization:', error);
});

// Inject the injectedScript.js into the webpage
injectScript('injectedScript.js');
// Inject the stylesheet into the webpage
injectStylesheet('styles.css');
