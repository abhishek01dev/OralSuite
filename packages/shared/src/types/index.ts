export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  tenantPlan: string;
}

export interface AuthenticatedUser {
  id: string;
  tenantId: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface PaginationParams {
  cursor?: string;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    cursor: string | null;
    hasMore: boolean;
    total?: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type PermissionString = `${string}.${PermissionAction}`;

export interface Permission {
  id: string;
  name: PermissionString;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
}

export interface UserPermissionOverride {
  permissionId: string;
  permissionName: PermissionString;
  type: 'grant' | 'deny';
  expiresAt: Date | null;
}

export type TenantStatus = 'active' | 'suspended' | 'pending';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type SubscriptionPlan = 'free' | 'starter' | 'professional' | 'enterprise';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';
