import type {
  MovieDetails,
  MovieListItem,
  OmdbMovieDetailsDto,
  OmdbSearchItemDto,
  Rating,
} from "./types";

const NOT_AVAILABLE_VALUE = "N/A";

function toNullable(value: string): string | null {
  return value === NOT_AVAILABLE_VALUE ? null : value;
}

function toFallback(value: string): string {
  return value === NOT_AVAILABLE_VALUE ? "" : value;
}

function toGenres(genre: string): string[] {
  if (genre === NOT_AVAILABLE_VALUE) {
    return [];
  }

  return genre
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toRatings(ratings: OmdbMovieDetailsDto["Ratings"]): Rating[] {
  if (!Array.isArray(ratings)) {
    return [];
  }

  return ratings.map((rating) => ({
    source: rating.Source,
    value: rating.Value,
  }));
}

export function mapSearchItem(dto: OmdbSearchItemDto): MovieListItem {
  return {
    imdbID: dto.imdbID,
    title: dto.Title,
    year: dto.Year,
    type: dto.Type,
    posterUrl: toNullable(dto.Poster),
  };
}

export function mapMovieDetails(dto: OmdbMovieDetailsDto): MovieDetails {
  return {
    imdbID: dto.imdbID,
    title: dto.Title,
    year: dto.Year,
    rated: toFallback(dto.Rated),
    released: toFallback(dto.Released),
    runtime: toFallback(dto.Runtime),
    genres: toGenres(dto.Genre),
    director: toFallback(dto.Director),
    writer: toFallback(dto.Writer),
    actors: toFallback(dto.Actors),
    plot: toFallback(dto.Plot),
    language: toFallback(dto.Language),
    country: toFallback(dto.Country),
    awards: toFallback(dto.Awards),
    posterUrl: toNullable(dto.Poster),
    ratings: toRatings(dto.Ratings),
    metascore: toFallback(dto.Metascore),
    imdbRating: toFallback(dto.imdbRating),
    imdbVotes: toFallback(dto.imdbVotes),
    type: dto.Type,
    dvd: toFallback(dto.DVD),
    boxOffice: toFallback(dto.BoxOffice),
    production: toFallback(dto.Production),
    website: toFallback(dto.Website),
  };
}
