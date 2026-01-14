# Plan: Semantic Discovery & AI Integration

This plan outlines the steps to integrate local AI and semantic search capabilities.

## Phase 1: Vector Store & Embeddings Infrastructure [checkpoint: 392b249]
- [x] Task: Install dependencies (Orama, interface for Ollama).
- [x] Task: Write Tests: Vector store initialization and indexing.
- [x] Task: Implement Feature: Service to initialize Orama and index existing nodes from Dexie.
- [x] Task: Write Tests: Embeddings generation via mock Ollama API.
- [x] Task: Implement Feature: Service to fetch embeddings from local Ollama instance.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Vector Store & Embeddings Infrastructure' (Protocol in workflow.md)

## Phase 2: Semantic Search [checkpoint: 99e1306]
- [x] Task: Write Tests: Semantic search query logic.
- [x] Task: Implement Feature: Search hook that queries Orama with vector similarity.
- [x] Task: Implement Feature: Global search bar UI in the canvas overlay.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Semantic Search' (Protocol in workflow.md)

## Phase 3: AI-Driven Insights
- [x] Task: Write Tests: Similar node detection logic.
- [x] Task: Implement Feature: "Related Thoughts" calculation based on vector proximity.
- [x] Task: Implement Feature: UI panel to display suggested connections for the selected node.
- [~] Task: Conductor - User Manual Verification 'Phase 3: AI-Driven Insights' (Protocol in workflow.md)
