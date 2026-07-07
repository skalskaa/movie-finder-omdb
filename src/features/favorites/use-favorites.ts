"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  FAVORITES_STORAGE_EVENT,
  FAVORITES_STORAGE_KEY,
  readFavoritesFromStorage,
  writeFavoritesToStorage,
} from "./storage";
import type { FavoriteMovie } from "./types";

interface UseFavoritesResult {
  isFavorite: (imdbID: string) => boolean;
  toggleFavorite: (movie: FavoriteMovie) => void;
}

const EMPTY_FAVORITES: FavoriteMovie[] = [];
let cachedFavorites: FavoriteMovie[] = EMPTY_FAVORITES;

function areFavoritesEqual(left: FavoriteMovie[], right: FavoriteMovie[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((favorite, index) => {
    const compared = right[index];
    return (
      favorite.imdbID === compared.imdbID &&
      favorite.title === compared.title &&
      favorite.year === compared.year &&
      favorite.type === compared.type &&
      favorite.posterUrl === compared.posterUrl
    );
  });
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === FAVORITES_STORAGE_KEY) {
      onStoreChange();
    }
  };

  const handleCustomEvent = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(FAVORITES_STORAGE_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FAVORITES_STORAGE_EVENT, handleCustomEvent);
  };
}

function getServerSnapshot(): FavoriteMovie[] {
  return EMPTY_FAVORITES;
}

function getSnapshot(): FavoriteMovie[] {
  const latestFavorites = readFavoritesFromStorage();
  if (!areFavoritesEqual(cachedFavorites, latestFavorites)) {
    cachedFavorites = latestFavorites;
  }

  return cachedFavorites;
}

// useSyncExternalStore (not useState) so every mounted list/detail view and
// other browser tabs stay in sync from the single localStorage source of truth.
export function useFavorites(): UseFavoritesResult {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback(
    (imdbID: string) => favorites.some((favorite) => favorite.imdbID === imdbID),
    [favorites],
  );

  const toggleFavorite = useCallback((movie: FavoriteMovie) => {
    const currentFavorites = readFavoritesFromStorage();
    const exists = currentFavorites.some((favorite) => favorite.imdbID === movie.imdbID);
    const nextFavorites = exists
      ? currentFavorites.filter((favorite) => favorite.imdbID !== movie.imdbID)
      : [...currentFavorites, movie];

    writeFavoritesToStorage(nextFavorites);
  }, []);

  return useMemo(
    () => ({
      isFavorite,
      toggleFavorite,
    }),
    [isFavorite, toggleFavorite],
  );
}
