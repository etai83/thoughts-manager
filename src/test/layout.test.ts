import { describe, it, expect } from 'vitest';
import { runLayout } from '@/lib/layout';

describe('Layout Utility', () => {
  it('should update node positions', () => {
    const nodes = [
      { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
      { id: '2', position: { x: 0, y: 0 }, data: { label: '2' } },
    ];
    const edges = [{ id: 'e1-2', source: '1', target: '2' }];
    
    // @ts-ignore
    const updatedNodes = runLayout(nodes, edges);
    
    expect(updatedNodes[0].position.x).not.toBe(0);
    expect(updatedNodes[1].position.x).not.toBe(0);
  });
});
