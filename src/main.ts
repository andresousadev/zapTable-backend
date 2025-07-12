import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const logger = new Logger('Main.ts', {
  timestamp: true,
});

async function bootstrap() {
  logger.log(
    `operation='bootstrap', message='Started bootstrap of application', environment='${process.env.NODE_ENV}'`,
  );

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: process.env.NODE_ENV === 'production',
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();
  app.enableCors({
    // TODO set env variable for origin in production
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.use(cookieParser());

  // Enable swaggerUI for local and dev environments
  // Access at localhost:3000/swaggerui
  if (['local', 'development'].includes(process.env.NODE_ENV!)) {
    logger.log(`operation='bootstrap', message='Enabled swagger ui'`);

    const config = new DocumentBuilder()
      .setTitle('Zap Table BE API')
      .setDescription('Zap Table Management API')
      .setVersion('1.0')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-ui', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
