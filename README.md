# UI Component Highlighter

This is a Chrome extension that highlights UI components on a webpage and provides links to their documentation. It is designed to help developers and designers quickly identify the components used in a web application and access their documentation.

## Installation

To build the extension from the source, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ui-component-highlighter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the extension:**
    ```bash
    npm run build
    ```
    This will compile the TypeScript files and create a `dist` directory with the packaged extension.

## Running the Extension

To run the extension in Google Chrome, you need to load it as an unpacked extension:

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** by clicking the toggle switch at the top right of the page.
3.  Click the **Load unpacked** button.
4.  Select the `dist` directory from the project's folder.

The extension's icon should now appear in the Chrome toolbar.

## Running Tests

To run the test suite, use the following command:

```bash
npm test
```

This will execute the tests using Jest.

## High-Level Implementation Design

The extension follows a standard architecture for a Manifest V3 Chrome extension and is written in TypeScript.

*   **`manifest.json`**: This is the entry point of the extension. It defines the extension's name, version, permissions, and the scripts to be used.
*   **`background.ts`**: This script runs as a service worker and listens for events, such as a click on the extension's icon in the toolbar. When the icon is clicked, it injects the content script into the active tab.
*   **`contentScript.ts`**: This script is injected into the web page and acts as a bridge between the extension and the page. It listens for messages from the background script and manages the highlighter. It also listens for page events like `scroll` and `resize` to update the position of the highlights.
*   **`services/highlighter.ts`**: This is the core component of the extension. It is responsible for creating, displaying, and removing the highlights on the web page. It identifies the components to be highlighted based on a configuration and overlays a `div` element on top of them.
*   **Configuration**: The extension's settings, including the list of components to highlight, are managed through `config/defaultSettings.ts` and `utils/storage.ts`. This allows the configuration to be stored and retrieved from Chrome's storage.
*   **Build Process**: The project uses TypeScript for development. The `npm run build` command compiles the TypeScript files into JavaScript and copies all the necessary assets (manifest, icons, styles) into the `dist` directory, which is then loaded into Chrome.
