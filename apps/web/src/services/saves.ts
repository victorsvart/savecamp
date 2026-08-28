import type { SaveGetResponse } from "@savecamp/types";
import { getData } from "@/lib/http";

export function cloudSavesQueryKey(gameSlug: string) {
  return ["cloud-saves", gameSlug] as const;
}

export async function getGameSaves(gameName: string): Promise<SaveGetResponse> {
  return getData<SaveGetResponse>(`saves/${encodeURIComponent(gameName)}`);
}
