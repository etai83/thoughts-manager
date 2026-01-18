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

export type AppState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Partial<AppState['nodes'][0]['data']>) => void;
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
};

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
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
      data: node.data as { label: string; content?: string },
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
      { label: node1.data.label, content: node1.data.content },
      { label: node2.data.label, content: node2.data.content }
    );
  },
  summarizeCluster: async (ids: string[]) => {
    const selectedNodes = get().nodes.filter(n => ids.includes(n.id));
    if (selectedNodes.length === 0) return 'No nodes selected.';

    return await summarizeNodes(
      selectedNodes.map(n => ({ label: n.data.label, content: n.data.content }))
    );
  },
  suggestExpansion: async (id: string) => {
    const node = get().nodes.find(n => n.id === id);
    if (!node) return 'Node not found.';

    return await expandThought({ label: node.data.label, content: node.data.content });
  },
  chatWithGraph: async (question: string) => {
    if (!question) return 'Please ask a question.';

    try {
      const queryEmbedding = await getEmbedding(question);
      const searchResults = await vectorStore.searchByVector(queryEmbedding, 5);
      const contextNodes = searchResults.hits.map(hit => ({
        label: hit.document.label,
        content: hit.document.content
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
    set({ nodes: [], edges: [] });
  },
}));
