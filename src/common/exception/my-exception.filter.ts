import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class MyExceptionFilter implements ExceptionFilter {
  logger: Logger;

  constructor() {
    this.logger = new Logger('MyExceptionFilter');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const { msg } = exception.getResponse() as { msg: string };

    response.status(status).json({
      msg: msg ? msg : exception.message,
      code: exception.getStatus(),
      status: 'failed',
    });

    this.logger.error(
      `HTTP ${status} ${request.method} ${request.url} ${
        msg ? msg : exception.message
      }`,
    );
  }
}
