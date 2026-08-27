import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import type {
  SaveGameStateResult,
  SaveUploadCompleteRequest,
  SaveUploadResponse,
} from "@savecamp/types";

const SAVE_CONTENT_TYPE = "application/octet-stream";

function getApiUrl(): string {
  return process.env.SAVECAMP_API_URL ?? "http://localhost:3000";
}

function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const secret = process.env.SAVECAMP_API_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }
  return headers;
}

async function abortMultipartUpload(
  key: string,
  uploadId: string
): Promise<void> {
  await fetch(`${getApiUrl()}/v1/saves/uploads/abort`, {
    method: "POST",
    headers: getApiHeaders(),
    body: JSON.stringify({ key, uploadId }),
  }).catch(() => {});
}

export async function saveGameStateToCloud(
  gameName: string,
  basePath: string,
  saveFilePath: string
): Promise<SaveGameStateResult> {
  try {
    const fullPath = path.join(basePath, saveFilePath);
    const saveFile = fs.readFileSync(fullPath);
    const contentHash = crypto
      .createHash("sha256")
      .update(saveFile)
      .digest("hex");
    const contentLength = saveFile.byteLength;

    const uploadResponse = await fetch(`${getApiUrl()}/v1/saves/uploads`, {
      method: "POST",
      headers: getApiHeaders(),
      body: JSON.stringify({
        gameName,
        contentHash,
        contentLength,
        contentType: SAVE_CONTENT_TYPE,
      }),
    });

    if (!uploadResponse.ok) {
      const text = await uploadResponse.text();
      throw new Error(`Upload init failed: ${uploadResponse.status} ${text}`);
    }

    const upload = (await uploadResponse.json()) as SaveUploadResponse;

    if (upload.mode === "exists") {
      return { savedTo: upload.key, error: null };
    }

    if (upload.mode === "put") {
      const putResponse = await fetch(upload.url, {
        method: "PUT",
        headers: upload.headers,
        body: saveFile,
      });
      if (!putResponse.ok) {
        const text = await putResponse.text();
        throw new Error(`PUT upload failed: ${putResponse.status} ${text}`);
      }
      return { savedTo: upload.key, error: null };
    }

    const uploadedParts: SaveUploadCompleteRequest["parts"] = [];
    try {
      for (const part of upload.parts) {
        const start = (part.partNumber - 1) * upload.partSize;
        const end = Math.min(start + upload.partSize, contentLength);
        const partData = saveFile.subarray(start, end);

        const partResponse = await fetch(part.url, {
          method: "PUT",
          body: partData,
        });
        if (!partResponse.ok) {
          const text = await partResponse.text();
          throw new Error(
            `Part ${part.partNumber} upload failed: ${partResponse.status} ${text}`
          );
        }

        const etag = partResponse.headers.get("ETag");
        if (!etag) {
          throw new Error(`Part ${part.partNumber} missing ETag`);
        }

        uploadedParts.push({
          partNumber: part.partNumber,
          etag: etag.replace(/"/g, ""),
        });
      }

      const completeResponse = await fetch(
        `${getApiUrl()}/v1/saves/uploads/complete`,
        {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify({
            key: upload.key,
            uploadId: upload.uploadId,
            parts: uploadedParts,
          } as SaveUploadCompleteRequest),
        }
      );

      if (!completeResponse.ok) {
        const text = await completeResponse.text();
        throw new Error(
          `Complete upload failed: ${completeResponse.status} ${text}`
        );
      }

      return { savedTo: upload.key, error: null };
    } catch (error) {
      await abortMultipartUpload(upload.key, upload.uploadId);
      throw error;
    }
  } catch (error) {
    return {
      savedTo: null,
      error: error as Error,
    };
  }
}
