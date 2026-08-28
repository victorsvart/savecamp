import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
  SaveGetResponse,
  SaveUploadAbortRequest,
  SaveUploadAbortResponse,
  SaveUploadCompleteRequest,
  SaveUploadCompleteResponse,
  SaveUploadRequest,
  SaveUploadResponse,
} from "@savecamp/types";
import { HttpError, isHttpError, parse, toHttpError } from "../../lib/http.js";
import {
  getR2Bucket,
  getS3Client,
  MULTIPART_THRESHOLD,
  PART_SIZE,
  PRESIGN_EXPIRES_IN,
} from "../../lib/r2.js";
import {
  saveUploadAbortRequest,
  saveUploadCompleteRequest,
  saveUploadRequest,
} from "./schema.js";

export async function getSaves(gameName: string): Promise<SaveGetResponse> {
  const bucket = getR2Bucket();
  const result = await send(() =>
    getS3Client().send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `saves/${gameName}/`,
      })
    )
  );

  return {
    saves: (result.Contents ?? []).map((cont) => ({
      fileName: cont.Key?.split("/").pop() ?? "",
      lastModified: new Date(cont.LastModified ?? 0).toISOString(),
      size: cont.Size ?? 0,
      humanReadableDate: new Date(cont.LastModified ?? 0).toLocaleString(
        "pt-BR" // deveria ser um parametro da funcao para receber diferentes formatos de data (en-US por exemplo)
      ),
    })),
  };
}

export async function createSaveUpload(
  body: SaveUploadRequest
): Promise<SaveUploadResponse> {
  const { gameName, contentHash, contentLength, contentType } = parse(
    saveUploadRequest,
    body
  );
  const key = buildSaveObjectKey(gameName, contentHash);

  if (await saveObjectExists(key)) {
    return { mode: "exists", key };
  }

  if (contentLength <= MULTIPART_THRESHOLD) {
    return presignPutUpload(key, contentType);
  }

  return createMultipartUpload(key, contentType, contentLength);
}

export async function completeSaveUpload(
  body: SaveUploadCompleteRequest
): Promise<SaveUploadCompleteResponse> {
  const { key, uploadId, parts } = parse(saveUploadCompleteRequest, body);
  const bucket = getR2Bucket();

  await send(() =>
    getS3Client().send(
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
    )
  );

  return { key };
}

export async function abortSaveUpload(
  body: SaveUploadAbortRequest
): Promise<SaveUploadAbortResponse> {
  const { key, uploadId } = parse(saveUploadAbortRequest, body);
  const bucket = getR2Bucket();

  await send(() =>
    getS3Client().send(
      new AbortMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
      })
    )
  );

  return { ok: true };
}

function buildSaveObjectKey(gameName: string, contentHash: string): string {
  return `saves/${gameName}/${contentHash}.sav`;
}

async function send<Output>(run: () => Promise<Output>): Promise<Output> {
  try {
    return await run();
  } catch (error) {
    throw toHttpError(error);
  }
}

async function saveObjectExists(key: string): Promise<boolean> {
  const bucket = getR2Bucket();

  try {
    await send(() =>
      getS3Client().send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    );
    return true;
  } catch (error) {
    if (isHttpError(error) && error.status === 404) {
      return false;
    }
    throw error;
  }
}

async function presignPutUpload(
  key: string,
  contentType: string
): Promise<SaveUploadResponse> {
  const s3 = getS3Client();
  const bucket = getR2Bucket();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: PRESIGN_EXPIRES_IN,
  });

  return {
    mode: "put",
    key,
    url,
    headers: { "Content-Type": contentType },
  };
}

async function presignMultipartParts(
  key: string,
  uploadId: string,
  contentLength: number
): Promise<SaveUploadResponse> {
  const s3 = getS3Client();
  const bucket = getR2Bucket();
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

  return {
    mode: "multipart",
    key,
    uploadId,
    partSize: PART_SIZE,
    parts,
  };
}

async function createMultipartUpload(
  key: string,
  contentType: string,
  contentLength: number
): Promise<SaveUploadResponse> {
  const bucket = getR2Bucket();
  const createResult = await send(() =>
    getS3Client().send(
      new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      })
    )
  );

  const uploadId = createResult.UploadId;
  if (!uploadId) {
    throw new HttpError(500, "Failed to create multipart upload");
  }

  return presignMultipartParts(key, uploadId, contentLength);
}
