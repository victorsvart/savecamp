import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useActivity } from "@/contexts/activity-context";
import { useElectron } from "@/hooks/use-electron";
import { cloudSavesQueryKey } from "@/services/saves";
import type { Save } from "@savecamp/types";

type SaveCubbyProps = {
  gameSlug: string;
  basePath: string;
  savePath: string;
};

function getFileName(path: string): string {
  const parts = path.split(/[/\\]/);
  return parts[parts.length - 1] || path;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function SaveCubby({
  gameSlug,
  basePath,
  savePath,
}: SaveCubbyProps) {
  const { api } = useElectron();
  const { setActivity, clearActivity } = useActivity();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fileName = getFileName(savePath);

  const handleSave = async () => {
    if (!api || isSaving || isSaved) {
      return;
    }

    setIsSaving(true);
    setActivity("active", `Enviando ${fileName}…`);

    try {
      const result = await api.saveGameState(gameSlug, basePath, savePath);

      if (result.error) {
        toast.add({
          type: "error",
          title: "Não foi possível salvar",
          description: result.error.message,
        });
        clearActivity();
        return;
      }

      setIsSaved(true);
      toast.add({
        type: "success",
        title: "Salvo no SaveCamp",
        description: result.savedTo ?? fileName,
      });
      void queryClient.invalidateQueries({
        queryKey: cloudSavesQueryKey(gameSlug),
      });
      clearActivity();
    } catch (caught) {
      toast.add({
        type: "error",
        title: "Não foi possível salvar",
        description:
          caught instanceof Error
            ? caught.message
            : "Falha ao comunicar com o Electron",
      });
      clearActivity();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Item variant="outline" className="rounded-none first:rounded-t-md last:rounded-b-md">
      <ItemContent className="min-w-0 flex-1">
        <ItemTitle className="font-mono text-xs tabular-nums">
          {fileName}
        </ItemTitle>
        <ItemDescription className="truncate font-mono text-[11px]">
          {savePath}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="shrink-0">
        {isSaved ? (
          <Badge variant="outline">Salvo</Badge>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner className="size-3.5" />
                Enviando…
              </>
            ) : (
              "Salvar no SaveCamp"
            )}
          </Button>
        )}
      </ItemActions>
    </Item>
  );
}

export function CloudSaveCubby({ save }: { save: Save }) {
  return (
    <Item
      variant="outline"
      className="rounded-none first:rounded-t-md last:rounded-b-md"
    >
      <ItemContent className="min-w-0 flex-1">
        <ItemTitle className="font-mono text-xs tabular-nums">
          {save.fileName}
        </ItemTitle>
        <ItemDescription className="truncate text-[11px]">
          {save.humanReadableDate} · {formatBytes(save.size)}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="shrink-0">
        <Badge variant="outline">Na nuvem</Badge>
      </ItemActions>
    </Item>
  );
}

export function SaveCubbySkeleton() {
  return (
    <Item variant="outline" className="rounded-none">
      <ItemContent className="gap-2">
        <div className="h-3.5 w-28 bg-muted" />
        <div className="h-3 w-full max-w-sm bg-muted/70" />
      </ItemContent>
      <ItemActions>
        <div className="h-7 w-24 border bg-muted/40" />
      </ItemActions>
    </Item>
  );
}
