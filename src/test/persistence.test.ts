import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';

// Mock Dexie
vi.mock('@/lib/db', () => ({
  db: {
    nodes: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
    edges: {
      add: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
  },
}));

describe('Persistence Sync', () => {
  beforeEach(() => {
    useStore.setState({ nodes: [], edges: [] });
    vi.clearAllMocks();
  });

  it('should call db.nodes.add when a node is added', () => {
    const node = { id: '1', position: { x: 0, y: 0 }, data: { label: 'Test' } };
    useStore.getState().addNode(node);
    expect(db.nodes.add).toHaveBeenCalled();
  });

  it('should call db.edges.add when a connection is made', () => {
    const connection = { source: '1', target: '2', sourceHandle: null, targetHandle: null };
    useStore.getState().onConnect(connection);
    expect(db.edges.add).toHaveBeenCalled();
  });
});
