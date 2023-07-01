export abstract class BaseResponse {
  code: number;
  status: string;
  msg: string;
  data?: any;

  constructor(code: number, status: string, msg: string, data: any) {
    this.code = code;
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}
