import { GameSearchResult } from "@savecamp/types/src";
import fs from "node:fs";

export function searchGame(expectedPath: string, extension: string): GameSearchResult {
  console.log(`Searching for game at: ${expectedPath}`);
  try {
    if (!fs.existsSync(expectedPath)) {
      throw new Error(
        `User data path not found at ${expectedPath} on ${process.platform}`
      );
    }

    console.log(
      `User data path found at ${expectedPath} on ${process.platform}`
    );
    const saveStates = fs.readdirSync(expectedPath).filter((file) => file.endsWith(extension));
    return {
      paths: saveStates,
      error: null,
    };
  } catch (error) {
    return {
      paths: [],
      error: error as Error,
    };
  }
}
