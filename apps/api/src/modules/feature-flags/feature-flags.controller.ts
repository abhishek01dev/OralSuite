import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  createFeatureFlagDto,
  updateFeatureFlagDto,
  paginationSchema,
  HTTP_STATUS,
} from '@repo/shared';
import { sendSuccess, sendError } from '@utils/response.js';
import { FeatureFlagsService } from './feature-flags.service.js';
import type { FeatureFlagCacheClient } from './feature-flags.service.js';

interface IdParam {
  id: string;
}

export class FeatureFlagsController {
  private readonly service: FeatureFlagsService;

  constructor(cache: FeatureFlagCacheClient) {
    this.service = new FeatureFlagsService(cache);
  }

  list = async (req: FastifyRequest, reply: FastifyReply) => {
    const params = paginationSchema.parse(req.query);
    const result = await this.service.list(req.tenantId, params);
    return sendSuccess(reply, result);
  };

  getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const flag = await this.service.getById(req.tenantId, id);

    if (!flag) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'FLAG_NOT_FOUND', 'Feature flag not found');
    }

    return sendSuccess(reply, flag);
  };

  create = async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = createFeatureFlagDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid feature flag data',
        parsed.error.flatten(),
      );
    }

    const { slug, name, isEnabled, conditions } = parsed.data;

    const existing = await this.service.findBySlug(req.tenantId, slug);
    if (existing) {
      return sendError(
        reply,
        HTTP_STATUS.CONFLICT,
        'SLUG_EXISTS',
        `Feature flag with slug "${slug}" already exists`,
      );
    }

    const flag = await this.service.create(req.tenantId, { slug, name, isEnabled, conditions });
    return sendSuccess(reply, flag, HTTP_STATUS.CREATED);
  };

  update = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;
    const parsed = updateFeatureFlagDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(
        reply,
        HTTP_STATUS.UNPROCESSABLE,
        'VALIDATION_ERROR',
        'Invalid feature flag data',
        parsed.error.flatten(),
      );
    }

    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'FLAG_NOT_FOUND', 'Feature flag not found');
    }

    const { slug, conditions, ...rest } = parsed.data;

    if (slug && slug !== existing.slug) {
      const slugTaken = await this.service.findBySlug(req.tenantId, slug);
      if (slugTaken) {
        return sendError(
          reply,
          HTTP_STATUS.CONFLICT,
          'SLUG_EXISTS',
          `Feature flag with slug "${slug}" already exists`,
        );
      }
    }

    const data: Record<string, unknown> = {
      ...rest,
      ...(slug !== undefined && { slug }),
      ...(conditions !== undefined && { conditions }),
    };

    const flag = await this.service.update(req.tenantId, id, data, existing.slug);
    return sendSuccess(reply, flag);
  };

  delete = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;

    const existing = await this.service.getById(req.tenantId, id);
    if (!existing) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'FLAG_NOT_FOUND', 'Feature flag not found');
    }

    await this.service.delete(req.tenantId, id, existing.slug);
    return sendSuccess(reply, { id });
  };

  toggle = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as IdParam;

    const flag = await this.service.toggle(req.tenantId, id);
    if (!flag) {
      return sendError(reply, HTTP_STATUS.NOT_FOUND, 'FLAG_NOT_FOUND', 'Feature flag not found');
    }

    return sendSuccess(reply, flag);
  };
}
