# Plan: Build the core spatial-first graph canvas

This plan outlines the steps to build the foundational graph canvas.

## Phase 1: Project Initialization & Environment Setup
- [~] Task: Initialize Next.js project with TypeScript, Tailwind, and Vitest.
- [ ] Task: Install core dependencies (React Flow, Zustand, Dexie.js).
- [ ] Task: Configure Dexie.js database schema for nodes and edges.
- [ ] Task: Set up Zustand store for graph state and persistence logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Initialization & Environment Setup' (Protocol in workflow.md)

## Phase 2: Core Canvas & Node Management
- [ ] Task: Write Tests: Create basic React Flow canvas component.
- [ ] Task: Implement Feature: Basic React Flow canvas with zoom/pan.
- [ ] Task: Write Tests: Add node functionality.
- [ ] Task: Implement Feature: UI for adding nodes to the canvas.
- [ ] Task: Write Tests: Delete node functionality.
- [ ] Task: Implement Feature: Ability to remove nodes.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Canvas & Node Management' (Protocol in workflow.md)

## Phase 3: Linking & Persistence
- [ ] Task: Write Tests: Edge creation and deletion.
- [ ] Task: Implement Feature: Linking nodes together via handles.
- [ ] Task: Write Tests: Dexie.js persistence sync.
- [ ] Task: Implement Feature: Automatically sync Zustand state to Dexie.js on changes.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Linking & Persistence' (Protocol in workflow.md)

## Phase 4: Content Editing & Layout
- [ ] Task: Write Tests: Inline markdown editor component.
- [ ] Task: Implement Feature: Integrated markdown editor within nodes.
- [ ] Task: Write Tests: Auto-layout trigger.
- [ ] Task: Implement Feature: Simple force-directed layout for nodes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Content Editing & Layout' (Protocol in workflow.md)
