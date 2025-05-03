// src/types/express.ts
import { Request } from 'express';

export interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
    [key: string]: any;
  };
}
