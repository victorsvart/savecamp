import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGames } from "@/hooks/use-games";
import type { GameResponse } from "@savecamp/types";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();
  const { data: gameData, isLoading, error } = useGames();

  useEffect(() => {
    if (error) {
      toast.add({
        title: "Erro ao carregar jogos",
        description: error.message,
        type: "error",
      });
    }
  }, [error]);

  const gameMenuRow = (games: GameResponse[]) => {
    return games.map((g: GameResponse) => {
      return (
        <Button
          key={g.name}
          onClick={() => navigate(`/home/${g.slug}/detection`)}
        >
          <span>{g.name}</span>
        </Button>
      );
    });
  };

  const gameLoadingState = (
    <div>
      <span>Carregando jogos...</span>
    </div>
  );

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">Jogos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um jogo para procurar saves neste computador.
        </p>
      </div>

      <div className="border">
        {isLoading ? gameLoadingState : gameMenuRow(gameData!)}
      </div>

      <p className="text-xs text-muted-foreground">
        Os saves encontrados podem ser enviados para o SaveCamp.
      </p>
    </div>
  );
}
