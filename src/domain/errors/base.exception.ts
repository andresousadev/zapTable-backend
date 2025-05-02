export abstract class BaseException extends Error {
  public statusCode: number;
  public name: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = new.target.name;
  }
}
