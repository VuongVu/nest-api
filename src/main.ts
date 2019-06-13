import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.use(helmet());
  app.use(
    new rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100,
    }),
  );
  await app.listen(3000);
}
bootstrap();
