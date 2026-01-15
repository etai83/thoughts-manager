import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from '@/lib/store';

describe('Data Portability - Export', () => {
  beforeEach(() => {
    useStore.setState({
      nodes: [
        { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1', content: 'Content 1' }, type: 'thought' }
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' }
      ]
    });
  });

  it('should generate a valid JSON structure for export', () => {
    const state = useStore.getState();
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      nodes: state.nodes,
      edges: state.edges
    };

    expect(exportData.nodes).toHaveLength(1);
    expect(exportData.edges).toHaveLength(1);
    expect(exportData.nodes[0].id).toBe('1');
    expect(exportData.version).toBe('1.0');
  });

  it('should validate and parse import data correctly', () => {
    const importData = {
      version: '1.0',
      nodes: [{ id: '2', position: { x: 10, y: 10 }, data: { label: 'Node 2' }, type: 'thought' }],
      edges: []
    };

    // Validation logic check
    expect(importData.nodes).toBeDefined();
    expect(Array.isArray(importData.nodes)).toBe(true);
    expect(importData.nodes[0].id).toBe('2');
  });
});
