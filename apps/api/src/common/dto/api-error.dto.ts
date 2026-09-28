import type { ApiErrorResponse } from '@catalog/contracts';
import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorDto implements ApiErrorResponse {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'NOT_FOUND' })
  error: string;

  @ApiProperty({ type: [String], example: ['Товар с идентификатором «lp-99» не найден'] })
  message: string[];

  @ApiProperty({ description: 'Идентификатор запроса, он же в логах сервера' })
  requestId: string;

  @ApiProperty({ example: '/api/v1/products/lp-99' })
  path: string;

  @ApiProperty({ example: '2026-09-28T13:00:00.000Z' })
  timestamp: string;
}
