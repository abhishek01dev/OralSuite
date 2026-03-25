import type { BasePolicy } from './base-policy.js';
import type { PolicyContext, AuthorizationResult } from './types.js';

/**
 * Policy engine that manages and executes resource-specific policies.
 * Register policies per resource type, then call `evaluate` to run them.
 */
export class PolicyEngine {
  private policies: Map<string, BasePolicy> = new Map();

  register(resource: string, policy: BasePolicy): void {
    this.policies.set(resource, policy);
  }

  async evaluate(
    resource: string,
    action: string,
    ctx: PolicyContext,
  ): Promise<AuthorizationResult> {
    const policy = this.policies.get(resource);

    if (!policy) {
      return { allowed: true, reason: 'No policy registered for resource', step: 'policy' };
    }

    return policy.authorize(action, ctx);
  }

  hasPolicy(resource: string): boolean {
    return this.policies.has(resource);
  }
}
