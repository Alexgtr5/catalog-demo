import { randomUUID } from 'node:crypto';
import helmet from '@fastify/helmet';
import { NestApplicationOptions, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { Environment, NodeEnv } from './config/environment.js';

/**
 * Сборка приложения вынесена из точки входа, чтобы её переиспользовали
 * и локальный запуск, и e2e-тесты, и будущая обёртка для serverless.
 */
export async function createApp(
  options: NestApplicationOptions = {},
): Promise<NestFastifyApplication> {
  const adapter = new FastifyAdapter({ genReqId: () => randomUUID() });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, options);
  const config = app.get(ConfigService<Environment, true>);

  app.setGlobalPrefix(config.get('API_PREFIX', { infer: true }));
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableShutdownHooks();

  await app.register(helmet, { contentSecurityPolicy: false });

  const origins = config
    .get('CORS_ORIGIN', { infer: true })
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: origins.includes('*') ? true : origins });

  if (config.get('NODE_ENV', { infer: true }) !== NodeEnv.Production) {
    setupSwagger(app);
  }

  return app;
}

function setupSwagger(app: NestFastifyApplication): void {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Каталог товаров — API')
      .setDescription('Сервис каталога: список товаров, фильтрация и карточка товара')
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('docs', app, document);
}
