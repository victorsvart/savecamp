export type AppId = "web" | "desktop" | "api";

export const GAMES: string[] = ["Minecraft", "BigWalk"];

export type GameSearchResult = {
  basePath: string;
  paths: string[];
  error: Error | null;
};

export type SaveGameStateResult = {
  savedTo: string | null;
  error: Error | null;
};

export type SaveUploadRequest = {
  gameName: string;
  contentHash: string;
  contentLength: number;
  contentType: string;
};

export type SaveUploadPart = {
  partNumber: number;
  url: string;
};

export type SaveUploadExistsResponse = {
  mode: "exists";
  key: string;
};

export type SaveUploadPutResponse = {
  mode: "put";
  key: string;
  url: string;
  headers: Record<string, string>;
};

export type SaveUploadMultipartResponse = {
  mode: "multipart";
  key: string;
  uploadId: string;
  partSize: number;
  parts: SaveUploadPart[];
};

export type SaveUploadResponse =
  | SaveUploadExistsResponse
  | SaveUploadPutResponse
  | SaveUploadMultipartResponse;

export type SaveUploadCompletePart = {
  partNumber: number;
  etag: string;
};

export type SaveUploadCompleteRequest = {
  key: string;
  uploadId: string;
  parts: SaveUploadCompletePart[];
};

export type SaveUploadAbortRequest = {
  key: string;
  uploadId: string;
};
