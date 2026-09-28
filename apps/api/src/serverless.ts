import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createApp } from './bootstrap.js';

// Тёплый инстанс переиспользуется между вызовами, холодный старт стоит один раз.
let started: Promise<Server> | undefined;

async function start(): Promise<Server> {
  // Без урезания уровня каждый холодный старт печатал бы всю карту маршрутов.
  const app = await createApp({ logger: ['error', 'warn'] });
  await app.init();

  const fastify = app.getHttpAdapter().getInstance();
  await fastify.ready();

  return fastify.server;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const server = await (started ??= start());

  server.emit('request', req, res);
}
