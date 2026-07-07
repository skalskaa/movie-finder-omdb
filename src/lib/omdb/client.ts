import { OmdbError } from "@/lib/omdb/errors";
import { mapMovieDetails, mapSearchItem } from "@/lib/omdb/mappers";
import { isRecord, isString } from "@/lib/utils/guards";
import type {
  MovieDetails,
  OmdbErrorDto,
  OmdbMovieDetailsDto,
  OmdbSearchResponseDto,
  SearchMoviesParams,
  SearchMoviesResult,
} from "@/lib/omdb/types";

const BASE_URL = "https://www.omdbapi.com/";
const DEFAULT_TIMEOUT_MS = 8000;

type FetchFn = typeof fetch;

interface OmdbClientOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetchFn?: FetchFn;
}

function parseTotalResults(value: string): number {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function normalizePage(value?: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function ensureApiKey(apiKey?: string): string {
  if (apiKey && apiKey.trim()) {
    return apiKey.trim();
  }

  const envApiKey = process.env.OMDB_API_KEY?.trim();
  if (!envApiKey) {
    throw new OmdbError("Missing OMDB_API_KEY environment variable.", { code: "CONFIG" });
  }

  return envApiKey;
}

function createUrl(baseUrl: string, params: Record<string, string>): URL {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value.trim()) {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

// OMDb has no schema/OpenAPI, so we hand-check the fields the UI depends on
// instead of trusting the raw JSON. Kept dependency-free on purpose; if the
// payload grows, swap this for zod/valibot rather than extending by hand.
function isSearchItem(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.Title) &&
    isString(value.Year) &&
    isString(value.imdbID) &&
    (value.Type === "movie" || value.Type === "series" || value.Type === "episode") &&
    isString(value.Poster)
  );
}

function isRating(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return isString(value.Source) && isString(value.Value);
}

function getStringField(
  payload: Record<string, unknown>,
  field: string,
  fallback = "N/A",
): string {
  const value = payload[field];
  return isString(value) ? value : fallback;
}

function parseErrorResponse(payload: unknown): OmdbErrorDto | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (payload.Response !== "False") {
    return null;
  }

  if (!isString(payload.Error)) {
    return null;
  }

  return {
    Response: "False",
    Error: payload.Error,
  };
}

function parseSearchResponse(payload: unknown): OmdbSearchResponseDto | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (payload.Response !== "True") {
    return null;
  }

  if (!Array.isArray(payload.Search) || !payload.Search.every(isSearchItem)) {
    return null;
  }

  if (!isString(payload.totalResults)) {
    return null;
  }

  return {
    Response: "True",
    Search: payload.Search,
    totalResults: payload.totalResults,
  };
}

function parseMovieDetailsResponse(payload: unknown): OmdbMovieDetailsDto | null {
  if (!isRecord(payload) || payload.Response !== "True") {
    return null;
  }

  if (!isString(payload.Title) || !isString(payload.Year) || !isString(payload.imdbID)) {
    return null;
  }

  if (!(payload.Type === "movie" || payload.Type === "series" || payload.Type === "episode")) {
    return null;
  }

  const ratings =
    Array.isArray(payload.Ratings) && payload.Ratings.every(isRating)
      ? payload.Ratings
      : [];

  return {
    Response: "True",
    Title: payload.Title,
    Year: payload.Year,
    Rated: getStringField(payload, "Rated"),
    Released: getStringField(payload, "Released"),
    Runtime: getStringField(payload, "Runtime"),
    Genre: getStringField(payload, "Genre"),
    Director: getStringField(payload, "Director"),
    Writer: getStringField(payload, "Writer"),
    Actors: getStringField(payload, "Actors"),
    Plot: getStringField(payload, "Plot"),
    Language: getStringField(payload, "Language"),
    Country: getStringField(payload, "Country"),
    Awards: getStringField(payload, "Awards"),
    Poster: getStringField(payload, "Poster"),
    Ratings: ratings,
    Metascore: getStringField(payload, "Metascore"),
    imdbRating: getStringField(payload, "imdbRating"),
    imdbVotes: getStringField(payload, "imdbVotes"),
    imdbID: payload.imdbID,
    Type: payload.Type,
    DVD: getStringField(payload, "DVD"),
    BoxOffice: getStringField(payload, "BoxOffice"),
    Production: getStringField(payload, "Production"),
    Website: getStringField(payload, "Website"),
  };
}

export function createOmdbClient(options: OmdbClientOptions = {}) {
  const {
    apiKey: apiKeyOption,
    baseUrl = BASE_URL,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    fetchFn = fetch,
  } = options;

  async function request<TResponse>(
    params: Record<string, string>,
    parseResponse: (payload: unknown) => TResponse | null,
  ): Promise<TResponse> {
    const apiKey = ensureApiKey(apiKeyOption);
    const url = createUrl(baseUrl, {
      apikey: apiKey,
      ...params,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeoutMs);

    let response: Response;

    try {
      response = await fetchFn(url, {
        method: "GET",
        signal: controller.signal,
      });
    } catch (error) {
      if (isAbortError(error)) {
        throw new OmdbError(`OMDb request timed out after ${timeoutMs}ms.`, { code: "TIMEOUT" });
      }
      throw new OmdbError("Unable to reach OMDb API.", { code: "NETWORK" });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new OmdbError(`OMDb request failed with status ${response.status}.`, {
        code: "HTTP",
        status: response.status,
      });
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new OmdbError("OMDb response is not valid JSON.", { code: "PARSE" });
    }

    const errorResponse = parseErrorResponse(payload);
    if (errorResponse) {
      throw new OmdbError(errorResponse.Error || "OMDb API returned an unknown error.", { code: "API" });
    }

    const parsedResponse = parseResponse(payload);
    if (!parsedResponse) {
      throw new OmdbError("OMDb response has unexpected shape.", { code: "PARSE" });
    }

    return parsedResponse;
  }

  async function searchMovies(params: SearchMoviesParams): Promise<SearchMoviesResult> {
    const query = params.query.trim();
    if (!query) {
      throw new OmdbError("Search query cannot be empty.", { code: "VALIDATION" });
    }

    const page = normalizePage(params.page);
    const payload = await request(
      {
        s: query,
        page: String(page),
        y: params.year?.trim() ?? "",
        type: params.type ?? "",
      },
      parseSearchResponse,
    );

    const totalResults = parseTotalResults(payload.totalResults);
    const totalPages = totalResults > 0 ? Math.ceil(totalResults / 10) : 0;

    return {
      items: payload.Search.map(mapSearchItem),
      page,
      totalResults,
      totalPages,
    };
  }

  async function getMovieDetails(imdbID: string): Promise<MovieDetails> {
    const normalizedId = imdbID.trim();
    if (!normalizedId) {
      throw new OmdbError("Movie id cannot be empty.", { code: "VALIDATION" });
    }

    const payload = await request(
      {
        i: normalizedId,
        plot: "full",
      },
      parseMovieDetailsResponse,
    );

    return mapMovieDetails(payload);
  }

  return {
    searchMovies,
    getMovieDetails,
  };
}

export const omdbClient = createOmdbClient();
