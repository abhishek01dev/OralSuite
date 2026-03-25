import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { HTTP_STATUS } from '@repo/shared';
import { sendError } from '@utils/response.js';

export const errorHandler = (error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
  req.log.error(error);

  if (error.validation) {
    return sendError(
      reply,
      HTTP_STATUS.UNPROCESSABLE,
      'VALIDATION_ERROR',
      'Request validation failed',
      error.validation,
    );
  }

  if (error.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS) {
    return sendError(
      reply,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again later.',
    );
  }

  const statusCode = error.statusCode ?? HTTP_STATUS.INTERNAL_ERROR;

  return sendError(
    reply,
    statusCode,
    error.code ?? 'INTERNAL_ERROR',
    statusCode === HTTP_STATUS.INTERNAL_ERROR ? 'An internal server error occurred' : error.message,
  );
};
