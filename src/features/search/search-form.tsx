import type { SearchTypeFilter } from "@/lib/omdb";
import type { SearchFilters } from "./search-params";

interface SearchFormProps {
  filters: SearchFilters;
}

const TYPE_OPTIONS: Array<{ value: SearchTypeFilter; label: string }> = [
  { value: "movie", label: "Movie" },
  { value: "series", label: "Series" },
  { value: "episode", label: "Episode" },
];

export function SearchForm({ filters }: SearchFormProps) {
  return (
    <form
      action="/"
      method="get"
      role="search"
      aria-label="Movie search form"
      className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="grid gap-2">
        <label htmlFor="query" className="text-sm font-medium">
          Search title
        </label>
        <input
          id="query"
          name="query"
          defaultValue={filters.query}
          required
          autoComplete="off"
          placeholder="For example: Inception"
          className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="year" className="text-sm font-medium">
            Release year
          </label>
          <input
            id="year"
            name="year"
            defaultValue={filters.year}
            inputMode="numeric"
            pattern="[0-9]{4}"
            aria-describedby="year-hint"
            placeholder="Optional, e.g. 2014"
            className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950"
          />
          <p id="year-hint" className="text-xs text-zinc-500 dark:text-zinc-400">
            Use four digits, for example 2014.
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={filters.type}
            className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950"
          >
            <option value="">Any</option>
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:ring-offset-zinc-950"
        >
          Search
        </button>
      </div>
    </form>
  );
}
