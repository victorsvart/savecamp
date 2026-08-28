import { getData } from "@/lib/http";
import type { GameResponse } from "@savecamp/types";
import { useQuery } from "@tanstack/react-query";

export function useGames() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["games"],
    queryFn: () => getData<GameResponse[]>("/games"),
  });

  return { data, isLoading, error };
}
