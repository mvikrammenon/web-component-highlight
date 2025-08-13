/**
 * Background script for Component Highlighter extension
 * The extension now uses a popup interface instead of direct icon clicks
 * Content scripts are automatically injected via manifest.json
 */

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_HIGHLIGHTS') {
    // Forward toggle message to active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && !tabs[0].url.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      }
    });
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Component Highlighter extension installed');
  }
});
