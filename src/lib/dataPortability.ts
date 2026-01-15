import { db } from './db';
import JSZip from 'jszip';

export const exportToJson = async () => {
  const nodes = await db.nodes.toArray();
  const edges = await db.edges.toArray();

  const exportData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    nodes,
    edges,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `thoughts-manager-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = async () => {
  const nodes = await db.nodes.toArray();
  const zip = new JSZip();

  for (const node of nodes) {
    const filename = `${node.data.label.replace(/[/\\?%*:|"<>]/g, '-')}.md`;
    const content = `# ${node.data.label}\n\n${node.data.content || ''}`;
    zip.file(filename, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `thoughts-manager-markdown-${new Date().toISOString().split('T')[0]}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
