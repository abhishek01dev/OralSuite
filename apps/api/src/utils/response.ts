import type { FastifyReply } from 'fastify';
import type { ApiResponse } from '@repo/shared';
import { HTTP_STATUS } from '@repo/shared';

export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * Sends a standardised success response conforming to the ApiResponse contract.
 */
export const sendSuccess = <T>(
  reply: FastifyReply,
  data: T,
  status: HttpStatus = HTTP_STATUS.OK,
  meta?: Record<string, unknown>,
): FastifyReply => {
  const payload: ApiResponse<T> = { success: true, data };
  if (meta) payload.meta = meta;
  return reply.status(status).send(payload);
};

/**
 * Sends a standardised error response conforming to the ApiResponse contract.
 */
export const sendError = (
  reply: FastifyReply,
  status: HttpStatus | number,
  code: string,
  message: string,
  details?: unknown,
): FastifyReply => {
  return reply.status(status).send({
    success: false,
    error: { code, message, ...(details !== undefined ? { details } : {}) },
  } satisfies ApiResponse);
};
