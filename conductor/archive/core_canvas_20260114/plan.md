# Plan: Build the core spatial-first graph canvas

This plan outlines the steps to build the foundational graph canvas.

## Phase 1: Project Initialization & Environment Setup [checkpoint: 7ef5e13]
- [x] Task: Initialize Next.js project with TypeScript, Tailwind, and Vitest. (ce76aed)
- [x] Task: Install core dependencies (React Flow, Zustand, Dexie.js).
- [x] Task: Configure Dexie.js database schema for nodes and edges.
- [x] Task: Set up Zustand store for graph state and persistence logic.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Project Initialization & Environment Setup' (Protocol in workflow.md)

## Phase 2: Core Canvas & Node Management [checkpoint: 0987404]
- [x] Task: Write Tests: Create basic React Flow canvas component.
- [x] Task: Implement Feature: Basic React Flow canvas with zoom/pan.
- [x] Task: Write Tests: Add node functionality.
- [x] Task: Implement Feature: UI for adding nodes to the canvas.
- [x] Task: Write Tests: Delete node functionality.
- [x] Task: Implement Feature: Ability to remove nodes.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Core Canvas & Node Management' (Protocol in workflow.md)

## Phase 3: Linking & Persistence [checkpoint: ad7d07d]
- [x] Task: Write Tests: Edge creation and deletion.
- [x] Task: Implement Feature: Linking nodes together via handles.
- [x] Task: Write Tests: Dexie.js persistence sync.
- [x] Task: Implement Feature: Automatically sync Zustand state to Dexie.js on changes.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Linking & Persistence' (Protocol in workflow.md)

## Phase 4: Content Editing & Layout [checkpoint: f623281]
- [x] Task: Write Tests: Inline markdown editor component.
- [x] Task: Implement Feature: Integrated markdown editor within nodes.
- [x] Task: Write Tests: Auto-layout trigger.
- [x] Task: Implement Feature: Simple force-directed layout for nodes.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Content Editing & Layout' (Protocol in workflow.md)
