chrome.action.onClicked.addListener((tab) => {
    if (!tab.id)
        return;
    // Inject the content script into the current tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js']
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
export {};
