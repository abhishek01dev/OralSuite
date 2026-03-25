import { describe, it, expect } from 'vitest';
import { BasePolicy } from '../base-policy.js';
import type { PolicyContext, AuthorizationResult } from '../types.js';

class TestPolicy extends BasePolicy {
  async view(_ctx: PolicyContext): Promise<AuthorizationResult> {
    return { allowed: true, step: 'policy.view' };
  }

  async update(ctx: PolicyContext): Promise<AuthorizationResult> {
    if (!this.isOwner(ctx)) {
      return { allowed: false, reason: 'Not the owner', step: 'policy.update' };
    }
    if (!this.hasState(ctx, 'status', 'draft', 'review')) {
      return { allowed: false, reason: 'Invalid state for update', step: 'policy.update' };
    }
    return { allowed: true, step: 'policy.update' };
  }

  async approve(ctx: PolicyContext): Promise<AuthorizationResult> {
    if (!this.sameDepartment(ctx)) {
      return { allowed: false, reason: 'Not in same department', step: 'policy.approve' };
    }
    if (!this.isBusinessHours()) {
      return { allowed: false, reason: 'Outside business hours', step: 'policy.approve' };
    }
    return { allowed: true, step: 'policy.approve' };
  }
}

const makeCtx = (overrides: Partial<PolicyContext> = {}): PolicyContext => ({
  user: {
    id: 'user-1',
    tenantId: 'tenant-1',
    permissions: new Set(['posts.read', 'posts.update']),
    roles: ['member'],
    departmentId: 'dept-1',
  },
  resource: { userId: 'user-1', status: 'draft', departmentId: 'dept-1', tenantId: 'tenant-1' },
  action: 'update',
  tenantId: 'tenant-1',
  ...overrides,
});

describe('BasePolicy', () => {
  const policy = new TestPolicy();

  describe('before() hook', () => {
    it('should bypass when user has system.bypass_policies permission', async () => {
      const ctx = makeCtx({
        user: {
          id: 'admin-1',
          tenantId: 'tenant-1',
          permissions: new Set(['system.bypass_policies']),
          roles: ['super_admin'],
        },
      });
      const result = await policy.authorize('update', ctx);
      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('Super admin bypass');
    });

    it('should not bypass for regular users', async () => {
      const ctx = makeCtx();
      const result = await policy.authorize('view', ctx);
      expect(result.allowed).toBe(true);
      expect(result.step).toBe('policy.view');
    });
  });

  describe('ownership check', () => {
    it('should allow owner to update', async () => {
      const ctx = makeCtx();
      const result = await policy.authorize('update', ctx);
      expect(result.allowed).toBe(true);
    });

    it('should deny non-owner update', async () => {
      const ctx = makeCtx({
        resource: {
          userId: 'other-user',
          status: 'draft',
          departmentId: 'dept-1',
          tenantId: 'tenant-1',
        },
      });
      const result = await policy.authorize('update', ctx);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Not the owner');
    });
  });

  describe('state check', () => {
    it('should deny update on published resource', async () => {
      const ctx = makeCtx({
        resource: {
          userId: 'user-1',
          status: 'published',
          departmentId: 'dept-1',
          tenantId: 'tenant-1',
        },
      });
      const result = await policy.authorize('update', ctx);
      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Invalid state for update');
    });
  });

  describe('unknown action', () => {
    it('should deny when no policy method exists for the action', async () => {
      const ctx = makeCtx({ action: 'archive' });
      const result = await policy.authorize('archive', ctx);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('No policy method defined');
    });
  });
});
