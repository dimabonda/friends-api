import { Request } from 'koa';

declare module 'koa' {
  interface Request {
    files: { [key: string]: any };
  }
}