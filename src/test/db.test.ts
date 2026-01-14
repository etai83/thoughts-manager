import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '@/lib/db';

describe('Database Configuration', () => {
  it('should have nodes and edges tables', () => {
    expect(db.nodes).toBeDefined();
    expect(db.edges).toBeDefined();
  });

  it('should have the correct schema version', () => {
    expect(db.verno).toBe(1);
  });
});
