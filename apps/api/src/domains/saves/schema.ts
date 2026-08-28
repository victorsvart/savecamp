import type {
  SaveUploadAbortRequest,
  SaveUploadCompleteRequest,
  SaveUploadRequest,
} from "@savecamp/types";
import { z } from "zod";

export const saveUploadRequest: z.ZodType<SaveUploadRequest> = z.object({
  gameName: z.string().min(1),
  contentHash: z.string().min(1),
  contentLength: z.number().positive(),
  contentType: z.string().min(1),
});

export const saveUploadCompleteRequest: z.ZodType<SaveUploadCompleteRequest> =
  z.object({
    key: z.string().min(1),
    uploadId: z.string().min(1),
    parts: z
      .array(
        z.object({
          partNumber: z.number().int().positive(),
          etag: z.string().min(1),
        })
      )
      .min(1),
  });

export const saveUploadAbortRequest: z.ZodType<SaveUploadAbortRequest> = z.object({
  key: z.string().min(1),
  uploadId: z.string().min(1),
});
