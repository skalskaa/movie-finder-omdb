import { describe, expect, it } from "vitest";
import { mapMovieDetails, mapSearchItem } from "./mappers";

describe("mapSearchItem", () => {
  it("maps OMDb list item to app model", () => {
    const result = mapSearchItem({
      Title: "Star Wars",
      Year: "1977",
      imdbID: "tt0076759",
      Type: "movie",
      Poster: "N/A",
    });

    expect(result).toEqual({
      imdbID: "tt0076759",
      title: "Star Wars",
      year: "1977",
      type: "movie",
      posterUrl: null,
    });
  });
});

describe("mapMovieDetails", () => {
  it("normalizes N/A values and maps nested ratings", () => {
    const result = mapMovieDetails({
      Response: "True",
      Title: "Star Wars",
      Year: "1977",
      Rated: "N/A",
      Released: "N/A",
      Runtime: "N/A",
      Genre: "Drama, Mystery, Sci-Fi",
      Director: "N/A",
      Writer: "Dan Erickson",
      Actors: "Adam Scott",
      Plot: "N/A",
      Language: "English",
      Country: "United States",
      Awards: "N/A",
      Poster: "N/A",
      Ratings: [{ Source: "Internet Movie Database", Value: "8.7/10" }],
      Metascore: "N/A",
      imdbRating: "8.7",
      imdbVotes: "250,000",
      imdbID: "tt0076759",
      Type: "movie",
      DVD: "N/A",
      BoxOffice: "N/A",
      Production: "N/A",
      Website: "N/A",
    });

    expect(result.posterUrl).toBeNull();
    expect(result.rated).toBe("");
    expect(result.plot).toBe("");
    expect(result.director).toBe("");
    expect(result.genres).toEqual(["Drama", "Mystery", "Sci-Fi"]);
    expect(result.ratings).toEqual([
      {
        source: "Internet Movie Database",
        value: "8.7/10",
      },
    ]);
  });
});
