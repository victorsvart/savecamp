import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p>Esta rota não existe.</p>
      <Button onClick={() => navigate("/")}>
        Voltar para a página inicial
      </Button>
    </div>
  );
}
