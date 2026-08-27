import type { GameSearchResult, SaveGameStateResult } from "@savecamp/types";

export type ElectronAPI = {
  detectGame: (game: string) => Promise<GameSearchResult>;
  saveGameState: (
    gameName: string,
    basePath: string,
    saveFilePath: string
  ) => Promise<SaveGameStateResult>;
};

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
