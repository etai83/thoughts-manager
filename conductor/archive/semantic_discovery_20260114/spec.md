# Spec: Semantic Discovery & AI Integration

## Goal
Transform ThoughtsManager from a passive mapping tool into an active thought partner by integrating local AI capabilities. This track focuses on semantic understanding of the user's graph to enable "fuzzy" search and proactive connection suggestions.

## User Stories
- **Semantic Search:** As a user, I want to search for "productivity" and find nodes about "time blocking" or "Getting Things Done" even if they don't contain the exact word.
- **Connection Suggestions:** As a user, I want the system to suggest potential links between nodes that are conceptually related but currently unconnected.
- **Local Privacy:** As a user, I want all AI processing to happen locally on my machine so my private thoughts remain private.

## Functional Requirements
- **Vector Database:** Integrate a client-side vector store (Orama or Voy) to index node content.
- **Embeddings Generation:** Use a local embedding model (via Ollama or Transformers.js) to generate vector embeddings for all nodes.
- **Semantic Search UI:** A search bar that ranks results by semantic similarity score.
- **Similar Node Detection:** A background process or UI element that highlights "Related Thoughts" based on vector proximity.
- **Ollama Integration:** Configurable endpoint to connect to a local Ollama instance (default: `http://localhost:11434`).

## Technical Requirements
- **Library:** `orama` (preferred for its rich feature set and lightweight nature) or `voy`.
- **AI Provider:** Ollama (for external local inference) or Transformers.js (for in-browser embeddings if Ollama is unavailable). *Decision: Prioritize Ollama for power, fallback to Transformers.js or disable features if not present.*
- **Performance:** Indexing should happen asynchronously to not block the UI.
