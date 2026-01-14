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

export type AppState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
};

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  onNodesChange: (changes) => {
    const updatedNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: updatedNodes });
    
    // Sync to Dexie
    changes.forEach((change) => {
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
      type: node.type || 'default',
      position: node.position,
      data: node.data as { label: string; content?: string },
    });
  },
}));
