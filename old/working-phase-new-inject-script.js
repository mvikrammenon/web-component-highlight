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

// Inject the injectedScript.js into the webpage
injectScript('injectedScript.js');
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
function saveToLocalStorage(key, value) {
  return new Promise((resolve, reject) => {
    sendMessageToPage({ action: 'save', key, value });
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
          return saveToLocalStorage(defaultSettings.storageKeyName, mergedSettings)
            .then(() => resolve(mergedSettings));
        } else {
          // No settings found; save default settings
          debugger;
          console.log('defaultSettings.storageKeyName', defaultSettings)
          return saveToLocalStorage(defaultSettings.storageKeyName, defaultSettings)
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
 * Applies or removes highlights on the webpage based on the current state.
 * @param {boolean} isEnabled - Flag indicating whether highlights should be enabled or disabled.
 * @param {Array} componentsConfig - Array of component configurations.
 */
function applyHighlights(isEnabled, componentsConfig) {
  componentsConfig.forEach(component => {
    // Build the selector based on identifiers
    let selector = `div.${component.identifiers.className}`;
    if (component.identifiers.id) {
      selector += `#${component.identifiers.id}`;
    }

    const elements = document.querySelectorAll(selector);

    elements.forEach(el => {
      if (isEnabled) {
        highlightElement(el, component);
      } else {
        removeHighlight(el, component);
      }
    });
  });
}

/**
 * Highlights a specific element by applying styles and appending documentation links.
 * @param {HTMLElement} el - The target DOM element to highlight.
 * @param {Object} component - The component configuration object.
 */
function highlightElement(el, component) {
  el.style.border = component.borderHighlightStyle;
  el.style.position = 'relative';

  // Avoid duplicating link containers
  if (el.querySelector('.component-viz-links')) return;

  // Create a container for links
  const linkContainer = document.createElement('div');
  linkContainer.className = 'component-viz-links';
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
  contentLink.style.textDecoration = 'none';
  contentLink.style.color = 'black';

  // Create UX docs link
  const uxLink = document.createElement('a');
  uxLink.href = component.uxDocsUrl;
  uxLink.target = '_blank';
  uxLink.textContent = 'UX Docs';
  uxLink.style.textDecoration = 'none';
  uxLink.style.color = 'black';

  // Append links to container
  linkContainer.appendChild(contentLink);
  linkContainer.appendChild(uxLink);

  // Append container to the element
  el.appendChild(linkContainer);

  // Tag the element with a data attribute for future reference
  el.setAttribute(defaultSettings.elHighlightName, component.name);
}

/**
 * Removes highlighting and documentation links from a specific element.
 * @param {HTMLElement} el - The target DOM element to remove highlights from.
 * @param {Object} component - The component configuration object.
 */
function removeHighlight(el, component) {
  el.style.border = '';
  el.style.position = '';

  // Remove the link container if it exists
  const linkContainer = el.querySelector('.component-viz-links');
  if (linkContainer) {
    el.removeChild(linkContainer);
  }

  // Remove the data attribute
  el.removeAttribute(defaultSettings.elHighlightName);
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
        return saveToLocalStorage(settings.storageKeyName, settings)
          .then(() => settings);
      })
      .then((updatedSettings) => {
        // Apply or remove highlights based on the new state
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
  console.log('Applying highlights based on initial settings:', settings.isHighlightEnabled);
  applyHighlights(settings.isHighlightEnabled, settings.componentsConfig);
})
.catch((error) => {
  console.error('Error during initial settings initialization:', error);
});
