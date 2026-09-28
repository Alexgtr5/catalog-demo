import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createApp } from './bootstrap.js';
import { Environment } from './config/environment.js';

async function main(): Promise<void> {
  const app = await createApp();
  const config = app.get(ConfigService<Environment, true>);
  const port = config.get('PORT', { infer: true });
  const host = config.get('HOST', { infer: true });

  await app.listen(port, host);

  new Logger('Bootstrap').log(`API слушает ${await app.getUrl()}`);
}

void main();
