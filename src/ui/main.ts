import { ComponentHighlighter } from '../services/highlighter';
// Attempt to import types from the existing types/index.ts
// This path might need adjustment based on TS/Vite module resolution.
import { ExtensionSettings, ComponentConfig } from '../types/index';

console.log('Standalone UI Main.ts loaded.');

const mockComponentsConfig: ComponentConfig[] = [
  {
    name: 'Mock Component 1',
    identifiers: { id: 'component1' },
    contentTypeUrl: 'http://example.com/docs/component1',
    uxDocsUrl: 'http://example.com/ux/component1',
    borderHighlightStyle: '3px dashed red',
  },
  {
    name: 'Mock Component 2',
    identifiers: { className: 'component2' },
    contentTypeUrl: 'http://example.com/docs/component2',
    uxDocsUrl: 'http://example.com/ux/component2',
    borderHighlightStyle: '3px dotted orange',
  },
];

// Try to get default settings structure by importing them
// This assumes defaultSettings.ts exports its content in a way we can use.
// If not, we might need to replicate the structure or simplify.
// For now, creating a structure that matches ExtensionSettings.
const mockSettings: ExtensionSettings = {
  storageKeyName: 'mockExtensionSettings',
  isHighlightEnabled: false, // Start with highlights off
  componentsConfig: mockComponentsConfig,
  interactionSettings: { // Default values
    highlightOnHover: false,
    showTooltipOnHover: true,
    openDocsOnClick: true,
  },
  loggingSettings: { // Default values
    logLevel: 'info',
  },
  featureFlags: {}, // Default values
};

const highlighter = ComponentHighlighter.getInstance();

function toggleUIHighlights() {
  mockSettings.isHighlightEnabled = !mockSettings.isHighlightEnabled;
  console.log(`Toggling highlights to: ${mockSettings.isHighlightEnabled}`);
  highlighter.toggleHighlights(mockSettings);
  const button = document.getElementById('toggleButton');
  if (button) {
    button.textContent = mockSettings.isHighlightEnabled ? 'Hide Highlights' : 'Show Highlights';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully parsed.');
  const toggleButton = document.getElementById('toggleButton');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleUIHighlights);
  } else {
    console.error('Toggle button not found in HTML.');
  }

  // Ensure mock elements exist (they are defined statically in the HTML for this version)
  if (!document.getElementById('component1') || !document.querySelector('.component2')) {
    console.error('Mock components not found in HTML.');
  }

  // Add scroll and resize listeners to test highlight position updates
  window.addEventListener('scroll', () => {
    if (mockSettings.isHighlightEnabled) {
      highlighter.updateHighlightPositions();
    }
  });
  window.addEventListener('resize', () => {
    if (mockSettings.isHighlightEnabled) {
      highlighter.updateHighlightPositions();
    }
  });
});

console.log('Mock settings prepared:', mockSettings);
