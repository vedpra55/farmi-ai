export interface ApiResponseShape<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}
