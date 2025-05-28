// Handles storage operations in the webpage context
(function () {
    function dispatchResponse(response) {
        window.dispatchEvent(new CustomEvent('extensionResponse', { detail: response }));
    }
    function validateKey(key) {
        return typeof key === 'string' && key.length > 0;
    }
    // Listen for messages from the content script
    window.addEventListener('extensionMessage', function (event) {
        const { action, key, value } = event.detail;
        if (!validateKey(key)) {
            dispatchResponse({
                status: 'error',
                error: 'Invalid storage key provided'
            });
            return;
        }
        if (action === 'save') {
            try {
                if (value === undefined) {
                    throw new Error('No value provided for storage');
                }
                window.localStorage.setItem(key, JSON.stringify(value));
                dispatchResponse({ status: 'success' });
            }
            catch (error) {
                dispatchResponse({
                    status: 'error',
                    error: `Failed to save data: ${error.message}`
                });
            }
        }
        if (action === 'get') {
            try {
                const storedValue = window.localStorage.getItem(key);
                if (storedValue === null) {
                    dispatchResponse({ status: 'success', data: null });
                    return;
                }
                const data = JSON.parse(storedValue);
                dispatchResponse({ status: 'success', data });
            }
            catch (error) {
                dispatchResponse({
                    status: 'error',
                    error: `Failed to retrieve data: ${error.message}`
                });
            }
        }
    });
})();
export {};
