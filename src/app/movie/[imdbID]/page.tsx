import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { type MovieDetails, OmdbError, omdbClient } from "@/lib/omdb";

interface MovieDetailsPageProps {
  params: Promise<{ imdbID: string }>;
}

const getMovieDetails = cache(async (imdbID: string) => {
  return omdbClient.getMovieDetails(imdbID);
});

function getErrorMessage(error: unknown): string {
  if (error instanceof OmdbError) {
    switch (error.code) {
      case "API":
        return "Movie not found in OMDb database.";
      case "TIMEOUT":
        return "Request timed out. Please try again.";
      case "NETWORK":
        return "Network error while loading movie details.";
      default:
        return error.message;
    }
  }

  return "Unexpected error happened while loading movie details.";
}

export async function generateMetadata({ params }: MovieDetailsPageProps): Promise<Metadata> {
  const { imdbID } = await params;

  try {
    const movie = await getMovieDetails(imdbID);
    return {
      title: `${movie.title} (${movie.year}) | Movie Finder`,
      description: movie.plot || `Movie details for ${movie.title}.`,
    };
  } catch {
    return {
      title: "Movie details | Movie Finder",
      description: "Movie details page.",
    };
  }
}

interface MovieDetailsViewProps {
  movie: MovieDetails;
}

function MovieDetailsView({ movie }: MovieDetailsViewProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-zinc-600 hover:underline dark:text-zinc-300">
          Back to search
        </Link>
      </div>

      <section className="grid gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-[220px,1fr]">
        <div>
          {movie.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={movie.posterUrl}
              alt={`Poster for ${movie.title}`}
              className="w-full rounded-lg border border-zinc-200 object-cover dark:border-zinc-800"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No poster
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <header className="grid gap-1">
            <h1 className="text-3xl font-semibold tracking-tight">{movie.title}</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {movie.year} | {movie.type} | IMDb: {movie.imdbRating || "N/A"}
            </p>
          </header>

          <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">{movie.plot || "No description."}</p>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Genre</dt>
              <dd className="text-sm">{movie.genres.length ? movie.genres.join(", ") : "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Runtime</dt>
              <dd className="text-sm">{movie.runtime || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Director</dt>
              <dd className="text-sm">{movie.director || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Actors</dt>
              <dd className="text-sm">{movie.actors || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Language</dt>
              <dd className="text-sm">{movie.language || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Country</dt>
              <dd className="text-sm">{movie.country || "N/A"}</dd>
            </div>
          </dl>

          {movie.ratings.length > 0 && (
            <section className="grid gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">Ratings</h2>
              <ul className="grid gap-1">
                {movie.ratings.map((rating) => (
                  <li key={rating.source} className="text-sm">
                    <span className="font-medium">{rating.source}</span>: {rating.value}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

interface MovieErrorViewProps {
  message: string;
}

function MovieErrorView({ message }: MovieErrorViewProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <Link href="/" className="text-sm text-zinc-600 hover:underline dark:text-zinc-300">
        Back to search
      </Link>
      <section className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
        {message}
      </section>
    </main>
  );
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { imdbID } = await params;
  let movie: MovieDetails | null = null;
  let errorMessage = "";

  try {
    movie = await getMovieDetails(imdbID);
  } catch (error) {
    errorMessage = getErrorMessage(error);
  }

  if (!movie) {
    return <MovieErrorView message={errorMessage || "Unable to load movie details."} />;
  }

  return <MovieDetailsView movie={movie} />;
}
