import { useCallback, useEffect, useState } from "react";
import { useActivity } from "@/contexts/activity-context";
import { useElectron } from "@/hooks/use-electron";
import {
  getGameDisplayName,
  isGameSupported,
} from "@/lib/games";

export type DetectStatus =
  | "idle"
  | "scanning"
  | "ready"
  | "error"
  | "unsupported"
  | "no-electron";

export function useDetectGame(gameSlug: string) {
  const { isAvailable, api } = useElectron();
  const { setActivity, clearActivity } = useActivity();
  const [status, setStatus] = useState<DetectStatus>("idle");
  const [basePath, setBasePath] = useState<string | null>(null);
  const [savePaths, setSavePaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const gameName = getGameDisplayName(gameSlug);

  const detect = useCallback(async () => {
    setError(null);
    setBasePath(null);
    setSavePaths([]);

    if (!isAvailable || !api) {
      setStatus("no-electron");
      clearActivity();
      return;
    }

    if (!isGameSupported(gameSlug)) {
      setStatus("unsupported");
      clearActivity();
      return;
    }

    setStatus("scanning");
    setActivity("active", `Procurando saves de ${gameName}…`);

    try {
      const result = await api.detectGame(gameSlug);

      if (result.error) {
        setError(result.error.message);
        setStatus("error");
        clearActivity();
        return;
      }

      setBasePath(result.basePath);
      setSavePaths(result.paths);
      setStatus("ready");

      if (result.paths.length === 0) {
        clearActivity();
      } else {
        const count = result.paths.length;
        setActivity(
          "idle",
          `${count} ${count === 1 ? "save encontrado" : "saves encontrados"}`
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Falha ao comunicar com o Electron"
      );
      setStatus("error");
      clearActivity();
    }
  }, [api, clearActivity, gameName, gameSlug, isAvailable, setActivity]);

  useEffect(() => {
    void detect();
  }, [detect]);

  useEffect(() => {
    return () => {
      clearActivity();
    };
  }, [clearActivity]);

  return {
    status,
    basePath,
    savePaths,
    error,
    gameName,
    retry: detect,
  };
}
