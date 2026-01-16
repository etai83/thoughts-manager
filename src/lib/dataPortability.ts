import { db } from './db';
import JSZip from 'jszip';

/**
 * Formats a date for filenames (YYYY-MM-DD)
 */
const getDatestamp = () => new Date().toISOString().split('T')[0];

/**
 * Handles saving content to the local computer.
 * Uses the File System Access API (showSaveFilePicker) if available,
 * otherwise falls back to the standard download method.
 */
const saveFile = async (content: string | Blob, fileName: string, mimeType: string, extension: string) => {
  // 1. Try File System Access API
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: mimeType === 'application/json' ? 'JSON File' : 'ZIP Archive',
          accept: { [mimeType]: [`.${extension}`] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      return;
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.warn('File System Access API failed or cancelled, falling back...:', err);
      // Fall through to standard download
    }
  }

  // 2. Fallback: Standard Download
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // Ensure the link is on the page for some browsers
  document.body.appendChild(link);
  link.click();

  // Cleanup with delay to ensure browser handles the click
  setTimeout(() => {
    if (link.parentNode) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 1000);
};

export const exportToJson = async () => {
  const nodes = await db.nodes.toArray();
  const edges = await db.edges.toArray();

  const exportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    nodes,
    edges,
  };

  const fileName = `thoughts-manager-export-${getDatestamp()}.json`;
  await saveFile(JSON.stringify(exportData, null, 2), fileName, 'application/json', 'json');
};

export const exportToMarkdown = async () => {
  const nodes = await db.nodes.toArray();
  const zip = new JSZip();

  for (const node of nodes) {
    // Sanitize filename
    const filename = `${node.data.label.replace(/[/\\?%*:|"<>]/g, '-')}.md`;
    const content = `# ${node.data.label}\n\n${node.data.content || ''}`;
    zip.file(filename, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const fileName = `thoughts-manager-markdown-${getDatestamp()}.zip`;
  await saveFile(blob, fileName, 'application/zip', 'zip');
};

export const importFromJson = async (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);

        // Basic validation
        if (!json.nodes || !Array.isArray(json.nodes)) {
          throw new Error('Invalid export file: missing nodes');
        }

        // Clear existing data
        await db.nodes.clear();
        await db.edges.clear();

        // Import new data
        await db.nodes.bulkAdd(json.nodes);
        if (json.edges && Array.isArray(json.edges)) {
          await db.edges.bulkAdd(json.edges);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
