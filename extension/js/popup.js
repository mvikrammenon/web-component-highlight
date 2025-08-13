/**
 * Popup script for Component Highlighter extension setup
 * Handles domain configuration through the extension popup interface
 */

// Default domain values
const DEFAULT_DOMAINS = {
    contentful: 'https://app.contentful.com',
    storybook: 'https://your-storybook.netlify.app'
};

/**
 * Initialize the popup when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    await loadExistingSettings();
    setupEventListeners();
});

/**
 * Load existing settings and populate the form
 */
async function loadExistingSettings() {
    try {
        const result = await chrome.storage.local.get('component-highlight-settings');
        const settings = result['component-highlight-settings'];
        
        if (settings && settings.domains) {
            // Populate form with current values
            document.getElementById('contentfulDomain').value = settings.domains.contentfulDomain || DEFAULT_DOMAINS.contentful;
            document.getElementById('storybookDomain').value = settings.domains.storybookDomain || DEFAULT_DOMAINS.storybook;
        } else {
            // First time setup - use defaults
            document.getElementById('contentfulDomain').value = DEFAULT_DOMAINS.contentful;
            document.getElementById('storybookDomain').value = DEFAULT_DOMAINS.storybook;
        }
        
        // Update toggle button text based on current highlight state
        updateToggleButtonText(settings);
        
    } catch (error) {
        console.error('Error loading settings:', error);
        showStatus('Error loading existing settings', 'error');
    }
}



/**
 * Setup event listeners for form interactions
 */
function setupEventListeners() {
    const form = document.getElementById('setupForm');
    const saveBtn = document.getElementById('saveBtn');
    const toggleBtn = document.getElementById('toggleBtn');
    
    // Form submission
    form.addEventListener('submit', handleSave);
    
    // Toggle highlights button
    toggleBtn.addEventListener('click', handleToggleHighlights);
    
    // Real-time validation
    document.getElementById('contentfulDomain').addEventListener('input', validateContentfulDomain);
    document.getElementById('storybookDomain').addEventListener('input', validateStorybookDomain);
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleSave(event) {
    event.preventDefault();
    
    const contentfulDomain = document.getElementById('contentfulDomain').value.trim();
    const storybookDomain = document.getElementById('storybookDomain').value.trim();
    
    // Validate inputs
    const isContentfulValid = validateContentfulDomain();
    const isStorybookValid = validateStorybookDomain();
    
    if (!isContentfulValid || !isStorybookValid) {
        showStatus('Please fix the validation errors above', 'error');
        return;
    }
    
    try {
        // Disable save button during processing
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        // Save to storage
        await saveDomainConfiguration({
            contentful: contentfulDomain,
            storybook: storybookDomain
        });
        
        showStatus('Configuration saved successfully!', 'success');
        
        // Close popup after a short delay
        setTimeout(() => {
            window.close();
        }, 1500);
        
    } catch (error) {
        console.error('Error saving configuration:', error);
        showStatus('Error saving configuration. Please try again.', 'error');
    } finally {
        // Re-enable save button
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    }
}

/**
 * Update toggle button text based on current highlight state
 * @param {Object} settings - Current extension settings
 */
function updateToggleButtonText(settings) {
    const toggleBtn = document.getElementById('toggleBtn');
    if (settings && settings.isHighlightEnabled) {
        toggleBtn.textContent = 'Hide';
        toggleBtn.title = 'Hide component highlights';
    } else {
        toggleBtn.textContent = 'Show';
        toggleBtn.title = 'Show component highlights';
    }
}

/**
 * Handle toggle highlights button click
 */
async function handleToggleHighlights() {
    try {
        const toggleBtn = document.getElementById('toggleBtn');
        const originalText = toggleBtn.textContent;
        toggleBtn.disabled = true;
        toggleBtn.textContent = 'Toggling...';
        
        // Send toggle message to background script
        await chrome.runtime.sendMessage({ type: 'TOGGLE_HIGHLIGHTS' });
        
        // Update button text to reflect new state
        const newText = originalText === 'Show' ? 'Hide' : 'Show';
        toggleBtn.textContent = newText;
        toggleBtn.title = newText === 'Show' ? 'Show component highlights' : 'Hide component highlights';
        
        showStatus(`Highlights ${newText === 'Hide' ? 'enabled' : 'disabled'} successfully!`, 'success');
        
        // Close popup after a short delay
        setTimeout(() => {
            window.close();
        }, 1000);
        
    } catch (error) {
        console.error('Error toggling highlights:', error);
        showStatus('Error toggling highlights. Please try again.', 'error');
        
        // Restore original button state
        const toggleBtn = document.getElementById('toggleBtn');
        toggleBtn.textContent = toggleBtn.textContent === 'Show' ? 'Show' : 'Hide';
    } finally {
        const toggleBtn = document.getElementById('toggleBtn');
        toggleBtn.disabled = false;
    }
}

/**
 * Save domain configuration to storage
 * @param {Object} domains - Domain configuration object
 */
async function saveDomainConfiguration(domains) {
    // Get existing settings or create new ones
    const result = await chrome.storage.local.get('component-highlight-settings');
    const settings = result['component-highlight-settings'] || {};
    
    // Update domains and mark setup as completed
    settings.domains = {
        contentfulDomain: domains.contentful,
        storybookDomain: domains.storybook,
        setupCompleted: true
    };
    
    // Save to storage
    await chrome.storage.local.set({
        'component-highlight-settings': settings
    });
    
    // Notify content scripts about the update
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'DOMAINS_UPDATED',
                domains: domains
            });
        }
    } catch (error) {
        // Ignore errors if content script is not available
        console.log('Content script not available for notification');
    }
}

/**
 * Validate Contentful domain input
 * @returns {boolean} - True if valid, false otherwise
 */
function validateContentfulDomain() {
    const input = document.getElementById('contentfulDomain');
    const error = document.getElementById('contentfulError');
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(error, 'Contentful domain is required');
        return false;
    }
    
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:') {
            showFieldError(error, 'Domain must use HTTPS');
            return false;
        }
    } catch (e) {
        showFieldError(error, 'Please enter a valid URL');
        return false;
    }
    
    hideFieldError(error);
    return true;
}

/**
 * Validate Storybook domain input
 * @returns {boolean} - True if valid, false otherwise
 */
function validateStorybookDomain() {
    const input = document.getElementById('storybookDomain');
    const error = document.getElementById('storybookError');
    const value = input.value.trim();
    
    if (!value) {
        showFieldError(error, 'Storybook domain is required');
        return false;
    }
    
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:') {
            showFieldError(error, 'Domain must use HTTPS');
            return false;
        }
    } catch (e) {
        showFieldError(error, 'Please enter a valid URL');
        return false;
    }
    
    hideFieldError(error);
    return true;
}

/**
 * Show field-specific error message
 * @param {HTMLElement} errorElement - Error display element
 * @param {string} message - Error message
 */
function showFieldError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Hide field-specific error message
 * @param {HTMLElement} errorElement - Error display element
 */
function hideFieldError(errorElement) {
    errorElement.style.display = 'none';
}

/**
 * Show status message
 * @param {string} message - Status message
 * @param {string} type - Status type ('success' or 'error')
 */
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    // Auto-hide after 3 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}