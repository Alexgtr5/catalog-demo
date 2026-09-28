import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const reply = http.getResponse<FastifyReply>();
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.log(request, reply.statusCode, startedAt),
        error: () => this.log(request, undefined, startedAt),
      }),
    );
  }

  private log(request: FastifyRequest, status: number | undefined, startedAt: number): void {
    const duration = Date.now() - startedAt;
    const outcome = status === undefined ? 'error' : String(status);
    this.logger.log(`${request.method} ${request.url} → ${outcome} за ${duration} мс [${request.id}]`);
  }
}
