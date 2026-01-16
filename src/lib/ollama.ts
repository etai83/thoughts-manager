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

export const generateText = async (prompt: string, model = 'llama3.1') => {
  try {
    const response = await ollama.chat({
      model: model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.message.content;
  } catch (error) {
    console.error('Error generating text from Ollama:', error);
    return 'Error: Could not connect to Ollama. Please ensure it is running and the model is pulled.';
  }
};

