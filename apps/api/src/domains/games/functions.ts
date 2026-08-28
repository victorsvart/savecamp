import type { GameResponse } from "@savecamp/types";
import { db } from "../../prisma/db.js";

export async function getGames(): Promise<GameResponse[]> {
  const games = await db.orm.public.Game.all();
  return games.map((game) => {
    return {
      id: game.id,
      name: game.name,
      logoURL: game.logoURL,
      slug: game.slug,
      active: game.active,
      humanReadableDate: game.createdAt.toLocaleString("pt-BR"),
    };
  }) satisfies GameResponse[];
}

export async function getGameById(id: string): Promise<GameResponse | null> {
  const game = await db.orm.public.Game.where({ id }).first();
  if (!game) return null;
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    logoURL: game.logoURL,
    active: game.active,
    humanReadableDate: game.createdAt.toLocaleString("pt-BR"),
  };
}

export async function getGameBySlug(
  slug: string
): Promise<GameResponse | null> {
  const game = await db.orm.public.Game.where({ slug }).first();
  if (!game) return null;
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    logoURL: game.logoURL,
    active: game.active,
    humanReadableDate: game.createdAt.toLocaleString("pt-BR"),
  };
}

// funcao idiota
export async function isKnownSlug(value: string): Promise<boolean> {
  const game = await db.orm.public.Game.where({ slug: value }).first();
  return game !== null;
}

// no crud por enquanto
