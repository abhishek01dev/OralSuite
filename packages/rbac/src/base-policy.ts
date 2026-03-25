import { SYSTEM_PERMISSIONS } from '@repo/shared';
import type { PolicyContext, AuthorizationResult } from './types.js';

/**
 * Base policy class. All resource policies must extend this.
 * The `before()` hook checks for system.bypass_policies permission (super admin).
 */
export abstract class BasePolicy {
  /**
   * Runs before any policy method. Returns true to allow (bypass),
   * false to deny, or undefined to continue to the specific policy method.
   */
  before(ctx: PolicyContext): boolean | undefined {
    if (ctx.user.permissions.has(SYSTEM_PERMISSIONS.BYPASS_POLICIES)) {
      return true;
    }
    return undefined;
  }

  async authorize(action: string, ctx: PolicyContext): Promise<AuthorizationResult> {
    const beforeResult = this.before(ctx);
    if (beforeResult === true) {
      return { allowed: true, reason: 'Super admin bypass', step: 'policy.before' };
    }
    if (beforeResult === false) {
      return { allowed: false, reason: 'Denied by before hook', step: 'policy.before' };
    }

    const method = (this as unknown as Record<string, unknown>)[action];
    if (typeof method !== 'function') {
      return {
        allowed: false,
        reason: `No policy method defined for action: ${action}`,
        step: 'policy.method',
      };
    }

    return (method as (ctx: PolicyContext) => Promise<AuthorizationResult>).call(this, ctx);
  }

  protected isOwner(ctx: PolicyContext, ownerField = 'userId'): boolean {
    const resource = ctx.resource;
    if (!resource) return false;
    return resource[ownerField] === ctx.user.id;
  }

  protected hasState(ctx: PolicyContext, field: string, ...allowedStates: string[]): boolean {
    const resource = ctx.resource;
    if (!resource) return false;
    return allowedStates.includes(resource[field] as string);
  }

  protected sameDepartment(ctx: PolicyContext): boolean {
    const resource = ctx.resource;
    if (!resource || !ctx.user.departmentId) return false;
    return resource['departmentId'] === ctx.user.departmentId;
  }

  protected isBusinessHours(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }
}
