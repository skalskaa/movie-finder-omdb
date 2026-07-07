"use client";

import { useFavorites } from "./use-favorites";
import type { FavoriteMovie } from "./types";

interface FavoriteToggleButtonProps {
  movie: FavoriteMovie;
}

export function FavoriteToggleButton({ movie }: FavoriteToggleButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = isFavorite(movie.imdbID);
  const label = favorite ? "Remove from favorites" : "Add to favorites";

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(movie)}
      aria-pressed={favorite}
      aria-label={`${label}: ${movie.title}`}
      className={`inline-flex h-9 items-center rounded-lg border px-3 text-sm font-medium transition ${
        favorite
          ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          : "border-zinc-300 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950`}
    >
      {label}
    </button>
  );
}
