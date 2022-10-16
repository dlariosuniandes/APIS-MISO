import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const API_VERSION = process.env.API_VERSION || '1';
const API_PREFIX = process.env.API_PREFIX || 'api/v';
const ENABLE_SWAGGER = process.env.ENABLE_SWAGGER || 'false';
const API_PORT = process.env.API_PORT || '3000';

const addSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Cultures API')
    .setDescription('culinary culture of the world')
    .setVersion(API_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    `${API_PREFIX}${API_VERSION}/documentation`,
    app,
    document,
  );
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: API_PREFIX,
    defaultVersion: API_VERSION,
  });

  if (ENABLE_SWAGGER === 'true') {
    addSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Number(API_PORT));
}
bootstrap();
