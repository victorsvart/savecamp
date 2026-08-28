import type { ApiResponse } from "@savecamp/types";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z } from "zod";

export class HttpError extends Error {
  status: ContentfulStatusCode;

  constructor(status: ContentfulStatusCode, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export function parse<S extends z.ZodType>(
  schema: S,
  data: unknown
): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpError(
      400,
      result.error.issues[0]?.message ?? "Invalid request"
    );
  }
  return result.data;
}

export function ok<T>(c: Context, body: T, message: string | null = null) {
  return c.json<ApiResponse<T>>({
    message,
    data: body,
    error: null,
  });
}

export function error(c: Context, err: unknown) {
  const httpError = toHttpError(err);
  return c.json<ApiResponse<null>>(
    {
      message: null,
      data: null,
      error: { message: httpError.message },
    },
    httpError.status
  );
}

export function toHttpError(error: unknown): HttpError {
  if (isHttpError(error)) {
    return error;
  }

  const status = smithyStatus(error);
  if (isHttpStatus(status)) {
    return new HttpError(status, errorMessage(error));
  }

  return new HttpError(500, errorMessage(error));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Internal server error";
}

function isHttpStatus(status: number | undefined): status is ContentfulStatusCode {
  return status != null && status >= 400 && status <= 599;
}

function smithyStatus(error: unknown): number | undefined {
  const status = metadataStatus(error);
  if (status != null) {
    return status;
  }
  if (isNotFoundName(error)) {
    return 404;
  }
  return undefined;
}

function metadataStatus(error: unknown): number | undefined {
  if (!isRecord(error) || !isRecord(error.$metadata)) {
    return undefined;
  }

  const status = error.$metadata.httpStatusCode;
  return typeof status === "number" ? status : undefined;
}

function isNotFoundName(error: unknown): boolean {
  if (!isRecord(error)) {
    return false;
  }
  return error.name === "NotFound" || error.name === "NoSuchKey";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}
