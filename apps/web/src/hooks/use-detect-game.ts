import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActivity } from "@/contexts/activity-context";
import { useElectron } from "@/hooks/use-electron";
import { errorMessage } from "@/lib/http";
import { detectGameQueryKey, detectLocalSaves } from "@/services/detect-game";

export type DetectStatus =
  "idle" | "scanning" | "ready" | "error" | "unsupported" | "no-electron";

export function useDetectGame(gameSlug: string) {
  const { isAvailable, api } = useElectron();
  const { setActivity, clearActivity } = useActivity();
  const enabled = Boolean(isAvailable && api);

  const query = useQuery({
    queryKey: detectGameQueryKey(gameSlug),
    queryFn: () => detectLocalSaves(api!, gameSlug),
    enabled,
  });

  useEffect(() => {
    syncDetectActivity({
      enabled,
      isFetching: query.isFetching,
      isError: query.isError,
      pathCount: query.data?.savePaths.length ?? 0,
      gameSlug,
      setActivity,
      clearActivity,
    });
  }, [
    clearActivity,
    enabled,
    gameSlug,
    query.data?.savePaths.length,
    query.isError,
    query.isFetching,
    setActivity,
  ]);

  useEffect(() => {
    return () => {
      clearActivity();
    };
  }, [clearActivity]);

  return {
    status: detectStatus({
      isAvailable,
      isLoading: query.isLoading,
      isError: query.isError,
      isSuccess: query.isSuccess,
    }),
    basePath: query.data?.basePath ?? null,
    savePaths: query.data?.savePaths ?? [],
    error: errorMessage(query.error, "Falha ao comunicar com o Electron"),
    gameSlug,
    retry: query.refetch,
  };
}

function detectStatus(state: {
  isAvailable: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}): DetectStatus {
  if (!state.isAvailable) {
    return "no-electron";
  }
  if (state.isLoading) {
    return "scanning";
  }
  if (state.isError) {
    return "error";
  }
  return state.isSuccess ? "ready" : "idle";
}

function syncDetectActivity({
  enabled,
  isFetching,
  isError,
  pathCount,
  gameSlug,
  setActivity,
  clearActivity,
}: {
  enabled: boolean;
  isFetching: boolean;
  isError: boolean;
  pathCount: number;
  gameSlug: string;
  setActivity: (status: "idle" | "active", message?: string) => void;
  clearActivity: () => void;
}) {
  if (!enabled || isError) {
    clearActivity();
    return;
  }

  if (isFetching) {
    setActivity("active", `Procurando saves de ${gameSlug}…`);
    return;
  }

  if (pathCount === 0) {
    clearActivity();
    return;
  }

  const noun = pathCount === 1 ? "save encontrado" : "saves encontrados";
  setActivity("idle", `${pathCount} ${noun}`);
}
