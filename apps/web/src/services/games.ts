import { getData } from "@/lib/http";
import type { GameResponse } from "@savecamp/types";

export async function getGameInfo(idOrSlug: string): Promise<GameResponse> {
  return getData<GameResponse>(`games/${encodeURIComponent(idOrSlug)}`);
}
