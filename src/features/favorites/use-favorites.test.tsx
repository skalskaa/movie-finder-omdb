// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavorites } from "./use-favorites";

const favoriteMovie = {
  imdbID: "tt0076759",
  title: "Star Wars",
  year: "1977",
  type: "movie" as const,
  posterUrl: null,
};

describe("useFavorites", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("toggles favorite on and off", () => {
    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite(favoriteMovie.imdbID)).toBe(false);

    act(() => {
      result.current.toggleFavorite(favoriteMovie);
    });

    expect(result.current.isFavorite(favoriteMovie.imdbID)).toBe(true);

    act(() => {
      result.current.toggleFavorite(favoriteMovie);
    });

    expect(result.current.isFavorite(favoriteMovie.imdbID)).toBe(false);
  });
});
