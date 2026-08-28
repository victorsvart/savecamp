import type { GameResponse } from "@savecamp/types";
import { db } from "../../prisma/db.js";

export async function getGames(): Promise<GameResponse[]> {
  const games = await db.orm.public.Game.all();
  return games.map((game) => {
    return {
      id: game.id,
      name: game.name,
      logoURL: game.logoURL,
      active: game.active,
      humanReadableDate: game.createdAt.toLocaleString("pt-BR"),
    };
  }) satisfies GameResponse[];
}

// no crud por enquanto
