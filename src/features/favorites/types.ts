import type { MovieType } from "@/lib/omdb";

export interface FavoriteMovie {
  imdbID: string;
  title: string;
  year: string;
  type: MovieType;
  posterUrl: string | null;
}
