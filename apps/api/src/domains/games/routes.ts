import { Hono } from "hono";
import { getGames } from "./functions.js";
import { ok } from "../../lib/http.js";
import type { GameResponse } from "@savecamp/types";

export const gameRoutes = new Hono();

gameRoutes.get("/", async (c) => {
  const games: GameResponse[] = await getGames();
  return ok<GameResponse[]>(c, games);
});
