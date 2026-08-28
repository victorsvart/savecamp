import { useQuery } from "@tanstack/react-query";
import { getGameInfo } from "@/services/games";

export function useGameInfo(gameIdOrSlug: string) {
  const query = useQuery({
    queryKey: ["game", gameIdOrSlug],
    queryFn: () => getGameInfo(gameIdOrSlug),
  });

  return {
    game: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
