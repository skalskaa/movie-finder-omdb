# Movie Finder (OMDb)

A small movie search app I built for a recruitment task on top of the [OMDb API](https://www.omdbapi.com/). You can search by title, narrow results down by year and type, open a details page for any result, and keep a list of favorites that survives a page reload.

## What it does

- Search movies by title, with optional year and type (movie / series / episode) filters
- Paginated results (classic page-by-page, since OMDb returns 10 items per page)
- A details page per movie with metadata for SEO
- Favorites you can add or remove, stored in `localStorage` and kept in sync across tabs
- Sensible messages when the API, network, or input goes wrong instead of a blank screen
- Some accessibility basics: skip link, semantic landmarks, focus styles, alert regions

## Running it locally

You'll need an OMDb API key (free one at their site). Then:

```bash
npm install
echo "OMDB_API_KEY=your_api_key" > .env.local
npm run dev
```

That's it, the app is on [http://localhost:3000](http://localhost:3000).

Other scripts I use while working: `npm run build` / `npm run start` for a production build, `npm run lint`, and `npm run test` (watch) or `npm run test:run` (single run).

## How the code is laid out

```text
src/
  app/                      # routes (home + /movie/[imdbID])
  features/
    search/                 # form, URL param parsing, results list
    favorites/              # storage, hook, toggle button
  lib/
    omdb/                   # API client, DTO->domain mappers, error type
    utils/                  # tiny shared guards
```

The idea I stuck to: the UI never touches raw OMDb JSON. Everything goes through `lib/omdb` first, which fetches, validates the response, and maps OMDb's `PascalCase` fields into plain domain objects. So if OMDb ever changes a field name, there's one place to fix it. Failures all come back as a single `OmdbError` carrying a `code` (`TIMEOUT`, `NETWORK`, `API`, ...), which the pages turn into readable messages.

For favorites I went with `useSyncExternalStore` over `useState` because the same movie can appear in the results list and on its detail page at once, and I wanted both (plus other tabs) to reflect a toggle immediately.

## A few decisions worth calling out

- **Classic pagination over infinite scroll.** The task allowed either; page-by-page maps cleanly to OMDb's paging and is easier to make accessible.
- **Plain `<img>` for posters, not `next/image`.** Posters are arbitrary external URLs and this app doesn't need image optimization yet, so I skipped the extra config.
- **Hand-written response validation instead of a schema library.** For this payload size it's fewer moving parts; if the API surface grew I'd reach for zod.
- **Tests focus on logic, not pixels.** I covered the client and error mapping, DTO mapping, param parsing, favorites storage/hook, and pagination links, rather than full E2E.

## If I kept going

Infinite scroll as an alternative list mode, a couple of E2E happy-path tests, and proper poster image optimization would be the next things on my list.
