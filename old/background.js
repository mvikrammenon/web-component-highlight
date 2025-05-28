// Listen for clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  // Check if the URL is a chrome:// URL
  if (tab.url && tab.url.startsWith('chrome://')) {
    console.error('Cannot inject content script into chrome:// URLs');
    return;
  }
  
  // Inject the content script into the current tab
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js']
  }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Script injection failed: ${chrome.runtime.lastError.message}`);
    } else {
      // Send a message to toggle highlights
      chrome.tabs.sendMessage(tab.id, { action: 'toggleHighlight' });
    }
  });
});
