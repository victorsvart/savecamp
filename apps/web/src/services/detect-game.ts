import type { ElectronAPI } from "@/types/electron";

export function detectGameQueryKey(gameSlug: string) {
  return ["detect-game", gameSlug] as const;
}

export async function detectLocalSaves(
  api: ElectronAPI,
  gameSlug: string
): Promise<{ basePath: string | null; savePaths: string[] }> {
  const result = await api.detectGame(gameSlug);
  if (result.error) {
    throw new Error(result.error.message);
  }
  return {
    basePath: result.basePath,
    savePaths: result.paths,
  };
}
