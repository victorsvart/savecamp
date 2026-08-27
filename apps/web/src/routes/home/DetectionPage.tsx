import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import { SaveCubby, SaveCubbySkeleton } from "@/components/save-cubby";
import { useDetectGame } from "@/hooks/use-detect-game";
import { getGameDisplayName, slugToGame } from "@/lib/games";
import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router";

function StatusBlock({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="border px-3 py-4 text-sm">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-muted-foreground">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function DetectionPage() {
  const { gameSlug = "" } = useParams<{ gameSlug: string }>();
  const game = slugToGame(gameSlug);

  if (!game) {
    return <Navigate to="/home" replace />;
  }

  const { status, basePath, savePaths, error, gameName, retry } =
    useDetectGame(gameSlug);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <div>
        <h2 className="text-base font-medium">{gameName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {status === "scanning"
            ? "Procurando em pastas de save do sistema…"
            : basePath
              ? `Pasta base: ${basePath}`
              : "Detecção de saves locais"}
        </p>
      </div>

      {status === "scanning" && (
        <div className="space-y-3">
          <div
            className="relative h-px w-full overflow-hidden bg-border"
            role="progressbar"
            aria-label={`Procurando saves de ${gameName}`}
            aria-busy="true"
          >
            <div className="progress-indeterminate absolute inset-y-0 w-1/4 bg-foreground/40" />
          </div>
          <ItemGroup data-size="sm">
            <SaveCubbySkeleton />
            <SaveCubbySkeleton />
            <SaveCubbySkeleton />
          </ItemGroup>
        </div>
      )}

      {status === "no-electron" && (
        <StatusBlock
          title="Abra o app desktop"
          description="Abra o SaveCamp no app desktop para detectar saves neste computador."
          action={
            <Button variant="outline" size="sm" onClick={() => void retry()}>
              Tentar de novo
            </Button>
          }
        />
      )}

      {status === "unsupported" && (
        <StatusBlock
          title="Ainda não rastreamos este jogo"
          description={`A detecção de saves para ${gameName} ainda não está disponível.`}
        />
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>
            Não foi possível detectar {getGameDisplayName(gameSlug)}
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              className="w-fit border-destructive/30 bg-background"
              onClick={() => void retry()}
            >
              Detectar de novo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {status === "ready" && savePaths.length === 0 && (
        <StatusBlock
          title="Nenhum save encontrado"
          description="Abra o jogo uma vez neste Mac e tente de novo."
          action={
            <Button variant="outline" size="sm" onClick={() => void retry()}>
              Detectar de novo
            </Button>
          }
        />
      )}

      {status === "ready" && savePaths.length > 0 && basePath && (
        <ItemGroup data-size="sm">
          {savePaths.map((savePath) => (
            <SaveCubby
              key={savePath}
              gameSlug={gameSlug}
              basePath={basePath}
              savePath={savePath}
            />
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
