import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ConfigService } from './config/config.service';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AllExceptionsFilter } from './common/exception/all-exceptions.filter';
import { MyExceptionFilter } from './common/exception/my-exception.filter';
import { GlobalExceptionFilter } from './common/exception/global-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new MyExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const messageArr = validationErrors.map((error) => {
          const constraints =
            error.constraints ||
            error.children?.[0]?.children?.[0]?.constraints;

          const str = constraints ? Object.values(constraints).join(', ') : '';
          const msg = str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

          return msg;
        });

        return new BadRequestException({
          msg: messageArr ? messageArr?.join(' ,') : 'Bad Request',
          code: HttpStatus.BAD_REQUEST,
          status: 'failed',
        });
      },
    }),
  );

  const configService = app.get(ConfigService);

  await app.listen(configService.get('servicePort') || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
