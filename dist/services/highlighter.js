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
        return highlightEl;
    }
    positionHighlight(highlightEl, targetEl) {
        const rect = targetEl.getBoundingClientRect();
        highlightEl.style.top = `${rect.top + window.scrollY}px`;
        highlightEl.style.left = `${rect.left + window.scrollX}px`;
        highlightEl.style.width = `${rect.width}px`;
        highlightEl.style.height = `${rect.height}px`;
    }
    highlightComponent(element, component) {
        const highlightEl = this.createHighlightElement(component);
        this.positionHighlight(highlightEl, element);
        document.body.appendChild(highlightEl);
        // Add click event to open documentation
        highlightEl.addEventListener('click', () => {
            window.open(component.contentTypeUrl, '_blank');
        });
    }
    removeHighlight(element) {
        const highlightElements = document.querySelectorAll(`[data-component-name]`);
        highlightElements.forEach(el => el.remove());
    }
    toggleHighlights(settings) {
        settings.componentsConfig.forEach(component => {
            const selector = component.identifiers.id
                ? `#${component.identifiers.id}`
                : `.${component.identifiers.className}`;
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (settings.isHighlightEnabled) {
                    this.highlightComponent(el, component);
                }
                else {
                    this.removeHighlight(el);
                }
            });
        });
    }
    updateHighlightPositions() {
        const highlightElements = document.querySelectorAll('[data-component-name]');
        highlightElements.forEach(highlightEl => {
            const componentName = highlightEl.getAttribute('data-component-name');
            const targetEl = document.querySelector(`[data-component="${componentName}"]`);
            if (targetEl) {
                this.positionHighlight(highlightEl, targetEl);
            }
        });
    }
}
