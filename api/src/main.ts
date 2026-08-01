import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from './config/swagger.js';
import { origensPermitidas } from './config/cors.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { httpLogger } from './common/middleware/http-logger.js';
import { LoggerCustom } from './infra/logger/logger.service.js';

async function bootstrap() {
  const port = process.env.PORT;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  const logger = new LoggerCustom().definirContexto('APP');

  app.enableShutdownHooks();

  app.use(httpLogger);

  setupSwagger(app);

  app.enableCors({
    origin: origensPermitidas(),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (erros) => new BadRequestException(erros),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port ?? 5000);
  logger.debug(`API ON em http://localhost:${port}`);
}
void bootstrap();
