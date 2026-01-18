# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-01-18

### Added
- **Google Sheets Sync**: Two-way synchronization with Google Sheets.
    - Connect with Google OAuth.
    - Import new thoughts from a spreadsheet.
    - Export existing thoughts to a spreadsheet.
    - Auto-link Google Assistant notes via Sheets.

## [1.0.0] - 2026-01-16

### Added
- **Infinite Canvas**: Interactive spatial canvas for organizing thoughts using React Flow.
- **Thought Nodes**: Custom nodes with support for:
    - Markdown rendering.
    - Image pasting (auto-converted to Base64).
    - Code syntax highlighting.
    - Double-click to edit.
- **AI Partner**: Contextual AI assistant that:
    - Explains connections between two thoughts.
    - Synthesizes summaries for clusters of 3+ thoughts.
    - Suggests expansions for individual thoughts.
- **RAG-powered Chat**: "Ask your Graph" feature using local vector embeddings (Ollama) to answer questions based on your stored thoughts.
- **Data Portability**: 
    - Export/Import as JSON.
    - Export as a ZIP of Markdown files.
- **Auto Layout**: Automatic organization of nodes using D3-force layout.
- **Semantic Search**: Instant search through thoughts using vector similarity.
- **Persistence**: Local storage of data using Dexie.js (IndexedDB).

### Fixed
- Multi-selection logic with custom nodes (Cmd/Ctrl/Shift + Click).
- AI model connection issues with local Ollama instances.
- Build errors related to event propagation in custom nodes.

### Visuals
- Premium design with blue selection feedback, smooth transitions, and a clean minimalist UI.
