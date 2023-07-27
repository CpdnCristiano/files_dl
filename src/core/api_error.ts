export class ApiError extends Error {
  public readonly message: string;
  public readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.message = message;
    this.code = code;
  }
}
