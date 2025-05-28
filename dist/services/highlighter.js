export class ComponentHighlighter {
    constructor() { }
    static getInstance() {
        if (!ComponentHighlighter.instance) {
            ComponentHighlighter.instance = new ComponentHighlighter();
        }
        return ComponentHighlighter.instance;
    }
    createHighlightElement(component) {
        const highlightEl = document.createElement('div');
        highlightEl.style.position = 'absolute';
        highlightEl.style.border = component.borderHighlightStyle;
        highlightEl.style.pointerEvents = 'none';
        highlightEl.style.zIndex = '10000';
        highlightEl.setAttribute('data-component-name', component.name);
        highlightEl.setAttribute('title', `${component.name}\nContent Type: ${component.contentTypeUrl}\nUX Docs: ${component.uxDocsUrl}`);
        // data-target-selector will be set in highlightComponent
        return highlightEl;
    }
    positionHighlight(highlightEl, targetEl) {
        const rect = targetEl.getBoundingClientRect();
        highlightEl.style.top = `${rect.top + window.scrollY}px`;
        highlightEl.style.left = `${rect.left + window.scrollX}px`;
        highlightEl.style.width = `${rect.width}px`;
        highlightEl.style.height = `${rect.height}px`;
    }
    highlightComponent(element, component, selector) {
        const highlightEl = this.createHighlightElement(component);
        // Store the selector used to find the target element
        highlightEl.setAttribute('data-target-selector', selector);
        // Create a unique ID for precise removal and updates
        const uniqueId = component.name + selector;
        highlightEl.setAttribute('data-highlight-id', uniqueId);
        this.positionHighlight(highlightEl, element);
        document.body.appendChild(highlightEl);
        // Add click event to open documentation
        highlightEl.addEventListener('click', () => {
            window.open(component.contentTypeUrl, '_blank');
        });
    }
    removeHighlight(element, component, selector) {
        const uniqueId = component.name + selector;
        // Use CSS.escape for special characters in attribute value query
        const highlightEl = document.querySelector(`div[data-highlight-id="${CSS.escape(uniqueId)}"]`);
        if (highlightEl) {
            highlightEl.remove();
        }
    }
    toggleHighlights(settings) {
        settings.componentsConfig.forEach(component => {
            let selector = '';
            if (component.identifiers.dataTestId) {
                selector = `[data-test-id="${component.identifiers.dataTestId}"]`;
            }
            else if (component.identifiers.id) {
                selector = `#${component.identifiers.id}`;
            }
            else if (component.identifiers.className) {
                selector = `.${component.identifiers.className}`;
            }
            else {
                // Skip if no valid identifiers are provided
                return;
            }
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (settings.isHighlightEnabled) {
                    this.highlightComponent(el, component, selector);
                }
                else {
                    this.removeHighlight(el, component, selector);
                }
            });
        });
    }
    updateHighlightPositions() {
        const highlightElements = document.querySelectorAll('div[data-highlight-id]');
        highlightElements.forEach(highlightEl => {
            const selector = highlightEl.getAttribute('data-target-selector');
            if (selector) {
                const targetEl = document.querySelector(selector);
                if (targetEl) {
                    this.positionHighlight(highlightEl, targetEl);
                }
                else {
                    // If target element is no longer found, remove the highlight
                    highlightEl.remove();
                }
            }
        });
    }
}
