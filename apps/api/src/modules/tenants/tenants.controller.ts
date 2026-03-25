import type { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS, createTenantDto, updateTenantDto, paginationSchema } from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { TenantsService } from './tenants.service.js';

const isPrismaError = (error: unknown, code: string): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code: unknown }).code === code;

/**
 * Handles HTTP request/response lifecycle for tenant management endpoints.
 * Uses the global Prisma client (not tenant-scoped) since tenants
 * are cross-tenant entities.
 */
export class TenantsController {
  private readonly service = new TenantsService();

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid query parameters',
        parsed.error.flatten().fieldErrors,
      );
    }

    const result = await this.service.list(parsed.data);
    return sendSuccess(reply, result.data, HTTP_STATUS.OK, result.meta);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const tenant = await this.service.getById(id);

    if (!tenant) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Tenant not found');
    }

    return sendSuccess(reply, tenant);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsed = createTenantDto.safeParse(req.body);
      if (!parsed.success) {
        return sendError(
          reply,
          HTTP_STATUS.UNPROCESSABLE,
          'VALIDATION_ERROR',
          'Invalid request body',
          parsed.error.flatten().fieldErrors,
        );
      }

      const tenant = await this.service.create(parsed.data);
      return sendSuccess(reply, tenant, HTTP_STATUS.CREATED);
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        return sendError(
          reply,
          HTTP_STATUS.CONFLICT,
          'CONFLICT',
          'A tenant with this slug already exists',
        );
      }
      throw error;
    }
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };
      const parsed = updateTenantDto.safeParse(req.body);
      if (!parsed.success) {
        return sendError(
          reply,
          HTTP_STATUS.UNPROCESSABLE,
          'VALIDATION_ERROR',
          'Invalid request body',
          parsed.error.flatten().fieldErrors,
        );
      }

      const existing = await this.service.getById(id);
      if (!existing) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Tenant not found');
      }

      const tenant = await this.service.update(id, parsed.data);
      return sendSuccess(reply, tenant);
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        return sendError(
          reply,
          HTTP_STATUS.CONFLICT,
          'CONFLICT',
          'A tenant with this slug already exists',
        );
      }
      if (isPrismaError(error, 'P2025')) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Tenant not found');
      }
      throw error;
    }
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = req.params as { id: string };

      const existing = await this.service.getById(id);
      if (!existing) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Tenant not found');
      }

      await this.service.delete(id);
      return sendSuccess(reply, { message: 'Tenant deleted successfully' });
    } catch (error) {
      if (isPrismaError(error, 'P2025')) {
        return sendError(reply, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND', 'Tenant not found');
      }
      throw error;
    }
  };
}
