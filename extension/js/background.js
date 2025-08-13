/**
 * Handles extension icon clicks by injecting content script and toggling highlights
 * Validates the tab URL to prevent injection into restricted chrome:// pages
 * @param {chrome.tabs.Tab} tab - The active tab object containing tab information
 * @param {number} tab.id - The unique identifier for the tab
 * @param {string} tab.url - The URL of the current tab
 */
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  // Check if the URL is a chrome:// URL
  if (tab.url && tab.url.startsWith('chrome://')) {
    console.error('Cannot inject content script into chrome:// URLs');
    return;
  }

  // Inject the content script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['js/contentScript.js']
  })
  .then(() => {
    // Send a message to toggle highlights
    chrome.tabs.sendMessage(tab.id, {
      action: 'toggleHighlight' 
    });
  })
  .catch((error) => {
    console.error(`Script injection failed: ${error.message}`);
  });
});
