import { Ollama } from 'ollama/browser';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export const getEmbedding = async (text: string, model = 'all-minilm') => {
  try {
    const response = await ollama.embeddings({
      model: model,
      prompt: text,
    });
    return response.embedding;
  } catch (error) {
    console.error('Error fetching embedding from Ollama:', error);
    // Return a dummy vector if Ollama is not available for development
    return new Array(384).fill(0);
  }
};
