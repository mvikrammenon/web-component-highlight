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

function getSettings() {
  let localStorageSettings;
  let defaultSettings = getDefaultSettings();
  try {
    localStorageSettings = localStorage.getItem(defaultSettings.name);
    try {
      localStorageSettings = JSON.parse(localStorageSettings);
    } catch (error) {
      console.error("Setting parse error", error);
    }
  } catch (error) {
    console.error("Get settings failed", error);
  }

  if (!localStorageSettings) {
    let stringified;
    try {
      stringified = JSON.stringify(defaultSettings);
      console.log("stringifiedObj", stringified);
    } catch (error) {
      console.error("Unable to stringify settings", error);
    }
    localStorage.setItem(defaultSettings.name, stringified);
  }

  return localStorageSettings || defaultSettings;
}

// Save a JSON object to Chrome storage (local)
function saveToStorage(key, jsonObject) {
  try {
    const jsonString = JSON.stringify(jsonObject); // Convert JSON object to string
    const storageObject = {};
    storageObject[key] = jsonString;

    chrome.storage.local.set(storageObject, () => {
      if (chrome.runtime.lastError) {
        console.error('Error saving to storage:', chrome.runtime.lastError);
      } else {
        console.log('JSON object saved to Chrome storage');
      }
    });
  } catch (error) {
    console.error('Error stringifying JSON object:', error);
  }
}

// Get a JSON object from Chrome storage (local)
function getFromStorage(key, callback) {
  chrome.storage.local.get([key], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving from storage:', chrome.runtime.lastError);
    } else {
      try {
        const jsonString = result[key];
        if (jsonString) {
          const jsonObject = JSON.parse(jsonString); // Parse JSON string to object
          callback(jsonObject); // Return the parsed JSON object via callback
        } else {
          callback(null); // No data found, return null
        }
      } catch (error) {
        console.error('Error parsing JSON from storage:', error);
        callback(null); // Return null in case of error
      }
    }
  });
}

// Update a specific key within the stored JSON object
function updateKeyInStorage(storageKey, updateKey, updateValue, callback) {
  // First, retrieve the existing object
  getFromStorage(storageKey, (jsonObject) => {
    if (jsonObject) {
      // Update the specific key in the object
      jsonObject[updateKey] = updateValue;

      // Save the updated object back to storage
      saveToStorage(storageKey, jsonObject);

      // Optional: Call the callback after the update if provided
      if (callback) {
        callback(jsonObject);
      }
    } else {
      console.error(`No object found in storage for key: ${storageKey}`);
      if (callback) {
        callback(null);
      }
    }
  });
}


// Function to initialize settings by appending to existing settings in Chrome storage
function initializeSettings() {
  const basicSettings = getDefaultSettings();
  let mergedSettings;

  // First, retrieve the existing settings from storage
  getFromStorage(basicSettings.name, (storedSettings) => {
    if (storedSettings) {
      // Merge the existing settings with the new ones, appending new components
      mergedSettings = {
        ...storedSettings,
        componentsConfig: [...storedSettings.componentsConfig, ...basicSettings.componentsConfig]
      };

      // Save the merged settings back to storage
      saveToStorage(basicSettings.name, mergedSettings);
      console.log('Settings initialized with appending new components.');
    } else {
      // If no existing settings, simply save the basic settings
      saveToStorage(basicSettings.name, basicSettings);
      console.log('No existing settings, initialized with basic settings.');
      mergedSettings = basicSettings;
    }
  });
  return mergedSettings;
}



// may be address async local storaging?
function updateSettings(key, val) {
  let settings = getSettings();
  settings[key] = val;
  let stringified;
  try {
    stringified = JSON.stringify(settings);
    console.log("updated stringified", settings);
  } catch (error) {
    console.error("Unable to stringify updated settings", error);
  }
  localStorage.setItem(settings.name, stringified);
  return settings;
}

function highlightElement( el, component = {
  name: "SomeComponentName",
  contentTypeUrl: "https://docs.example.com/FooterComponent",
  uxDocsUrl: "https://zeroheight.com/",
  identifiers: {
    className: "some-class",
    id: "",
  },
  borderHighlightStyle: "1px dotted red",
}) {
  const divAttr = "data-component-highlight";
  const existingDiv = element.querySelector(`div[${divAttr}]`);

  // If the div exists, remove it
  if (existingDiv) {
    element.removeChild(existingDiv);
  }

  const divElement = document.createElement("div");
  divElement.setAttribute(divAttr, component.name);

  // Apply basic styles to the div (positioning, background color, etc.)
  divElement.style.position = "absolute";
  divElement.style.top = "0";
  divElement.style.right = "0";
  divElement.style.backgroundColor = "#ffcc00";
  divElement.style.padding = "2px";
  divElement.style.zIndex = "1000";
  divElement.style.fontSize = "12px";
  divElement.style.color = "black";

  // Create the first link for the component name
  const contentfulLink = document.createElement("a");
  contentfulLink.textContent = component.name;
  contentfulLink.href = component.contentTypeUrl;
  contentfulLink.style.marginRight = "10px"; // Add some space between the links
  contentfulLink.style.color = "black";
  contentfulLink.style.textDecoration = "none";

  // Create the documentation link
  const docsLink = document.createElement("a");
  docsLink.textContent = "Docs";
  docsLink.href = component.uxDocsUrl;
  docsLink.style.color = "black";
  docsLink.style.textDecoration = "none";

  // Append the links to the div
  divElement.appendChild(contentfulLink);
  divElement.appendChild(docsLink);

  // Highlight the section border
  el.style.border = component.borderHighlightStyle; // may be add color to mapper object for config
  el.style.position = "relative";
  el.appendChild(linkElement);
}

function getHighlightableElements(componentsConfig = []) {
  const elements = [];
  // could use a reduce function?
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
        el.setAttribute(componentsConfig.elHighlightName, component.identifiers.className);
        if (el) {
          el.setAttribute(componentsConfig.elHighlightName, component.identifiers.id);
          elements.push(el);
        }

      });
      console.log('classElements after loop', classElements, 'elements', elements)
      elements.push(el);
      console.log('elements after concat', elements)
      console.groupEnd();
    }
  });

  return elements;
}
function applyMapping(settings) {
  // Retrieve current settings from storage first
  getFromStorage(settings.storageKeyName, (storedSettings) => {
    // If no stored settings, fallback to passed settings
    const currentSettings = storedSettings || settings;

    // Check if highlighting is enabled in settings
    if (currentSettings?.isHighlightEnabled) {
      console.log("Highlighting is enabled.");

      // Retrieve highlightable elements using the componentsConfig
      const elements = getHighlightableElements(currentSettings.componentsConfig);
      console.log("HighlightableElements", elements);

      elements.forEach((el) => {
        // Find the component config that matches the element's attributes
        const highlightElementInfo = currentSettings.componentsConfig.find((component) => {
          const highlightVal = el.getAttribute(currentSettings.elHighlightName);
          const { identifiers } = component;
          return highlightVal === identifiers?.className || highlightVal === identifiers?.id;
        });

        // If a matching component is found, highlight the element
        if (highlightElementInfo) {
          highlightElement(el, highlightElementInfo);
        }
      });
    } else {
      console.log("Highlighting is disabled.");
    }

    // Toggle isHighlightEnabled setting in storage when necessary
    currentSettings.isHighlightEnabled = !currentSettings.isHighlightEnabled;
    
    // Save updated settings back to storage
    saveToStorage(currentSettings.storageKeyName, currentSettings);
    console.log(`Updated highlight state to: ${currentSettings.isHighlightEnabled}`);
  });
}


initializeSettings().then((settings) => {
  applyMapping(settings);  // Apply the mapping after initializing or retrieving settings
});


