import {
  type SaveGetResponse,
  type SaveUploadAbortRequest,
  type SaveUploadAbortResponse,
  type SaveUploadCompleteRequest,
  type SaveUploadCompleteResponse,
  type SaveUploadRequest,
  type SaveUploadResponse,
} from "@savecamp/types";
import { Hono } from "hono";
import { ok } from "../../lib/http.js";
import {
  abortSaveUpload,
  completeSaveUpload,
  createSaveUpload,
  getSaves,
} from "./functions.js";

export const savesRoutes = new Hono();

savesRoutes.get("/:gameName", async (c) => {
  const gameName = c.req.param("gameName");
  const result = await getSaves(gameName);
  return ok<SaveGetResponse>(c, result);
});

savesRoutes.post("/uploads", async (c) => {
  const body = await c.req.json<SaveUploadRequest>();
  const result = await createSaveUpload(body);
  return ok<SaveUploadResponse>(c, result);
});

savesRoutes.post("/uploads/complete", async (c) => {
  const body = await c.req.json<SaveUploadCompleteRequest>();
  const result = await completeSaveUpload(body);
  return ok<SaveUploadCompleteResponse>(c, result);
});

savesRoutes.post("/uploads/abort", async (c) => {
  const body = await c.req.json<SaveUploadAbortRequest>();
  const result = await abortSaveUpload(body);
  return ok<SaveUploadAbortResponse>(c, result);
});
