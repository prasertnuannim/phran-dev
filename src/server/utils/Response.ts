import { ApiError, ApiSuccess, ErrorLike } from "@/types/response";

export const ok = <T>(data: T): ApiSuccess<T> => ({
  ok: true,
  data,
});

export const fail = (error: ErrorLike): ApiError => ({
  ok: false,
  error: error.message,
  type: error.type ?? error.code,
  code: error.code,
  status: error.status,
});
