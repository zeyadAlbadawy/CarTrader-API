import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // whitelist means any additonal property will be stripped out
  app.use(
    cookieSession({
      keys: ['123'],
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
