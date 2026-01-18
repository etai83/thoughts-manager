import { create } from 'zustand';
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import { db } from './db';
import { vectorStore } from './vectorStore';
import { getEmbedding } from './ollama';
import { explainConnection, summarizeNodes, expandThought, askGraph } from './aiServices';
import {
  initGoogleAuth,
  signIn,
  signOut,
  isAuthenticated,
  fetchThoughtsFromSheet,
  appendThoughtToSheet,
  markRowsAsSynced,
  type SheetThought,
} from './googleSheetsService';

export interface GoogleAuthState {
  isConnected: boolean;
  isInitialized: boolean;
  spreadsheetId: string | null;
  lastSyncTime: string | null;
  syncError: string | null;
}

export type AppState = {
  nodes: Node[];
  edges: Edge[];
  selectedTags: string[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Partial<AppState['nodes'][0]['data']>) => void;
  addTag: (nodeId: string, tag: string) => void;
  removeTag: (nodeId: string, tag: string) => void;
  setSelectedTags: (tags: string[]) => void;
  getFilteredNodes: () => Node[];
  getAllTags: () => string[];
  loadData: () => Promise<void>;
  searchNodes: (query: string) => Promise<any[]>;
  getRelatedNodes: (nodeId: string) => Promise<any[]>;
  getRelationshipExplanation: (id1: string, id2: string) => Promise<string>;
  summarizeCluster: (ids: string[]) => Promise<string>;
  suggestExpansion: (id: string) => Promise<string>;
  chatWithGraph: (question: string) => Promise<string>;
  toggleSelection: (id: string, isMulti: boolean) => void;
  clearSelection: () => void;
  clearData: () => Promise<void>;
  // Google Sheets Sync
  googleAuth: GoogleAuthState;
  initGoogleSheetsAuth: () => Promise<void>;
  connectGoogleSheets: () => Promise<void>;
  disconnectGoogleSheets: () => void;
  setSpreadsheetId: (id: string) => void;
  syncFromSheets: () => Promise<{ imported: number; total: number }>;
  syncToSheets: () => Promise<{ exported: number }>;
};

// Helper to generate a simple hash for duplicate detection
const hashContent = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedTags: [],
  // Google Auth State
  googleAuth: {
    isConnected: false,
    isInitialized: false,
    spreadsheetId: typeof window !== 'undefined'
      ? localStorage.getItem('thoughts-spreadsheet-id')
      : null,
    lastSyncTime: typeof window !== 'undefined'
      ? localStorage.getItem('thoughts-last-sync')
      : null,
    syncError: null,
  },
  onNodesChange: (changes) => {
    // Filter out selection changes - we handle selection manually via toggleSelection
    const nonSelectChanges = changes.filter((c) => c.type !== 'select');
    const updatedNodes = applyNodeChanges(nonSelectChanges, get().nodes);
    set({ nodes: updatedNodes });

    // Sync to Dexie
    nonSelectChanges.forEach((change) => {
      if (change.type === 'remove') {
        db.nodes.delete(change.id);
      } else if (change.type === 'position' && change.position) {
        db.nodes.update(change.id, { position: change.position });
      }
    });
  },
  onEdgesChange: (changes) => {
    const updatedEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: updatedEdges });

    changes.forEach((change) => {
      if (change.type === 'remove') {
        db.edges.delete(change.id);
      }
    });
  },
  onConnect: (connection) => {
    const newEdges = addEdge(connection, get().edges);
    set({ edges: newEdges });

    // Dexie sync - addEdge returns an array with the new edge added
    const latestEdge = newEdges[newEdges.length - 1];
    if (latestEdge) {
      db.edges.add({
        id: latestEdge.id,
        source: latestEdge.source,
        target: latestEdge.target,
      });
    }
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    db.nodes.add({
      id: node.id,
      type: node.type || 'thought',
      position: node.position,
      data: node.data as { label: string; content?: string; tags?: string[] },
    });
  },
  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
    db.nodes.update(id, { data: { ...get().nodes.find(n => n.id === id)?.data, ...data } as any });
  },
  addTag: (nodeId, tag) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node) return;

    const currentTags = (node.data as any).tags || [];
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      get().updateNodeData(nodeId, { tags: newTags });
    }
  },
  removeTag: (nodeId, tag) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node || !(node.data as any).tags) return;

    const newTags = (node.data as any).tags.filter((t: string) => t !== tag);
    get().updateNodeData(nodeId, { tags: newTags });
  },
  setSelectedTags: (tags) => {
    set({ selectedTags: tags });
  },
  getFilteredNodes: () => {
    const { nodes, selectedTags } = get();
    if (selectedTags.length === 0) return nodes;

    return nodes.filter(node => {
      const nodeTags = (node.data as any).tags || [];
      return selectedTags.every(tag => nodeTags.includes(tag));
    });
  },
  getAllTags: () => {
    const { nodes } = get();
    const tagSet = new Set<string>();
    nodes.forEach(node => {
      ((node.data as any).tags || []).forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  },
  loadData: async () => {
    await vectorStore.init();
    const nodes = await db.nodes.toArray();
    const edges = await db.edges.toArray();
    set({
      nodes: nodes.map(n => ({ ...n, data: { ...n.data } })),
      edges
    });
    await vectorStore.syncWithDexie();
  },
  searchNodes: async (query: string) => {
    if (!query) return [];
    try {
      const queryEmbedding = await getEmbedding(query);
      const results = await vectorStore.searchByVector(queryEmbedding);
      return results.hits.map(hit => hit.document);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  },
  getRelatedNodes: async (nodeId: string) => {
    const node = get().nodes.find(n => n.id === nodeId) as any;
    if (!node || !node.embedding) return [];

    try {
      const results = await vectorStore.searchByVector(node.embedding, 6, 0.1);
      return results.hits
        .filter(hit => hit.document.id !== nodeId)
        .map(hit => hit.document);
    } catch (error) {
      console.error('Failed to get related nodes:', error);
      return [];
    }
  },
  getRelationshipExplanation: async (id1: string, id2: string) => {
    const node1 = get().nodes.find(n => n.id === id1);
    const node2 = get().nodes.find(n => n.id === id2);
    if (!node1 || !node2) return 'Nodes not found.';

    return await explainConnection(
      { label: node1.data.label as string, content: node1.data.content as string | undefined },
      { label: node2.data.label as string, content: node2.data.content as string | undefined }
    );
  },
  summarizeCluster: async (ids: string[]) => {
    const selectedNodes = get().nodes.filter(n => ids.includes(n.id));
    if (selectedNodes.length === 0) return 'No nodes selected.';

    return await summarizeNodes(
      selectedNodes.map(n => ({ label: n.data.label as string, content: n.data.content as string | undefined }))
    );
  },
  suggestExpansion: async (id: string) => {
    const node = get().nodes.find(n => n.id === id);
    if (!node) return 'Node not found.';

    return await expandThought({ label: node.data.label as string, content: node.data.content as string | undefined });
  },
  chatWithGraph: async (question: string) => {
    if (!question) return 'Please ask a question.';

    try {
      const queryEmbedding = await getEmbedding(question);
      const searchResults = await vectorStore.searchByVector(queryEmbedding, 5);
      const contextNodes = searchResults.hits.map(hit => ({
        label: hit.document.label as string,
        content: hit.document.content as string | undefined
      }));

      if (contextNodes.length === 0) {
        return "I couldn't find any relevant thoughts to answer your question.";
      }

      return await askGraph(question, contextNodes);
    } catch (error) {
      console.error('Chat failed:', error);
      return 'Sorry, I encountered an error while searching your knowledge graph.';
    }
  },
  toggleSelection: (id, isMulti) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          // For multi-select, toggle the state. For single-select, always select.
          return { ...node, selected: isMulti ? !node.selected : true };
        }
        // For single-select, deselect all others. For multi-select, keep other selections.
        return isMulti ? node : { ...node, selected: false };
      }),
    });
  },
  clearSelection: () => {
    set({
      nodes: get().nodes.map((node) => ({ ...node, selected: false })),
    });
  },
  clearData: async () => {
    await db.nodes.clear();
    await db.edges.clear();
    set({ nodes: [], edges: [], selectedTags: [] });
  },

  // Google Sheets Integration
  initGoogleSheetsAuth: async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Google Client ID not configured');
      return;
    }
    try {
      await initGoogleAuth(clientId);
      set({
        googleAuth: {
          ...get().googleAuth,
          isInitialized: true,
          isConnected: isAuthenticated(),
        },
      });
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
    }
  },

  connectGoogleSheets: async () => {
    try {
      set({
        googleAuth: { ...get().googleAuth, syncError: null },
      });
      await signIn();
      set({
        googleAuth: {
          ...get().googleAuth,
          isConnected: true,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect';
      set({
        googleAuth: { ...get().googleAuth, syncError: message },
      });
      throw error;
    }
  },

  disconnectGoogleSheets: () => {
    signOut();
    set({
      googleAuth: {
        ...get().googleAuth,
        isConnected: false,
      },
    });
  },

  setSpreadsheetId: (id: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('thoughts-spreadsheet-id', id);
    }
    set({
      googleAuth: {
        ...get().googleAuth,
        spreadsheetId: id,
      },
    });
  },

  syncFromSheets: async () => {
    const { googleAuth, nodes, addNode } = get();

    if (!googleAuth.isConnected) {
      throw new Error('Not connected to Google. Please sign in first.');
    }
    if (!googleAuth.spreadsheetId) {
      throw new Error('Spreadsheet ID not set. Please configure it first.');
    }

    try {
      set({ googleAuth: { ...googleAuth, syncError: null } });

      const sheetThoughts = await fetchThoughtsFromSheet(googleAuth.spreadsheetId);
      const unsyncedThoughts = sheetThoughts.filter(t => !t.synced && t.content.trim());

      // Get existing content hashes for duplicate detection
      const existingHashes = new Set(
        nodes.map(n => hashContent(((n.data.label as string) || '') + ((n.data.content as string) || '')))
      );

      const rowsToMark: number[] = [];
      let imported = 0;

      for (const thought of unsyncedThoughts) {
        const contentHash = hashContent(thought.content);

        // Skip duplicates
        if (existingHashes.has(contentHash)) {
          rowsToMark.push(thought.rowIndex);
          continue;
        }

        // Create new thought node
        const id = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
        const newNode = {
          id,
          position: {
            x: 200 + Math.random() * 300,
            y: 200 + Math.random() * 300,
          },
          data: {
            label: thought.content.slice(0, 50) + (thought.content.length > 50 ? '...' : ''),
            content: thought.content,
          },
          type: 'thought',
        };
        addNode(newNode);
        existingHashes.add(contentHash);
        rowsToMark.push(thought.rowIndex);
        imported++;
      }

      // Mark rows as synced in the sheet
      if (rowsToMark.length > 0) {
        await markRowsAsSynced(googleAuth.spreadsheetId, rowsToMark);
      }

      // Update last sync time
      const now = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem('thoughts-last-sync', now);
      }
      set({
        googleAuth: {
          ...get().googleAuth,
          lastSyncTime: now,
        },
      });

      return { imported, total: sheetThoughts.length };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      set({
        googleAuth: { ...get().googleAuth, syncError: message },
      });
      throw error;
    }
  },

  syncToSheets: async () => {
    const { googleAuth, nodes } = get();

    if (!googleAuth.isConnected) {
      throw new Error('Not connected to Google. Please sign in first.');
    }
    if (!googleAuth.spreadsheetId) {
      throw new Error('Spreadsheet ID not set. Please configure it first.');
    }

    try {
      set({ googleAuth: { ...googleAuth, syncError: null } });

      // Get existing thoughts from sheet
      const sheetThoughts = await fetchThoughtsFromSheet(googleAuth.spreadsheetId);
      const existingHashes = new Set(
        sheetThoughts.map(t => hashContent(t.content))
      );

      let exported = 0;

      for (const node of nodes) {
        const content = ((node.data.content as string) || (node.data.label as string) || '');
        if (!content.trim()) continue;

        const contentHash = hashContent(content);

        // Skip if already in sheet
        if (existingHashes.has(contentHash)) continue;

        await appendThoughtToSheet(googleAuth.spreadsheetId, content as string);
        existingHashes.add(contentHash);
        exported++;
      }

      // Update last sync time
      const now = new Date().toISOString();
      if (typeof window !== 'undefined') {
        localStorage.setItem('thoughts-last-sync', now);
      }
      set({
        googleAuth: {
          ...get().googleAuth,
          lastSyncTime: now,
        },
      });

      return { exported };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      set({
        googleAuth: { ...get().googleAuth, syncError: message },
      });
      throw error;
    }
  },
}));
