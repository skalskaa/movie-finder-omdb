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
          placeholder="For example: Inception"
          className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
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
            placeholder="Optional, e.g. 2014"
            className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={filters.type}
            className="h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
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
          className="inline-flex h-11 items-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Search
        </button>
      </div>
    </form>
  );
}
