import { isRecord } from "@/lib/utils/guards";
import type { FavoriteMovie } from "./types";

export const FAVORITES_STORAGE_KEY = "movie-finder-omdb:favorites";
export const FAVORITES_STORAGE_EVENT = "movie-finder-omdb:favorites-changed";

// localStorage is user-writable and survives schema changes between releases,
// so anything read back is treated as untrusted and validated per item.
function isFavoriteMovie(value: unknown): value is FavoriteMovie {
  if (!isRecord(value)) {
    return false;
  }

  const validType = value.type === "movie" || value.type === "series" || value.type === "episode";
  const validPoster = typeof value.posterUrl === "string" || value.posterUrl === null;

  return (
    typeof value.imdbID === "string" &&
    typeof value.title === "string" &&
    typeof value.year === "string" &&
    validType &&
    validPoster
  );
}

export function readFavoritesFromStorage(): FavoriteMovie[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isFavoriteMovie);
  } catch {
    return [];
  }
}

export function writeFavoritesToStorage(favorites: FavoriteMovie[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new Event(FAVORITES_STORAGE_EVENT));
}
