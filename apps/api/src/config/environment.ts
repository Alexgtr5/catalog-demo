import { Type, plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class Environment {
  @IsOptional()
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsOptional()
  @IsString()
  HOST: string = '0.0.0.0';

  // Список источников через запятую; `*` открывает CORS всем — только для локальной работы.
  @IsOptional()
  @IsString()
  CORS_ORIGIN: string = 'http://localhost:5173';

  @IsOptional()
  @IsString()
  API_PREFIX: string = 'api';
}

export function validateEnvironment(raw: Record<string, unknown>): Environment {
  const environment = plainToInstance(Environment, raw, { exposeDefaultValues: true });
  const errors = validateSync(environment, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ');
    throw new Error(`Некорректные переменные окружения: ${details}`);
  }

  return environment;
}
