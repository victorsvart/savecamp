import { GameSearchResult } from "@savecamp/types/src";
import { detectBigWalk } from "./bigwalk/detection";

export function detectGame(game: string): GameSearchResult {
  switch (game) {
    case "bigwalk":
      return detectBigWalk();
    default:
      console.log(`Tried to detect unsupported game: ${game}`);
      return {
        basePath: "",
        paths: [],
        error: new Error(`Tried to detect unsupported game: ${game}`),
      };
  }
}
