import { create, insert, search, type AnyOrama } from '@orama/orama';
import { db } from './db';
import { getEmbedding } from './ollama';

export interface VectorDocument {
  id: string;
  label: string;
  content: string;
  embedding: number[];
}

export class VectorStore {
  db: AnyOrama | null = null;

  async init() {
    this.db = await create({
      schema: {
        id: 'string',
        label: 'string',
        content: 'string',
        embedding: 'vector[384]', 
      },
    });
  }

  async index(doc: VectorDocument) {
    if (!this.db) throw new Error('VectorStore not initialized');
    await insert(this.db, doc);
  }

  async search(term: string) {
    if (!this.db) throw new Error('VectorStore not initialized');
    return await search(this.db, { term });
  }

  async searchByVector(vector: number[], limit = 5, similarity = 0.8) {
    if (!this.db) throw new Error('VectorStore not initialized');
    return await search(this.db, {
      mode: 'vector',
      vector: {
        value: vector,
        property: 'embedding',
      },
      similarity,
      limit,
    });
  }

  async syncWithDexie() {
    const nodes = await db.nodes.toArray();
    for (const node of nodes) {
      let embedding = node.embedding;
      const content = node.data.content || '';
      const textToEmbed = `${node.data.label} ${content}`;

      if (!embedding) {
        embedding = await getEmbedding(textToEmbed);
        // Cache in Dexie
        await db.nodes.update(node.id, { embedding });
      }
      
      await this.index({
        id: node.id,
        label: node.data.label,
        content: content,
        embedding: embedding,
      });
    }
  }
}

export const vectorStore = new VectorStore();
