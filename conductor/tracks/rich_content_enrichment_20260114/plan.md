# Plan: Rich Content Enrichment

This plan outlines the steps to add multimedia support to nodes.

## Phase 1: Code Syntax Highlighting
- [x] Task: Install dependencies (rehype-highlight or react-syntax-highlighter).
- [x] Task: Write Tests: Verify that markdown with code blocks renders specific classes/styles.
- [x] Task: Implement Feature: Configure ReactMarkdown to use a syntax highlighter plugin.
- [~] Task: Conductor - User Manual Verification 'Phase 1: Code Syntax Highlighting' (Protocol in workflow.md)

## Phase 2: Image Support
- [ ] Task: Write Tests: Paste event handler logic (mocking clipboard data).
- [ ] Task: Implement Feature: Handle image paste events in the `ThoughtNode` textarea, convert to Base64, and insert markdown image tag.
- [ ] Task: Implement Feature: Ensure ReactMarkdown renders images correctly within the node.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Image Support' (Protocol in workflow.md)
