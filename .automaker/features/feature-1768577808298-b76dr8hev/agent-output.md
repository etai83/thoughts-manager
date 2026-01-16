<summary>
## Summary: add a button "Delete All Thoughts"

### Changes Implemented
- Added `clearData` to the destructured `useStore` hook in `Sidebar.tsx`.
- Implemented `handleDeleteAll` function with a confirmation dialog (`window.confirm`) to prevent accidental deletions.
- Added a "Delete All Thoughts" button in the sidebar's Data section with appropriate red styling to indicate a destructive action.

### Files Modified
- `src/components/Sidebar.tsx`

### Verification Status
- Created a temporary Playwright test `verification.spec.ts`.
- The test verified:
  - Adding a thought.
  - Clicking "Delete All Thoughts".
  - Accepting the confirmation dialog.
  - Verifying that all thoughts were removed from the canvas.
- The test passed successfully.
- Cleaned up by deleting `verification.spec.ts` and uninstalling `@playwright/test`.

### Notes for Developer
- The `clearData` function in `store.ts` was already implemented and correctly handles clearing both Zustand state and Dexie database.
- The button uses `window.confirm` for simplicity; a custom modal could be implemented if a more native UI experience is desired in the future.
</summary>