import Link from "next/link";
import type { SearchMoviesResult } from "@/lib/omdb";
import { FavoriteToggleButton } from "@/features/favorites/favorite-toggle-button";
import type { SearchFilters } from "./search-params";
import { toSearchParams } from "./search-params";

interface SearchResultsProps {
  results: SearchMoviesResult;
  filters: SearchFilters;
}

function createPageHref(filters: SearchFilters, page: number): string {
  const params = toSearchParams({
    query: filters.query,
    year: filters.year,
    type: filters.type,
    page,
  });

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

export function SearchResults({ results, filters }: SearchResultsProps) {
  if (!results.items.length) {
    return (
      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">No results for current filters.</p>
      </section>
    );
  }

  const canGoToPreviousPage = results.page > 1;
  const canGoToNextPage = results.page < results.totalPages;

  return (
    <section className="grid gap-4" aria-labelledby="search-results-heading">
      <h2 id="search-results-heading" className="text-lg font-semibold tracking-tight">
        Search results
      </h2>
      <div className="flex items-center justify-between">
        <p aria-live="polite" className="text-sm text-zinc-600 dark:text-zinc-400">
          Found {results.totalResults} results. Page {results.page} of {results.totalPages || 1}.
        </p>
      </div>

      <ul className="grid gap-3">
        {results.items.map((item) => (
          <li
            key={item.imdbID}
            className="grid gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid gap-1">
                <Link
                  href={`/movie/${item.imdbID}`}
                  className="text-base font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                >
                  {item.title}
                </Link>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.year} | {item.type}
                </div>
              </div>

              <FavoriteToggleButton
                movie={{
                  imdbID: item.imdbID,
                  title: item.title,
                  year: item.year,
                  type: item.type,
                  posterUrl: item.posterUrl,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <nav aria-label="Results pagination" className="flex items-center gap-2">
        {canGoToPreviousPage ? (
          <Link
            href={createPageHref(filters, results.page - 1)}
            className="inline-flex h-10 items-center rounded-lg border border-zinc-300 px-3 text-sm font-medium transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950"
          >
            Previous
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
          >
            Previous
          </span>
        )}

        {canGoToNextPage ? (
          <Link
            href={createPageHref(filters, results.page + 1)}
            className="inline-flex h-10 items-center rounded-lg border border-zinc-300 px-3 text-sm font-medium transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950"
          >
            Next
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
          >
            Next
          </span>
        )}
      </nav>
    </section>
  );
}
