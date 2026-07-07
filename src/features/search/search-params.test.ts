import { describe, expect, it } from "vitest";
import { parseSearchFilters, toSearchParams } from "./search-params";

describe("parseSearchFilters", () => {
  it("parses and sanitizes query params", () => {
    const result = parseSearchFilters({
      query: "  star wars  ",
      year: "2022",
      type: "series",
      page: "3",
    });

    expect(result).toEqual({
      query: "star wars",
      year: "2022",
      type: "series",
      page: 3,
    });
  });

  it("returns safe defaults for invalid values", () => {
    const result = parseSearchFilters({
      query: " ",
      year: "22",
      type: "documentary",
      page: "-4",
    });

    expect(result).toEqual({
      query: "",
      year: "",
      type: "",
      page: 1,
    });
  });

  it("reads first item from array params", () => {
    const result = parseSearchFilters({
      query: ["star wars", "ignored"],
      page: ["2", "9"],
    });

    expect(result.query).toBe("star wars");
    expect(result.page).toBe(2);
  });
});

describe("toSearchParams", () => {
  it("builds query string with only provided values", () => {
    const params = toSearchParams({
      query: "star wars",
      year: "1999",
      type: "movie",
      page: 4,
    });

    expect(params.toString()).toBe("query=star+wars&year=1999&type=movie&page=4");
  });

  it("omits page when equal to first page", () => {
    const params = toSearchParams({
      query: "star wars",
      page: 1,
    });

    expect(params.toString()).toBe("query=star+wars");
  });
});
