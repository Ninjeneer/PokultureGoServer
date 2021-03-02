export interface AppErrorContent {
  code?: number;
  message?: string;
  stack?: any;
}

export class AppError extends Error {
  private code?: number;
  public message;

  constructor(e: AppErrorContent) {
    super(e.message);
    this.name = "AppError";
    this.message = e.message;
    this.code = e.code;
    this.stack = e.stack;
  }
}

export enum Errors {
  UNRECOGNIZED_IMAGE = 'UnrecognizedImage',
  TOO_FAR_FROM_POI = 'TooFarFromPOI'
}