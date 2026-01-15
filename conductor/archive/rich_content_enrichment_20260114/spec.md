# Spec: Rich Content Enrichment

## Goal
Transform nodes from simple text containers into multimedia canvases. This allows users to visualize concepts with images, read code snippets clearly, and navigate to external resources easily.

## User Stories
- **Images:** As a user, I want to paste an image from my clipboard directly into a node so I can include diagrams or screenshots.
- **Code:** As a user, I want my code snippets to have syntax highlighting so they are easier to read.
- **Links:** As a user, I want URLs to be clickable so I can open references.

## Functional Requirements
- **Image Handling:**
    - Support pasting images into the markdown editor.
    - Support standard Markdown image syntax `![alt](url)`.
    - For pasted images, convert to Base64 (Data URI) or Blob URL for local display.
- **Code Highlighting:**
    - Render fenced code blocks (```js ...) with syntax highlighting.
- **Link Handling:**
    - Automatically convert URL strings in text to clickable anchors.

## Technical Requirements
- **Library:** `react-markdown` (already installed).
- **Library:** `rehype-highlight` or `react-syntax-highlighter` for code.
- **Library:** `rehype-raw` (optional) if we need HTML support, but standard CommonMark should suffice.
- **Storage:** Large images in Data URI format can bloat IndexedDB. Ideally, we should store them as Blobs in Dexie, but for this iteration, Base64 strings within the content string is the simplest "atomic" approach, despite the performance trade-off. We will accept this trade-off for simplicity in this track.
