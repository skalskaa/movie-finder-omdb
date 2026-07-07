// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  FAVORITES_STORAGE_EVENT,
  FAVORITES_STORAGE_KEY,
  readFavoritesFromStorage,
  writeFavoritesToStorage,
} from "./storage";

const sampleFavorite = {
  imdbID: "tt0076759",
  title: "Star Wars",
  year: "1977",
  type: "movie" as const,
  posterUrl: "https://example.com/poster.jpg",
};

describe("favorites storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("writes and reads favorites from localStorage", () => {
    writeFavoritesToStorage([sampleFavorite]);

    const result = readFavoritesFromStorage();
    expect(result).toEqual([sampleFavorite]);
  });

  it("returns empty list for invalid json", () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, "{broken json");

    const result = readFavoritesFromStorage();
    expect(result).toEqual([]);
  });

  it("filters out invalid items", () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([sampleFavorite, { bad: "shape" }, { ...sampleFavorite, type: "unknown" }]),
    );

    const result = readFavoritesFromStorage();
    expect(result).toEqual([sampleFavorite]);
  });

  it("dispatches update event after write", () => {
    const eventListener = vi.fn();
    window.addEventListener(FAVORITES_STORAGE_EVENT, eventListener);

    writeFavoritesToStorage([sampleFavorite]);

    expect(eventListener).toHaveBeenCalledTimes(1);
    window.removeEventListener(FAVORITES_STORAGE_EVENT, eventListener);
  });
});
