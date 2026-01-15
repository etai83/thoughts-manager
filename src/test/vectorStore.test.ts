import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VectorStore } from '@/lib/vectorStore';

describe('VectorStore', () => {
  let vectorStore: VectorStore;

  beforeEach(async () => {
    vectorStore = new VectorStore();
    await vectorStore.init();
  });

  it('should initialize the Orama database', () => {
    expect(vectorStore.db).toBeDefined();
  });

  it('should index a document', async () => {
    const doc = {
      id: '1',
      label: 'Test Thought',
      content: 'This is a test content',
      embedding: new Array(384).fill(0).map(() => Math.random()), // Mock embedding
    };

    await vectorStore.index(doc);
    const results = await vectorStore.search('test');
    expect(results.count).toBeGreaterThan(0);
  });

  it('should search by vector similarity', async () => {
    const vector = new Array(384).fill(0).map(() => Math.random());
    const results = await vectorStore.searchByVector(vector);
    expect(results).toBeDefined();
  });
});
