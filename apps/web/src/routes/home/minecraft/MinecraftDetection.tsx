import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function MinecraftDetection() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Detecção de Minecraft</h1>
      <p>Esta é a página de detecção de Minecraft</p>
      <Button>
        <Link to="/">Voltar para a página inicial</Link>
      </Button>
    </div>
  );
}
