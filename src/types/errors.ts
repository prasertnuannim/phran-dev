export interface AppError {
  isAppError: true;
  code: string;
  message: string;
  status: number;
}

export type AnyError = AppError | (Error & { status?: number; code?: string });
