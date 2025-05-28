// injectedScript.js

(function() {
  // Listen for messages from the content script
  // window.removeEventListener('extensionMessage');
  window.addEventListener('extensionMessage', (event) => {
    const { action, key, value } = event.detail;

    if (action === 'save') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('extensionResponse', { detail: { status: 'success' } }));
      } catch (error) {
        window.dispatchEvent(new CustomEvent('extensionResponse', { detail: { status: 'error', error: error.message } }));
      }
    }

    if (action === 'get') {
      try {
        const data = JSON.parse(window.localStorage.getItem(key));
        window.dispatchEvent(new CustomEvent('extensionResponse', { detail: { data } }));
      } catch (error) {
        window.dispatchEvent(new CustomEvent('extensionResponse', { detail: { data: null, error: error.message } }));
      }
    }
  });
})();
