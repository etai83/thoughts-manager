import Dexie, { type EntityTable } from 'dexie';

export interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; content?: string };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

const db = new Dexie('ThoughtsManagerDB') as Dexie & {
  nodes: EntityTable<Node, 'id'>;
  edges: EntityTable<Edge, 'id'>;
};

// Schema declaration:
db.version(1).stores({
  nodes: 'id, type', // primary key "id" (for nodes)
  edges: 'id, source, target' // primary key "id" (for edges)
});

export { db };
