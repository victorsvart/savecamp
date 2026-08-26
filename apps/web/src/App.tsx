import type { AppId } from "@savecamp/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const APP_ID: AppId = "web";

export function App() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh p-6" data-app={APP_ID}>
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Root do project</h1>
          <p>Acessar acessar rota home</p>
          <Button className="mt-2" onClick={() => navigate("/home")}>
            Ir para Home
          </Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Pressione <kbd>d</kbd> para alternar o modo escuro)
        </div>
      </div>
    </div>
  );
}

export default App;
