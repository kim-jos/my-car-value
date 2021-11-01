import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // strips away everything that isn't expected (POST /signup)
  //     // e.g. if email & password is required it ignores everything else.
  //     // security reason: someone can add admin: true which would be bad
  //     whitelist: true
  //   })
  // )
  await app.listen(3000);
}
bootstrap();
