export type MovieType = "movie" | "series" | "episode";

export type SearchTypeFilter = MovieType;

export interface SearchMoviesParams {
  query: string;
  page?: number;
  year?: string;
  type?: SearchTypeFilter;
}

export interface MovieListItem {
  imdbID: string;
  title: string;
  year: string;
  type: MovieType;
  posterUrl: string | null;
}

export interface SearchMoviesResult {
  items: MovieListItem[];
  page: number;
  totalResults: number;
  totalPages: number;
}

export interface Rating {
  source: string;
  value: string;
}

export interface MovieDetails {
  imdbID: string;
  title: string;
  year: string;
  rated: string;
  released: string;
  runtime: string;
  genres: string[];
  director: string;
  writer: string;
  actors: string;
  plot: string;
  language: string;
  country: string;
  awards: string;
  posterUrl: string | null;
  ratings: Rating[];
  metascore: string;
  imdbRating: string;
  imdbVotes: string;
  type: MovieType;
  dvd: string;
  boxOffice: string;
  production: string;
  website: string;
}

export interface OmdbErrorDto {
  Response: "False";
  Error: string;
}

export interface OmdbSearchItemDto {
  Title: string;
  Year: string;
  imdbID: string;
  Type: MovieType;
  Poster: string;
}

export interface OmdbSearchResponseDto {
  Response: "True";
  Search: OmdbSearchItemDto[];
  totalResults: string;
}

export interface OmdbRatingDto {
  Source: string;
  Value: string;
}

export interface OmdbMovieDetailsDto {
  Response: "True";
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRatingDto[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: MovieType;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}
