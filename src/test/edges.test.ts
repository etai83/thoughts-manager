import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '@/lib/store';

describe('Edge Management', () => {
  beforeEach(() => {
    useStore.setState({ nodes: [], edges: [] });
  });

  it('should add an edge when onConnect is called', () => {
    const { getState } = useStore;
    const connection = { source: '1', target: '2', sourceHandle: null, targetHandle: null };
    
    getState().onConnect(connection);
    
    expect(getState().edges.length).toBe(1);
    expect(getState().edges[0]).toMatchObject({
      source: '1',
      target: '2'
    });
  });

  it('should remove an edge when onEdgesChange is called with remove', () => {
    const { getState } = useStore;
    const initialEdge = { id: 'e1-2', source: '1', target: '2' };
    getState().setEdges([initialEdge]);
    
    expect(getState().edges.length).toBe(1);
    
    getState().onEdgesChange([{ id: 'e1-2', type: 'remove' }]);
    
    expect(getState().edges.length).toBe(0);
  });
});
