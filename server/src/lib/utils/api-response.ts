export class ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;

  constructor(statusCode: number, data: T | null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success<T>(
    data: T,
    message = "Success",
    statusCode = 200,
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, data, message);
  }

  static error<T>(
    message = "Error",
    statusCode = 500,
    data: T | null = null,
  ): ApiResponse<T> {
    return new ApiResponse(statusCode, data, message);
  }
}
