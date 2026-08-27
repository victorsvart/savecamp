import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 border px-3 py-4 text-sm">
      <p className="font-medium">Página não encontrada</p>
      <p className="text-muted-foreground">Esta rota não existe no SaveCamp.</p>
      <Button
        variant="outline"
        size="sm"
        className="w-fit"
        onClick={() => navigate("/home")}
      >
        Ir para início
      </Button>
    </div>
  );
}
