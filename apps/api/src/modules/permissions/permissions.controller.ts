import type { FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess } from '@utils/response.js';
import { PermissionsService } from './permissions.service.js';

/**
 * Handles read-only operations for the global permissions and modules tables.
 * Permissions are not tenant-scoped—they define the full set of actions
 * available across all tenants.
 */
export class PermissionsController {
  private service = new PermissionsService();

  listGroupedByModule = async (_req: FastifyRequest, reply: FastifyReply) => {
    const grouped = await this.service.listGroupedByModule();
    return sendSuccess(reply, grouped);
  };

  listModules = async (_req: FastifyRequest, reply: FastifyReply) => {
    const modules = await this.service.listModules();
    return sendSuccess(reply, modules);
  };
}
