export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: string;
  type?: string;
  code?: string;
  status?: number;
}

export type ErrorLike = {
  message: string;
  status?: number;
  code?: string;
  type?: string;
};
