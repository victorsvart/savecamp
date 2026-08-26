export type AppId = "web" | "desktop";

export const GAMES: string[] = ["Minecraft", "BigWalk"];

export type GameSearchResult = {
  paths: string[];
  error: Error | null;
};
