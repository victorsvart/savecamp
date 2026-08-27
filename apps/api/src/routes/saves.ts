import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  HeadObjectCommand,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  SaveUploadAbortRequest,
  SaveUploadCompleteRequest,
  SaveUploadRequest,
  SaveUploadResponse,
} from "@savecamp/types";
import { Hono } from "hono";
import {
  buildSaveObjectKey,
  getR2Bucket,
  getS3Client,
  MULTIPART_THRESHOLD,
  PART_SIZE,
  PRESIGN_EXPIRES_IN,
} from "../r2.js";

function isNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const err = error as {
    name?: string;
    $metadata?: { httpStatusCode?: number };
  };

  return err.name === "NotFound" || err.$metadata?.httpStatusCode === 404;
}

export const savesRoutes = new Hono();

savesRoutes.post("/uploads", async (c) => {
  const body = await c.req.json<SaveUploadRequest>();
  const { gameName, contentHash, contentLength, contentType } = body;

  if (!gameName || !contentHash || !contentLength || !contentType) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const s3 = getS3Client();
  const bucket = getR2Bucket();
  const key = buildSaveObjectKey(gameName, contentHash);

  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    const response: SaveUploadResponse = { mode: "exists", key };
    return c.json(response);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  if (contentLength <= MULTIPART_THRESHOLD) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });
    const url = await getSignedUrl(s3, command, {
      expiresIn: PRESIGN_EXPIRES_IN,
    });
    const response: SaveUploadResponse = {
      mode: "put",
      key,
      url,
      headers: { "Content-Type": contentType },
    };
    return c.json(response);
  }

  const createResult = await s3.send(
    new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })
  );

  const uploadId = createResult.UploadId;
  if (!uploadId) {
    return c.json({ error: "Failed to create multipart upload" }, 500);
  }

  const partCount = Math.ceil(contentLength / PART_SIZE);
  const parts = await Promise.all(
    Array.from({ length: partCount }, async (_, index) => {
      const partNumber = index + 1;
      const command = new UploadPartCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });
      const url = await getSignedUrl(s3, command, {
        expiresIn: PRESIGN_EXPIRES_IN,
      });
      return { partNumber, url };
    })
  );

  const response: SaveUploadResponse = {
    mode: "multipart",
    key,
    uploadId,
    partSize: PART_SIZE,
    parts,
  };
  return c.json(response);
});

savesRoutes.post("/uploads/complete", async (c) => {
  const body = await c.req.json<SaveUploadCompleteRequest>();
  const { key, uploadId, parts } = body;

  if (!key || !uploadId || !parts?.length) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const s3 = getS3Client();
  const bucket = getR2Bucket();

  await s3.send(
    new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts
          .map((part) => ({
            PartNumber: part.partNumber,
            ETag: part.etag,
          }))
          .sort((a, b) => a.PartNumber - b.PartNumber),
      },
    })
  );

  return c.json({ key });
});

savesRoutes.post("/uploads/abort", async (c) => {
  const body = await c.req.json<SaveUploadAbortRequest>();
  const { key, uploadId } = body;

  if (!key || !uploadId) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const s3 = getS3Client();
  const bucket = getR2Bucket();

  await s3.send(
    new AbortMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
    })
  );

  return c.json({ ok: true });
});
