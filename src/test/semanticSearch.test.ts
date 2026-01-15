import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vectorStore } from '@/lib/vectorStore';
import { getEmbedding } from '@/lib/ollama';

// Mock Ollama
vi.mock('@/lib/ollama', () => ({
  getEmbedding: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
}));

describe('Semantic Search Logic', () => {
  beforeEach(async () => {
    await vectorStore.init();
    // Index a sample document
    await vectorStore.index({
      id: '1',
      label: 'Deep Learning',
      content: 'A subset of machine learning based on neural networks.',
      embedding: new Array(384).fill(0.1),
    });
  });

  it('should find results using semantic similarity', async () => {
    const query = 'neural networks';
    const queryEmbedding = await getEmbedding(query);
    const results = await vectorStore.searchByVector(queryEmbedding);
    
    expect(results.count).toBeGreaterThan(0);
    expect(results.hits[0].document.label).toBe('Deep Learning');
  });
});
