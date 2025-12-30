export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Example type definition for an environment variable
      NEXT_PUBLIC_USER_POOL_ID: string;
      NEXT_PUBLIC_USER_POOL_CLIENT_ID: string;
    }
  }
}
