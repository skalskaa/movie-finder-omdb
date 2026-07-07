import Link from "next/link";
import type { SearchMoviesResult } from "@/lib/omdb";
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
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Found {results.totalResults} results. Page {results.page} of {results.totalPages || 1}.
        </p>
      </div>

      <ul className="grid gap-3">
        {results.items.map((item) => (
          <li
            key={item.imdbID}
            className="grid gap-1 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <Link href={`/movie/${item.imdbID}`} className="text-base font-semibold hover:underline">
              {item.title}
            </Link>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {item.year} | {item.type}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2">
        <Link
          href={createPageHref(filters, results.page - 1)}
          aria-disabled={!canGoToPreviousPage}
          className={`inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium transition ${
            canGoToPreviousPage
              ? "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              : "pointer-events-none border border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
          }`}
        >
          Previous
        </Link>

        <Link
          href={createPageHref(filters, results.page + 1)}
          aria-disabled={!canGoToNextPage}
          className={`inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium transition ${
            canGoToNextPage
              ? "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              : "pointer-events-none border border-zinc-200 text-zinc-400 dark:border-zinc-800 dark:text-zinc-600"
          }`}
        >
          Next
        </Link>
      </div>
    </section>
  );
}
