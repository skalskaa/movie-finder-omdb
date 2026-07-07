import type { SearchTypeFilter } from "@/lib/omdb";

export interface SearchFilters {
  query: string;
  year: string;
  type: SearchTypeFilter | "";
  page: number;
}

export type SearchParamsInput = Record<string, string | string[] | undefined>;

const ALLOWED_TYPES: SearchTypeFilter[] = ["movie", "series", "episode"];

function pickFirst(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function sanitizeQuery(value: string): string {
  return value.trim();
}

function sanitizeYear(value: string): string {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return "";
  }

  if (!/^\d{4}$/.test(trimmedValue)) {
    return "";
  }

  return trimmedValue;
}

function sanitizeType(value: string): SearchTypeFilter | "" {
  return ALLOWED_TYPES.includes(value as SearchTypeFilter) ? (value as SearchTypeFilter) : "";
}

function sanitizePage(value: string): number {
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return parsedValue;
}

export function parseSearchFilters(searchParams: SearchParamsInput): SearchFilters {
  return {
    query: sanitizeQuery(pickFirst(searchParams.query)),
    year: sanitizeYear(pickFirst(searchParams.year)),
    type: sanitizeType(pickFirst(searchParams.type)),
    page: sanitizePage(pickFirst(searchParams.page)),
  };
}

export function toSearchParams(filters: Partial<SearchFilters>): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.query) {
    params.set("query", filters.query);
  }

  if (filters.year) {
    params.set("year", filters.year);
  }

  if (filters.type) {
    params.set("type", filters.type);
  }

  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params;
}
