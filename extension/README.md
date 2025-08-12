# UI Component Highlighter (Simplified)

This is a Chrome extension that highlights UI components on a webpage and provides links to their documentation. This is a simplified version of the extension that uses plain JavaScript and does not require a build step.

## How to Install

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Load the extension in Chrome:**
    - Open Google Chrome and navigate to `chrome://extensions`.
    - Enable **Developer mode** by clicking the toggle switch at the top right of the page.
    - Click the **Load unpacked** button.
    - Select the `extension` directory from the project's folder.

The extension's icon should now appear in the Chrome toolbar.

## File Structure

The `extension` directory contains all the files for the extension:

-   `manifest.json`: The extension's manifest file.
-   `icon.png`: The icon for the extension.
-   `styles.css`: The stylesheet for the highlights.
-   `js/`: This directory contains the JavaScript files.
    -   `background.js`: The background script, which handles the extension's icon click.
    -   `defaultSettings.js`: Contains the default configuration for the components to be highlighted.
    -   `contentScript.js`: The main script that is injected into web pages to highlight components.
