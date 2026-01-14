# Spec: Build the core spatial-first graph canvas

## Goal
Establish the foundational infinite canvas and node management system for ThoughtsManager.

## User Stories
- **Create and Connect:** As a user, I want to create nodes and link them together on a canvas so I can map my ideas.
- **Visual Exploration:** As a user, I want to drag and zoom the canvas so I can navigate my knowledge network.
- **Local Persistence:** As a user, I want my data to be saved automatically to my browser so I don't lose progress.

## Functional Requirements
- **Infinite Canvas:** A fluid, zoomable, and pannable workspace using React Flow.
- **Node Management:** Add, delete, and move nodes.
- **Edge Management:** Create and delete links between nodes.
- **Markdown Editing:** Edit node content using a simple markdown editor directly on the canvas.
- **Local Storage:** Persist nodes and edges to IndexedDB using Dexie.js.
- **Auto-Layout:** Provide a basic layout algorithm (e.g., Force-directed or Tree) to organize nodes.

## Technical Requirements
- Next.js 14+ (App Router)
- React Flow for graph visualization
- Zustand for state management
- Dexie.js for IndexedDB
- Tailwind CSS for styling
- Vitest for testing
