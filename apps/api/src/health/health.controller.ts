import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

const HEAP_LIMIT_BYTES = 512 * 1024 * 1024;

@ApiTags('health')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get('live')
  @ApiOkResponse({ description: 'Процесс жив и принимает соединения' })
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOkResponse({ description: 'Зависимости готовы обслуживать запросы' })
  ready() {
    return this.health.check([() => this.memory.checkHeap('memory_heap', HEAP_LIMIT_BYTES)]);
  }
}
