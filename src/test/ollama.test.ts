import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getEmbedding } from '@/lib/ollama';
import { Ollama } from 'ollama';

vi.mock('ollama', () => {
  return {
    Ollama: vi.fn().mockImplementation(() => {
      return {
        embeddings: vi.fn().mockResolvedValue({
          embedding: new Array(384).fill(0.1),
        }),
      };
    }),
  };
});

describe('Ollama Service', () => {
  it('should return an embedding vector', async () => {
    const embedding = await getEmbedding('test text');
    expect(embedding).toHaveLength(384);
    expect(embedding[0]).toBe(0.1);
  });
});
