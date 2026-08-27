import { GAMES } from "@savecamp/types";

export const SUPPORTED_GAME_SLUGS = ["bigwalk"] as const;

export type SupportedGameSlug = (typeof SUPPORTED_GAME_SLUGS)[number];

export function gameToSlug(game: string): string {
  return game.replace(/\s/g, "").toLowerCase();
}

export function slugToGame(slug: string): string | undefined {
  return GAMES.find((game) => gameToSlug(game) === slug);
}

export function isGameSupported(slug: string): slug is SupportedGameSlug {
  return (SUPPORTED_GAME_SLUGS as readonly string[]).includes(slug);
}

export function getGameDisplayName(slug: string): string {
  return slugToGame(slug) ?? slug;
}

export function getDetectionPath(slug: string): string {
  return `/home/${slug}/detection`;
}
