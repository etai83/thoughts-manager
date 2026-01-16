import { generateText } from './ollama';

export const explainConnection = async (node1: { label: string; content?: string }, node2: { label: string; content?: string }) => {
  const prompt = `
    You are a knowledge synthesis assistant. Below are two thoughts from a user's knowledge graph.
    Explain a potential conceptual connection or insight that links these two thoughts. 
    Be concise but profound.

    Thought 1:
    Label: ${node1.label}
    Content: ${node1.content || 'No content'}

    Thought 2:
    Label: ${node2.label}
    Content: ${node2.content || 'No content'}

    Connection Explanation:
  `;

  return await generateText(prompt);
};

export const explainMultipleConnections = async (nodes: { label: string; content?: string }[]) => {
  if (nodes.length < 2) {
    return 'Please select at least two thoughts to explain their connections.';
  }

  const thoughtsList = nodes
    .map((node, index) => `Thought ${index + 1}:\nLabel: ${node.label}\nContent: ${node.content || 'No content'}`)
    .join('\n\n');

  const prompt = `
    You are a knowledge synthesis assistant. Below are ${nodes.length} thoughts from a user's knowledge graph.
    Explain the potential conceptual connections, patterns, or overarching themes that link all these thoughts together.
    Identify how they relate to each other and what insights emerge from considering them as a group.
    Be concise but profound.

    ${thoughtsList}

    Connection Explanation:
  `;

  return await generateText(prompt);
};

export const summarizeNodes = async (nodes: { label: string; content?: string }[]) => {
  const nodesContext = nodes.map((n, i) => `Thought ${i + 1}: ${n.label} - ${n.content || ''}`).join('\n\n');
  const prompt = `
    Summarize the overarching theme and key insights from the following collection of thoughts. 
    Provide a concise summary and a suggested title for this cluster.

    Thoughts:
    ${nodesContext}

    Summary:
  `;

  return await generateText(prompt);
};

