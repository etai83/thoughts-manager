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

export const expandThought = async (node: { label: string; content?: string }) => {
  const prompt = `
    You are a creative thinking assistant. Below is a thought from a user's knowledge graph.
    Based on the label and content, suggest a short continuation, a related question, or a next logical step for this thought.
    Be helpful and brief.

    Thought:
    Label: ${node.label}
    Content: ${node.content || 'No content'}

    Suggestion:
  `;

  return await generateText(prompt);
};

export const askGraph = async (question: string, contextNodes: { label: string; content?: string }[]) => {
  const context = contextNodes.map((n, i) => `Thought ${i+1}: ${n.label} - ${n.content || ''}`).join('\n\n');
  const prompt = `
    You are a knowledge synthesis assistant. A user is asking a question about their knowledge graph.
    Based on the provided context nodes, answer the user's question. 
    If the context does not contain enough information, say so, but try to be as helpful as possible with what you have.

    Context:
    ${context}

    User Question: ${question}

    Answer:
  `;

  return await generateText(prompt);
};

