import { describe, expect, it, vi } from "vitest";
import { createOmdbClient } from "./client";
import { OmdbError } from "./errors";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("createOmdbClient", () => {
  it("searches movies and maps list items", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse({
        Response: "True",
        Search: [
          {
            Title: "Star Wars",
            Year: "1977",
            imdbID: "tt0076759",
            Type: "movie",
            Poster: "N/A",
          },
        ],
        totalResults: "14",
      }),
    );

    const client = createOmdbClient({ apiKey: "test-key", fetchFn });
    const result = await client.searchMovies({
      query: "  star wars ",
      page: 1,
      type: "movie",
    });

    expect(result).toEqual({
      items: [
        {
          imdbID: "tt0076759",
          title: "Star Wars",
          year: "1977",
          type: "movie",
          posterUrl: null,
        },
      ],
      page: 1,
      totalResults: 14,
      totalPages: 2,
    });
  });

  it("throws validation error for empty query", async () => {
    const client = createOmdbClient({ apiKey: "test-key", fetchFn: vi.fn() });

    await expect(client.searchMovies({ query: "   " })).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });

  it("maps details payload even when optional fields are missing", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse({
        Response: "True",
        Title: "Star Wars",
        Year: "1977",
        imdbID: "tt0076759",
        Type: "movie",
        Plot: "Luke Skywalker joins the rebellion.",
      }),
    );

    const client = createOmdbClient({ apiKey: "test-key", fetchFn });
    const result = await client.getMovieDetails("tt0076759");

    expect(result.title).toBe("Star Wars");
    expect(result.type).toBe("movie");
    expect(result.runtime).toBe("");
    expect(result.posterUrl).toBeNull();
    expect(result.ratings).toEqual([]);
  });

  it("throws HTTP error with status code", async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse({ message: "unauthorized" }, 401));
    const client = createOmdbClient({ apiKey: "test-key", fetchFn });

    await expect(client.searchMovies({ query: "star wars" })).rejects.toMatchObject({
      code: "HTTP",
      status: 401,
    });
  });

  it("throws API error when OMDb returns False response", async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse({
        Response: "False",
        Error: "Movie not found!",
      }),
    );
    const client = createOmdbClient({ apiKey: "test-key", fetchFn });

    await expect(client.getMovieDetails("tt404")).rejects.toMatchObject({
      code: "API",
      message: "Movie not found!",
    });
  });

  it("throws CONFIG error when key is missing", async () => {
    const previousKey = process.env.OMDB_API_KEY;
    delete process.env.OMDB_API_KEY;

    const client = createOmdbClient({ fetchFn: vi.fn() });
    let thrownError: unknown;

    try {
      await client.searchMovies({ query: "star wars" });
    } catch (error) {
      thrownError = error;
    } finally {
      if (previousKey) {
        process.env.OMDB_API_KEY = previousKey;
      }
    }

    expect(thrownError).toBeInstanceOf(OmdbError);
    expect(thrownError).toMatchObject({ code: "CONFIG" });
  });
});
