import { ComponentHighlighter } from './services/highlighter';
import { StorageManager } from './utils/storage';
import { ExtensionSettings, HighlightMessage } from './types';

class ContentScript {
  private highlighter: ComponentHighlighter;
  private storageManager: StorageManager;
  private settings: ExtensionSettings | null = null;

  constructor() {
    this.highlighter = ComponentHighlighter.getInstance();
    this.storageManager = StorageManager.getInstance();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize settings
      this.settings = await this.storageManager.initializeSettings();

      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

      // Listen for scroll and resize events to update highlight positions
      window.addEventListener('scroll', this.handleScroll.bind(this));
      window.addEventListener('resize', this.handleResize.bind(this));

      console.log('Content script initialized successfully');
    } catch (error) {
      console.error('Failed to initialize content script:', error);
    }
  }

  private handleMessage(message: HighlightMessage): void {
    if (!this.settings) return;

    if (message.action === 'toggleHighlight') {
      this.settings.isHighlightEnabled = !this.settings.isHighlightEnabled;
      this.storageManager.saveToStorage(this.settings.storageKeyName, this.settings)
        .then(() => {
          this.highlighter.toggleHighlights(this.settings!);
        })
        .catch((error) => {
          console.error('Failed to save settings:', error);
        });
    }
  }

  private handleScroll(): void {
    if (this.settings?.isHighlightEnabled) {
      this.highlighter.updateHighlightPositions();
    }
  }

  private handleResize(): void {
    if (this.settings?.isHighlightEnabled) {
      this.highlighter.updateHighlightPositions();
    }
  }
}

// Initialize the content script
new ContentScript();