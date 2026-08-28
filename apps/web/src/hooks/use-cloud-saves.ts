import { useQuery } from "@tanstack/react-query";
import { errorMessage } from "@/lib/http";
import { cloudSavesQueryKey, getGameSaves } from "@/services/saves";

export type CloudSavesStatus = "idle" | "loading" | "ready" | "error";

export function useCloudSaves(gameSlug: string | null) {
  const enabled = gameSlug != null;
  const query = useQuery({
    queryKey: cloudSavesQueryKey(gameSlug ?? ""),
    queryFn: () => getGameSaves(gameSlug!),
    enabled,
  });

  return {
    status: cloudSavesStatus(
      enabled,
      query.isLoading,
      query.isError,
      query.isSuccess
    ),
    saves: query.data?.saves ?? [],
    error: errorMessage(query.error, "Não foi possível carregar os saves"),
    retry: query.refetch,
  };
}

function cloudSavesStatus(
  enabled: boolean,
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean
): CloudSavesStatus {
  if (!enabled) {
    return "idle";
  }
  if (isLoading) {
    return "loading";
  }
  if (isError) {
    return "error";
  }
  return isSuccess ? "ready" : "idle";
}
