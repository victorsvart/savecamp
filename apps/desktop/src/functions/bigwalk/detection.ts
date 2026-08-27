import path from "node:path";
import { searchGame } from "../search";
import { GameSearchResult } from "@savecamp/types/src";

const GAME_NAME: string = "Big Walk";
const SAVE_FILE_EXTENSION = ".sav";

const macOSExpectedPath = path.join(
  process.env.HOME ?? "~",
  "Library",
  "Application Support",
  "House House",
  "Big Walk",
  "user_data",
  "save_games"
);
const win32ExpectedPath = path.join(
  process.env.USERPROFILE ?? "~",
  "AppData",
  "LocalLow",
  "House House",
  "Big Walk",
  "user_data",
  "save_games"
);

export function detectBigWalk(): GameSearchResult {
  switch (process.platform) {
    case "darwin":
      return searchGame(macOSExpectedPath, SAVE_FILE_EXTENSION);
    case "win32":
      return searchGame(win32ExpectedPath, SAVE_FILE_EXTENSION);
    default:
      return {
        basePath: "",
        paths: [],
        error: new Error(`${GAME_NAME} not supported on ${process.platform}`),
      };
  }
}
