export class BadRequestException {
  status = 400;
  error_code;
  error_description;

  constructor(errorCode: string, errorDescription: string) {
    this.error_code = errorCode;
    this.error_description = errorDescription;
  }
}
