import { Separator } from "@/components/ui/separator";
import {
  gameToSlug,
  getDetectionPath,
  isGameSupported,
} from "@/lib/games";
import { GAMES } from "@savecamp/types";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">Jogos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um jogo para procurar saves neste computador.
        </p>
      </div>

      <div className="border">
        {GAMES.map((game, index) => {
          const slug = gameToSlug(game);
          const supported = isGameSupported(slug);

          return (
            <div key={game}>
              {index > 0 && <Separator />}
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm transition-colors hover:bg-muted/60"
                onClick={() => navigate(getDetectionPath(slug))}
              >
                <span>{game}</span>
                <span className="text-xs text-muted-foreground">
                  {supported ? "Detectar" : "Em breve"}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Os saves encontrados podem ser enviados para o SaveCamp.
      </p>
    </div>
  );
}
