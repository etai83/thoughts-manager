import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vectorStore } from '@/lib/vectorStore';

describe('AI-Driven Insights (Similar Nodes)', () => {
  beforeEach(async () => {
    await vectorStore.init();
    
    // Index sample documents
    await vectorStore.index({
      id: '1',
      label: 'TypeScript',
      content: 'A typed superset of JavaScript.',
      embedding: new Array(384).fill(0.1),
    });
    
    await vectorStore.index({
      id: '2',
      label: 'React',
      content: 'A library for building user interfaces.',
      embedding: new Array(384).fill(0.2),
    });
    
    await vectorStore.index({
      id: '3',
      label: 'JavaScript',
      content: 'The programming language of the web.',
      embedding: new Array(384).fill(0.11), // Close to TypeScript
    });
  });

  it('should find nodes similar to a given node embedding', async () => {
    // Search using embedding of node '1' (TypeScript)
    const results = await vectorStore.searchByVector(new Array(384).fill(0.1));
    
    // Results should include JavaScript as it's closer than React
    const labels = results.hits.map(h => h.document.label);
    expect(labels).toContain('JavaScript');
    // Result 1 is TypeScript itself (exact match), Result 2 should be JavaScript
    expect(results.hits[0].document.label).toBe('TypeScript');
  });
});
