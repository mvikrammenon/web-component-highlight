// Handles storage operations in the webpage context

interface StorageMessage {
  action: 'save' | 'get';
  key: string;
  value?: unknown;
  from?: string;
}

export {}; // Make this a module
declare global {
  interface WindowEventMap {
    extensionMessage: CustomEvent<StorageMessage>;
    extensionResponse: CustomEvent<StorageResponse>;
  }
}

interface StorageResponse {
  status: 'success' | 'error';
  data?: unknown;
  error?: string;
}

(function() {
  function dispatchResponse(response: StorageResponse): void {
    window.dispatchEvent(new CustomEvent('extensionResponse', { detail: response }));
  }

  function validateKey(key: string): boolean {
    return typeof key === 'string' && key.length > 0;
  }

  // Listen for messages from the content script
  window.addEventListener('extensionMessage', function(event: CustomEvent<StorageMessage>) {
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
      } catch (error) {
        dispatchResponse({
          status: 'error',
          error: `Failed to save data: ${(error as Error).message}`
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
      } catch (error) {
        dispatchResponse({
          status: 'error',
          error: `Failed to retrieve data: ${(error as Error).message}`
        });
      }
    }
  } as EventListener);
})();