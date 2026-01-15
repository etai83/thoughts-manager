# Spec: Data Portability & Export/Import

## Goal
Empower users with full ownership of their knowledge map by providing clear, standardized ways to export and import their data. This ensures the application is "local-first" not just in storage, but in portability.

## User Stories
- **Full Backup:** As a user, I want to export my entire graph as a JSON file so I can back it up or move it to another device.
- **Interoperability:** As a user, I want to export my thoughts as individual Markdown files so I can use them in other tools like Obsidian or Logseq.
- **Restore Data:** As a user, I want to import a previously saved JSON file to restore my knowledge map.

## Functional Requirements
- **JSON Export:** Generate a single JSON file containing all nodes (including positions and metadata) and edges.
- **JSON Import:** Parse a JSON file and populate the Dexie.js database. Support "Overwrite" mode.
- **Markdown Export:** Generate a ZIP file or trigger multiple downloads of `.md` files, where each file's content is the node's markdown data and its filename is the node's label.
- **Export/Import UI:** Add a "Data Management" section to the canvas panel.

## Technical Requirements
- **JSON Format:** Standardized schema to ensure forward compatibility.
- **File API:** Use the browser's `File` and `Blob` APIs for triggering downloads.
- **Dexie Integration:** Use `db.clear()` before import in overwrite mode to ensure a clean state.
