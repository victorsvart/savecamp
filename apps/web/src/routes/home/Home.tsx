import { Button } from "@/components/ui/button";
import { GAMES } from "@savecamp/types";
import { useNavigate } from "react-router";
export function Home() {
  const navigate = useNavigate();
  //   {console.log(GAMES.map((game: string) => game.replace(/\s/g, "").toLowerCase()))}
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Home</h1>
      <div className="flex flex-col items-center justify-center gap-2">
        {GAMES.map((game: string) => (
          <Button
            key={game}
            onClick={() =>
              navigate(
                `/home/${game.replace(/\s/g, "").toLowerCase()}/detection`
              )
            }
          >
            Go to {game}
          </Button>
        ))}
      </div>
    </div>
  );
}
