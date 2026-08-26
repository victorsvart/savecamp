import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { GameSearchResult } from "@savecamp/types";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function BigWalkDetection() {
  const [saveStates, setSaveStates] = useState<string[] | null>(null);
  const detectGame = async () => {
    try {
      const result: GameSearchResult = await (
        window as any
      ).electron.detectGame("bigwalk");
      if (result.error) {
        toast.add({
          type: "error",
          title: "Erro ao detectar BigWalk",
          description: result.error.message,
        });
        return;
      }

      console.log(result.paths);
      setSaveStates(result.paths);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Erro ao detectar BigWalk",
        description:
          error instanceof Error ? error.message : "Falha ao comunicar com o Electron",
      });
    }
  };

  useEffect(() => {
    detectGame();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Detecção de BigWalk</h1>
      <p>Esta é a página de detecção de BigWalk</p>
      {saveStates?.map((saveState) => (
        <div className="flex flex-col items-center justify-center">
          <p>Game save files detected: {saveState}</p>
          <Button>Salvar no SaveCamp</Button>
        </div>
      ))}
      <Button>
        <Link to="/home">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}
