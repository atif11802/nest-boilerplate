import { HttpStatus } from '@nestjs/common';
import { BaseResponse } from './base-response';
import { ResponseStatus } from './response-status.enum';

export class GeneralApiResponse extends BaseResponse {
  constructor({
    code = HttpStatus.OK,
    status = ResponseStatus.SUCCESS,
    msg = null,
    data = null,
  }) {
    super(code, status, msg, data);
  }
}
