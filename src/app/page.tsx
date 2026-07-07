import { SearchForm } from "@/features/search/search-form";
import { SearchResults } from "@/features/search/search-results";
import { parseSearchFilters } from "@/features/search/search-params";
import { OmdbError, omdbClient } from "@/lib/omdb";

type PageSearchParams = Record<string, string | string[] | undefined>;

interface HomePageProps {
  searchParams?: PageSearchParams | Promise<PageSearchParams>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const filters = parseSearchFilters(resolvedSearchParams);
  const hasSearch = Boolean(filters.query);

  let searchErrorMessage = "";
  let searchResults = null;

  if (hasSearch) {
    try {
      searchResults = await omdbClient.searchMovies({
        query: filters.query,
        year: filters.year,
        type: filters.type || undefined,
        page: filters.page,
      });
    } catch (error) {
      if (error instanceof OmdbError) {
        searchErrorMessage = error.message;
      } else {
        searchErrorMessage = "Unexpected error happened while searching.";
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Movie Finder</h1>
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-300">Find movies by title, filter by year and type.</p>

      <SearchForm filters={filters} />

      {!hasSearch && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium">Start searching</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter a title and click Search to load results from OMDb.
          </p>
        </section>
      )}

      {searchErrorMessage && (
        <section className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {searchErrorMessage}
        </section>
      )}

      {searchResults && <SearchResults results={searchResults} filters={filters} />}
    </main>
  );
}
