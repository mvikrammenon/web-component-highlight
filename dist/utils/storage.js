export class StorageManager {
    constructor() { }
    static getInstance() {
        if (!StorageManager.instance) {
            StorageManager.instance = new StorageManager();
        }
        return StorageManager.instance;
    }
    async saveToStorage(key, value) {
        return new Promise((resolve, reject) => {
            try {
                const message = {
                    action: 'save',
                    key,
                    value
                };
                window.dispatchEvent(new CustomEvent('extensionMessage', { detail: message }));
                window.addEventListener('extensionResponse', ((event) => {
                    if (event.detail.status === 'success') {
                        resolve();
                    }
                    else {
                        reject(event.detail.error);
                    }
                }), { once: true });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async getFromStorage(key) {
        return new Promise((resolve, reject) => {
            try {
                const message = {
                    action: 'get',
                    key
                };
                window.dispatchEvent(new CustomEvent('extensionMessage', { detail: message }));
                window.addEventListener('extensionResponse', ((event) => {
                    if (event.detail.data !== undefined) {
                        resolve(event.detail.data);
                    }
                    else {
                        resolve(null);
                    }
                }), { once: true });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async initializeSettings() {
        const { defaultSettings } = await import('../config/defaultSettings');
        const storedSettings = await this.getFromStorage(defaultSettings.storageKeyName);
        if (storedSettings) {
            const mergedSettings = {
                ...defaultSettings,
                ...storedSettings,
                componentsConfig: [
                    ...defaultSettings.componentsConfig,
                    ...storedSettings.componentsConfig
                ]
            };
            await this.saveToStorage(defaultSettings.storageKeyName, mergedSettings);
            return mergedSettings;
        }
        await this.saveToStorage(defaultSettings.storageKeyName, defaultSettings);
        return defaultSettings;
    }
}
