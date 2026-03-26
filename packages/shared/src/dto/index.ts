import { z } from 'zod';

export const paginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const createTenantDto = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
  domain: z.string().optional(),
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']).default('free'),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const updateTenantDto = createTenantDto.partial();

export const createUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  roleIds: z.array(z.string()).optional(),
  practiceName: z.string().min(2).max(100).optional(),
});

export const updateUserDto = createUserDto
  .omit({ password: true })
  .partial()
  .extend({
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  });

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createRoleDto = z.object({
  name: z.string().min(2).max(50),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9_]+$/),
  description: z.string().max(255).optional(),
  permissionIds: z.array(z.string()).optional(),
});

export const updateRoleDto = createRoleDto.partial();

export const assignPermissionsDto = z.object({
  permissionIds: z.array(z.string()).min(1),
});

export const userPermissionOverrideDto = z.object({
  permissionId: z.string(),
  type: z.enum(['grant', 'deny']),
  expiresAt: z.string().datetime().optional(),
});

export const createDepartmentDto = z.object({
  name: z.string().min(2).max(100),
  parentId: z.string().nullable().optional(),
  headUserId: z.string().nullable().optional(),
});

export const updateDepartmentDto = createDepartmentDto.partial();

export const createTeamDto = z.object({
  name: z.string().min(2).max(100),
  departmentId: z.string(),
  leadUserId: z.string().nullable().optional(),
});

export const updateTeamDto = createTeamDto.partial();

export const createFeatureFlagDto = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9_-]+$/),
  isEnabled: z.boolean().default(false),
  conditions: z.record(z.string(), z.unknown()).optional(),
});

export const updateFeatureFlagDto = createFeatureFlagDto.partial();

export type CreateTenantDto = z.infer<typeof createTenantDto>;
export type UpdateTenantDto = z.infer<typeof updateTenantDto>;
export type CreateUserDto = z.infer<typeof createUserDto>;
export type UpdateUserDto = z.infer<typeof updateUserDto>;
export type LoginDto = z.infer<typeof loginDto>;
export type CreateRoleDto = z.infer<typeof createRoleDto>;
export type UpdateRoleDto = z.infer<typeof updateRoleDto>;
export type AssignPermissionsDto = z.infer<typeof assignPermissionsDto>;
export type UserPermissionOverrideDto = z.infer<typeof userPermissionOverrideDto>;
export type CreateDepartmentDto = z.infer<typeof createDepartmentDto>;
export type UpdateDepartmentDto = z.infer<typeof updateDepartmentDto>;
export type CreateTeamDto = z.infer<typeof createTeamDto>;
export type UpdateTeamDto = z.infer<typeof updateTeamDto>;
export type CreateFeatureFlagDto = z.infer<typeof createFeatureFlagDto>;
export type UpdateFeatureFlagDto = z.infer<typeof updateFeatureFlagDto>;
// --- Patients ---
export const createPatientDto = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.string().max(20).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().max(50).optional(),
  address: z.string().optional(),
  bloodGroup: z.string().max(10).optional(),
  notes: z.string().optional(),
  status: z.string().default('active'),
});

export const updatePatientDto = createPatientDto.partial();

// --- Appointments ---
export const createAppointmentDto = z.object({
  patientId: z.string().uuid(),
  dentistId: z.string().uuid(),
  type: z.string().min(1).max(50),
  status: z.string().default('scheduled'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateAppointmentDto = createAppointmentDto.partial();

// --- Treatment / Charting ---
export const createTreatmentChartDto = z.object({
  patientId: z.string().uuid(),
  dentistId: z.string().uuid(),
  toothNumber: z.string().max(10).optional(),
  procedure: z.string().min(1).max(255),
  description: z.string().optional(),
  status: z.string().default('planned'),
  cost: z.number().optional(),
  performedAt: z.string().datetime().optional(),
});

export const updateTreatmentChartDto = createTreatmentChartDto.partial();

// --- Billing ---
export const createInvoiceDto = z.object({
  patientId: z.string().uuid(),
  status: z.string().default('pending'),
  subtotal: z.number().min(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().min(0),
  dueDate: z.string().datetime(),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().int().min(1).default(1),
        unitPrice: z.number().min(0),
        total: z.number().min(0),
      }),
    )
    .min(1),
});

export const updateInvoiceDto = createInvoiceDto.partial();

export const createPaymentDto = z.object({
  amount: z.number().min(0),
  method: z.string().min(1),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

// --- Inventory ---
export const createInventoryItemDto = z.object({
  name: z.string().min(1).max(100),
  sku: z.string().min(1).max(50),
  category: z.string().min(1).max(50),
  unit: z.string().min(1).max(20),
  quantity: z.number().int().default(0),
  minQuantity: z.number().int().default(10),
  costPrice: z.number().min(0).optional(),
  supplier: z.string().optional(),
});

export const updateInventoryItemDto = createInventoryItemDto.partial();

export const createStockTransactionDto = z.object({
  type: z.enum(['in', 'out']),
  quantity: z.number().int().min(1),
  reason: z.string().optional(),
});

export type CreatePatientDto = z.infer<typeof createPatientDto>;
export type UpdatePatientDto = z.infer<typeof updatePatientDto>;
export type CreateAppointmentDto = z.infer<typeof createAppointmentDto>;
export type UpdateAppointmentDto = z.infer<typeof updateAppointmentDto>;
export type CreateTreatmentChartDto = z.infer<typeof createTreatmentChartDto>;
export type UpdateTreatmentChartDto = z.infer<typeof updateTreatmentChartDto>;
export type CreateInvoiceDto = z.infer<typeof createInvoiceDto>;
export type UpdateInvoiceDto = z.infer<typeof updateInvoiceDto>;
export type CreatePaymentDto = z.infer<typeof createPaymentDto>;
export type CreateInventoryItemDto = z.infer<typeof createInventoryItemDto>;
export type UpdateInventoryItemDto = z.infer<typeof updateInventoryItemDto>;
export type CreateStockTransactionDto = z.infer<typeof createStockTransactionDto>;

export type PaginationDto = z.infer<typeof paginationSchema>;

export const forgotPasswordDto = z.object({
  email: z.string().email(),
});

export const resetPasswordDto = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
