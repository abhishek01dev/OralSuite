import type { FastifyRequest, FastifyReply } from 'fastify';
import type { AuthorizationPipeline } from '@repo/rbac';
import { HTTP_STATUS } from '@repo/shared';
import { sendError } from '../utils/response.js';

/**
 * Creates a Fastify preHandler that checks if the authenticated user
 * has the required permission via the 6-step authorization pipeline.
 */
export const requirePermission = (
  permission: string,
  resource?: string,
  getResourceData?: (req: FastifyRequest) => Promise<Record<string, unknown> | undefined>,
) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const pipeline = (req.server as unknown as Record<string, unknown>)[
      'authPipeline'
    ] as AuthorizationPipeline;

    const resourceData = getResourceData ? await getResourceData(req) : undefined;

    const result = await pipeline.authorize(
      req.userId,
      req.tenantId,
      permission,
      resource,
      resourceData,
    );

    if (!result.allowed) {
      return sendError(
        reply,
        HTTP_STATUS.FORBIDDEN,
        'FORBIDDEN',
        result.reason ?? 'Access denied',
        { step: result.step },
      );
    }
  };
};
