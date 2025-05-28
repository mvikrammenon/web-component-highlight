import { ExtensionSettings, StorageMessage, StorageResponse } from '../types';

export class StorageManager {
  private static instance: StorageManager;
  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async saveToStorage<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const message: StorageMessage = {
          action: 'save',
          key,
          value
        };
        window.dispatchEvent(new CustomEvent('extensionMessage', { detail: message }));
        window.addEventListener('extensionResponse', ((event: CustomEvent<StorageResponse>) => {
          if (event.detail.status === 'success') {
            resolve();
          } else {
            reject(event.detail.error);
          }
        }) as EventListener, { once: true });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getFromStorage<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      try {
        const message: StorageMessage = {
          action: 'get',
          key
        };
        window.dispatchEvent(new CustomEvent('extensionMessage', { detail: message }));
        window.addEventListener('extensionResponse', ((event: CustomEvent<StorageResponse>) => {
          if (event.detail.data !== undefined) {
            resolve(event.detail.data as T);
          } else {
            resolve(null);
          }
        }) as EventListener, { once: true });
      } catch (error) {
        reject(error);
      }
    });
  }

  async initializeSettings(): Promise<ExtensionSettings> {
    const { defaultSettings } = await import('../config/defaultSettings');
    const storedSettings = await this.getFromStorage<ExtensionSettings>(defaultSettings.storageKeyName);

    if (storedSettings) {
      const mergedSettings: ExtensionSettings = {
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