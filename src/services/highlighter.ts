import { ComponentConfig, ExtensionSettings } from '../types';

export class ComponentHighlighter {
  private static instance: ComponentHighlighter;
  private constructor() {}

  static getInstance(): ComponentHighlighter {
    if (!ComponentHighlighter.instance) {
      ComponentHighlighter.instance = new ComponentHighlighter();
    }
    return ComponentHighlighter.instance;
  }

  private createHighlightElement(component: ComponentConfig): HTMLElement {
    const highlightEl = document.createElement('div');
    highlightEl.style.position = 'absolute';
    highlightEl.style.border = component.borderHighlightStyle;
    highlightEl.style.pointerEvents = 'none';
    highlightEl.style.zIndex = '10000';
    highlightEl.setAttribute('data-component-name', component.name);
    highlightEl.setAttribute('title', `${component.name}\nContent Type: ${component.contentTypeUrl}\nUX Docs: ${component.uxDocsUrl}`);
    return highlightEl;
  }

  private positionHighlight(highlightEl: HTMLElement, targetEl: Element): void {
    const rect = targetEl.getBoundingClientRect();
    highlightEl.style.top = `${rect.top + window.scrollY}px`;
    highlightEl.style.left = `${rect.left + window.scrollX}px`;
    highlightEl.style.width = `${rect.width}px`;
    highlightEl.style.height = `${rect.height}px`;
  }

  private highlightComponent(element: Element, component: ComponentConfig): void {
    const highlightEl = this.createHighlightElement(component);
    this.positionHighlight(highlightEl, element);
    document.body.appendChild(highlightEl);

    // Add click event to open documentation
    highlightEl.addEventListener('click', () => {
      window.open(component.contentTypeUrl, '_blank');
    });
  }

  private removeHighlight(element: Element): void {
    const highlightElements = document.querySelectorAll(`[data-component-name]`);
    highlightElements.forEach(el => el.remove());
  }

  public toggleHighlights(settings: ExtensionSettings): void {
    settings.componentsConfig.forEach(component => {
      const selector = component.identifiers.id
        ? `#${component.identifiers.id}`
        : `.${component.identifiers.className}`;

      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (settings.isHighlightEnabled) {
          this.highlightComponent(el, component);
        } else {
          this.removeHighlight(el);
        }
      });
    });
  }

  public updateHighlightPositions(): void {
    const highlightElements = document.querySelectorAll('[data-component-name]');
    highlightElements.forEach(highlightEl => {
      const componentName = highlightEl.getAttribute('data-component-name');
      const targetEl = document.querySelector(`[data-component="${componentName}"]`);
      if (targetEl) {
        this.positionHighlight(highlightEl as HTMLElement, targetEl);
      }
    });
  }
}