export interface PolicyContext {
  user: {
    id: string;
    tenantId: string;
    permissions: Set<string>;
    roles: string[];
    departmentId?: string;
  };
  resource?: Record<string, unknown>;
  action: string;
  tenantId: string;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  step?: string;
}

export interface PermissionSet {
  granted: Set<string>;
  denied: Set<string>;
}
