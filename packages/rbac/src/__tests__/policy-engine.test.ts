import { describe, it, expect } from 'vitest';
import { PolicyEngine } from '../policy-engine.js';
import { BasePolicy } from '../base-policy.js';
import type { PolicyContext, AuthorizationResult } from '../types.js';

class PostPolicy extends BasePolicy {
  async create(_ctx: PolicyContext): Promise<AuthorizationResult> {
    return { allowed: true, step: 'policy.create' };
  }

  async update(ctx: PolicyContext): Promise<AuthorizationResult> {
    if (!this.isOwner(ctx)) {
      return { allowed: false, reason: 'Not owner', step: 'policy.update' };
    }
    return { allowed: true, step: 'policy.update' };
  }

  async delete(ctx: PolicyContext): Promise<AuthorizationResult> {
    if (!this.isOwner(ctx)) {
      return { allowed: false, reason: 'Not owner', step: 'policy.delete' };
    }
    if (!this.hasState(ctx, 'status', 'draft')) {
      return { allowed: false, reason: 'Can only delete drafts', step: 'policy.delete' };
    }
    return { allowed: true, step: 'policy.delete' };
  }
}

const makeCtx = (overrides: Partial<PolicyContext> = {}): PolicyContext => ({
  user: {
    id: 'user-1',
    tenantId: 'tenant-1',
    permissions: new Set(['posts.create', 'posts.update', 'posts.delete']),
    roles: ['member'],
  },
  resource: { userId: 'user-1', status: 'draft', tenantId: 'tenant-1' },
  action: 'update',
  tenantId: 'tenant-1',
  ...overrides,
});

describe('PolicyEngine', () => {
  it('should evaluate registered policy', async () => {
    const engine = new PolicyEngine();
    engine.register('posts', new PostPolicy());

    const result = await engine.evaluate('posts', 'create', makeCtx());
    expect(result.allowed).toBe(true);
  });

  it('should allow when no policy registered', async () => {
    const engine = new PolicyEngine();
    const result = await engine.evaluate('comments', 'create', makeCtx());
    expect(result.allowed).toBe(true);
    expect(result.reason).toContain('No policy registered');
  });

  it('should report hasPolicy correctly', () => {
    const engine = new PolicyEngine();
    engine.register('posts', new PostPolicy());
    expect(engine.hasPolicy('posts')).toBe(true);
    expect(engine.hasPolicy('comments')).toBe(false);
  });

  it('should deny non-owner delete', async () => {
    const engine = new PolicyEngine();
    engine.register('posts', new PostPolicy());

    const ctx = makeCtx({
      resource: { userId: 'other-user', status: 'draft', tenantId: 'tenant-1' },
    });
    const result = await engine.evaluate('posts', 'delete', ctx);
    expect(result.allowed).toBe(false);
  });
});
