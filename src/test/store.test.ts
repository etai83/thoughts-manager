import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/lib/store';

describe('Zustand Store', () => {
  beforeEach(() => {
    useStore.setState({ nodes: [], edges: [] });
  });

  it('should initialize with empty nodes and edges', () => {
    const state = useStore.getState();
    expect(state.nodes).toEqual([]);
    expect(state.edges).toEqual([]);
  });

  it('should add a node', () => {
    const node = { id: '1', position: { x: 0, y: 0 }, data: { label: 'Test Node' }, type: 'default' };
    useStore.getState().addNode(node);
    expect(useStore.getState().nodes).toContainEqual(node);
  });
});
