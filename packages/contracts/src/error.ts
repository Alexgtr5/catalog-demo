export type ApiErrorResponse = {
  statusCode: number;
  error: string;
  message: string[];
  requestId: string;
  path: string;
  timestamp: string;
};
