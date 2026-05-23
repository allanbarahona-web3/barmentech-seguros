import type { Request as ExpressRequest } from 'express';

/**
 * Extended Express Request with authenticated user
 */
export interface RequestWithUser extends ExpressRequest {
  user: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}

/**
 * Re-export Multer File type for proper decorator metadata
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MulterTypes {
  export type File = Express.Multer.File;
}
