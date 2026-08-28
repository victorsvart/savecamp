import type { ApiResponse } from "@savecamp/types";
import ky, { isHTTPError } from "ky";

function getApiUrl(): string {
  return import.meta.env.VITE_SAVECAMP_API_URL ?? "http://localhost:3000";
}

export const http = ky.create({
  prefix: `${getApiUrl()}/v1/`,
  retry: 3,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const secret = import.meta.env.VITE_SAVECAMP_API_SECRET;
        if (secret) {
          request.headers.set("Authorization", `Bearer ${secret}`);
        }
      },
    ],
    beforeError: [
      ({ error }) => {
        if (isHTTPError(error)) {
          const body = error.data as ApiResponse<unknown> | undefined;
          if (body?.error?.message) {
            error.message = body.error.message;
          }
        }
        return error;
      },
    ],
  },
});

export async function getData<T>(path: string): Promise<T> {
  const body = await http.get(path).json<ApiResponse<T>>();
  if (body.data == null) {
    throw new Error(body.error?.message ?? "Empty response");
  }
  return body.data;
}

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
