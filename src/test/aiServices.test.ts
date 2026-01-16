import { describe, it, expect, vi } from 'vitest';
import { explainConnection } from '@/lib/aiServices';
import * as ollama from '@/lib/ollama';

vi.mock('@/lib/ollama', () => ({
  generateText: vi.fn().mockResolvedValue('These are connected by technology.'),
  getEmbedding: vi.fn(),
}));

describe('AI Services', () => {
  it('should generate a connection explanation', async () => {
    const node1 = { label: 'React', content: 'A UI library' };
    const node2 = { label: 'JavaScript', content: 'A language' };
    
    const explanation = await explainConnection(node1, node2);
    
    expect(explanation).toBe('These are connected by technology.');
    expect(ollama.generateText).toHaveBeenCalled();
  });
});
