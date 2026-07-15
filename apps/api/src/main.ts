import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('api.prefix') ?? 'api';
  const apiVersion = configService.get<string>('api.version') ?? '1';
  const port = configService.get<number>('port') ?? 3001;

  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(port);

  console.log(
    `🚀 API running on http://localhost:${port}/${apiPrefix}/v${apiVersion}`,
  );
}
void bootstrap();
