# Spec: Knowledge Synthesis & AI Partnering

## Goal
Elevate ThoughtsManager from a storage tool to a cognitive partner. By leveraging local LLMs (Ollama), the system will help users find deeper meaning in their notes, explain non-obvious connections, and summarize complex clusters of thoughts.

## User Stories
- **Explain Relationship:** As a user, I want to select two unrelated nodes and have the AI explain a potential conceptual link between them.
- **Synthesize Cluster:** As a user, I want the AI to read a group of selected nodes and provide a concise summary of the overarching theme.
- **Expand Thought:** As a user, I want the AI to suggest the "next step" or a related question for a specific note to help me overcome writer's block.
- **Graph Chat (RAG):** As a user, I want to ask questions like "What are my main takeaways from the project?" and get answers based on my indexed notes.

## Functional Requirements
- **Relationship Explainer:** UI to trigger an LLM prompt that takes two node contents as context.
- **Cluster Summarizer:** UI to trigger an LLM prompt that takes multiple node contents as context.
- **Thought Completion:** "AI Suggest" button within the `ThoughtNode` editor.
- **RAG (Retrieval Augmented Generation):** Combine the existing vector search (`orama`) with the LLM to provide grounded answers to user questions.

## Technical Requirements
- **Ollama Models:** Support for `llama3`, `mistral`, or `gemma` (user configurable, default to `llama3`).
- **Prompt Engineering:** Standardized system prompts for synthesis, explanation, and summarization.
- **Context Window Management:** Ensure that large clusters don't exceed the LLM's context limit by intelligently sampling or summarizing sub-chunks.
- **Asynchronous Processing:** UI must remain responsive (show loading states) while the local LLM generates text.
