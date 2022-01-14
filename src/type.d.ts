import { Account } from '@prisma/client';

declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    stage: 'dev' | 'prod';
    host: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    NCP_ID: string;
    NCP_SECRET_KEY: string;
    NCP_ACCESS_KEY: string;
    [key: string]: string | undefined;
  }
}


declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface AuthInfo { }
    // tslint:disable-next-line:no-empty-interface
    interface User extends Account { }

    interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;

      // These declarations are merged into express's Request type
      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;

      logout(): void;
      logOut(): void;

      isAuthenticated(): this is AuthenticatedRequest;
      isUnauthenticated(): this is UnauthenticatedRequest;
    }

    interface AuthenticatedRequest extends Request {
      user: User;
    }

    interface UnauthenticatedRequest extends Request {
      user?: undefined;
    }
  }
}