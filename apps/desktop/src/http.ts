import type { ApiResponse } from "@savecamp/types";

export function getApiUrl(): string {
  return process.env.SAVECAMP_API_URL ?? "http://localhost:3000";
}

export function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.SAVECAMP_API_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }
  return headers;
}

export async function readApiData<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || body.error || body.data == null) {
    throw new Error(
      `${fallbackMessage}: ${body.error?.message ?? response.status}`
    );
  }
  return body.data;
}
