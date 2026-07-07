// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SearchResults } from "./search-results";

afterEach(() => {
  cleanup();
});

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const filters = {
  query: "star wars",
  year: "",
  type: "",
  page: 1,
} as const;

describe("SearchResults", () => {
  it("renders results summary and movie links", () => {
    render(
      <SearchResults
        filters={filters}
        results={{
          items: [
            {
              imdbID: "tt0076759",
              title: "Star Wars",
              year: "1977",
              type: "movie",
              posterUrl: null,
            },
          ],
          page: 1,
          totalResults: 14,
          totalPages: 2,
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Search results" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Star Wars" }).getAttribute("href")).toBe("/movie/tt0076759");
    expect(screen.getByText("Found 14 results. Page 1 of 2.")).toBeTruthy();
  });

  it("shows disabled previous on first page and enabled next link", () => {
    render(
      <SearchResults
        filters={filters}
        results={{
          items: [
            {
              imdbID: "tt0076759",
              title: "Star Wars",
              year: "1977",
              type: "movie",
              posterUrl: null,
            },
          ],
          page: 1,
          totalResults: 14,
          totalPages: 2,
        }}
      />,
    );

    expect(screen.getByText("Previous").closest("span")?.getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("link", { name: "Next" }).getAttribute("href")).toBe("/?query=star+wars&page=2");
  });
});
