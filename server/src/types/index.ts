export interface ApiResponseShape<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

// Extend Express Request to include uid from Clerk auth
declare global {
  namespace Express {
    interface Request {
      uid: string;
    }
  }
}
