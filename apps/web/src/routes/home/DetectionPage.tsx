import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ItemGroup } from "@/components/ui/item";
import {
  CloudSaveCubby,
  SaveCubby,
  SaveCubbySkeleton,
} from "@/components/save-cubby";
import { useCloudSaves, type CloudSavesStatus } from "@/hooks/use-cloud-saves";
import { useDetectGame } from "@/hooks/use-detect-game";
import { getGameDisplayName, isGameSupported, slugToGame } from "@/lib/games";
import type { Save } from "@savecamp/types";
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

function CloudSavesSection({
  status,
  saves,
  error,
  retry,
}: {
  status: CloudSavesStatus;
  saves: Save[];
  error: string | null;
  retry: () => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium">Saves no SaveCamp</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Arquivos já enviados para a nuvem.
        </p>
      </div>

      {status === "loading" && (
        <ItemGroup data-size="sm">
          <SaveCubbySkeleton />
          <SaveCubbySkeleton />
        </ItemGroup>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar os saves</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              className="w-fit border-destructive/30 bg-background"
              onClick={() => void retry()}
            >
              Tentar de novo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {status === "ready" && saves.length === 0 && (
        <StatusBlock
          title="Nenhum save na nuvem"
          description="Envie um save local para vê-lo aqui."
        />
      )}

      {status === "ready" && saves.length > 0 && (
        <ItemGroup data-size="sm">
          {saves.map((save) => (
            <CloudSaveCubby key={save.fileName} save={save} />
          ))}
        </ItemGroup>
      )}
    </section>
  );
}

export function DetectionPage() {
  const { gameSlug = "" } = useParams<{ gameSlug: string }>();
  const game = slugToGame(gameSlug);
  const supported = isGameSupported(gameSlug);
  const { status, basePath, savePaths, error, gameName, retry } =
    useDetectGame(gameSlug);
  const cloudSaves = useCloudSaves(game && supported ? gameSlug : null);

  if (!game) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
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

      {supported && (
        <CloudSavesSection
          status={cloudSaves.status}
          saves={cloudSaves.saves}
          error={cloudSaves.error}
          retry={() => void cloudSaves.retry()}
        />
      )}

      <section className="flex flex-col gap-3">
        {supported && (
          <div>
            <h3 className="text-sm font-medium">Saves neste computador</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Envie um arquivo local para o SaveCamp.
            </p>
          </div>
        )}

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
      </section>
    </div>
  );
}
