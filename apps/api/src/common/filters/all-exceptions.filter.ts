import type { ApiErrorResponse } from '@catalog/contracts';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { DomainError, EntityNotFoundError } from '../errors/domain.error.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const reply = http.getResponse<FastifyReply>();

    const { status, messages } = this.describe(exception);

    const body: ApiErrorResponse = {
      statusCode: status,
      error: HttpStatus[status] ?? 'ERROR',
      message: messages,
      requestId: request.id,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} → ${status} [${request.id}]`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    void reply.status(status).send(body);
  }

  private describe(exception: unknown): { status: number; messages: string[] } {
    if (exception instanceof HttpException) {
      return { status: exception.getStatus(), messages: extractMessages(exception.getResponse()) };
    }

    if (exception instanceof EntityNotFoundError) {
      return { status: HttpStatus.NOT_FOUND, messages: [exception.message] };
    }

    if (exception instanceof DomainError) {
      return { status: HttpStatus.UNPROCESSABLE_ENTITY, messages: [exception.message] };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      messages: ['Внутренняя ошибка сервера'],
    };
  }
}

function extractMessages(response: string | object): string[] {
  if (typeof response === 'string') {
    return [response];
  }

  const message = (response as { message?: unknown }).message;

  if (Array.isArray(message)) {
    return message.map(String);
  }

  return [typeof message === 'string' ? message : 'Ошибка запроса'];
}
