import { Hono } from "hono";
import {
  getGameById,
  getGameBySlug,
  getGames,
  isKnownSlug,
} from "./functions.js";
import { error, HttpError, ok } from "../../lib/http.js";
import type { GameResponse } from "@savecamp/types";

export const gameRoutes = new Hono();

gameRoutes.get("/", async (c) => {
  const games: GameResponse[] = await getGames();
  return ok<GameResponse[]>(c, games);
});

gameRoutes.get("/:idOrSlug", async (c) => {
  console.log("idOrSlug", c.req.param("idOrSlug"));
  const idOrSlug = c.req.param("idOrSlug");
  const knownSlug = await isKnownSlug(idOrSlug);
  const lookup = knownSlug ? getGameBySlug : getGameById;
  const game: GameResponse | null = await lookup(idOrSlug);
  if (!game) {
    return error(c, new HttpError(404, "Game not found"));
  }
  return ok<GameResponse>(c, game);
});
