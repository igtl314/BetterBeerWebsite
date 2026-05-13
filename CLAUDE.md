# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

BetterBeer is a monorepo with three services:

- **`betterbeerfrontend/`** — Next.js 16 app (React 19, Tailwind CSS 4, HeroUI). Uses Server Components and Server Actions to fetch data from the backend. Reads `BACKEND_URL` env var.
- **`BetterBeerBackend/`** — Elysia (Bun) REST API backed by SQLite via Prisma. Runs on port 3000 (mapped to 3005 in Docker).
- **`goDataCollection/`** — Go service that scrapes the Systembolaget API every 12 hours, computes APK (alcohol per krona), downloads product images as WebP, and POSTs everything to the backend.

### Data flow
1. Go collector fetches products + stock from Systembolaget (store 525, beer category) and writes them to the backend via `POST /stores`, `/products`, `/stock`.
2. Product images are saved to the Docker volume `shared-data` at `/app/images/<productId>.webp`.
3. Frontend fetches stores/products from the backend server-side via `app/_actions/stores.ts`.

### Docker
The backend and data collector are in `compose.yml`; the frontend is deployed separately.

```bash
docker compose up --build       # build and start backend + collector
```

## Commands

### Frontend (`betterbeerfrontend/`)
```bash
npm install
npm run dev        # dev server on :3000 (Turbopack)
npm run build
npm run lint       # Biome
npm run format     # Biome
```
Requires `BACKEND_URL` (e.g. `http://localhost:3005`).

### Backend (`BetterBeerBackend/`)
```bash
bun install
bun prisma migrate dev     # run migrations + regenerate client
bun run server.ts          # dev server on :3000
```
Prisma client is generated to `generated/prisma/` (non-standard path set in `schema.prisma`).

### Data collector (`goDataCollection/`)
```bash
go mod download
go run *.go                # run locally (hits http://localhost:3000 by default)
go test ./...
```
Backend URL is hardcoded in `databaseFunctions.go` — `http://backend:3000` for Docker, `http://localhost:3000` locally.

## Key details

- **APK** (`ProductApk`) = `(alcohol% / 100 * volumeMl) / price` — alcohol-per-krona efficiency metric, used as a sort index.
- **StockInfo** has a composite unique constraint on `(StoreId, ProductId)`.
- The Go collector uses a semaphore channel (buffer 30) to cap concurrent DB writes.
- Binary targets in `schema.prisma` include `linux-arm64` and `debian-openssl-3.0.x` for cross-platform Docker builds; the generated `.node` engine files are gitignored.
- Backend package manager is **Bun** (`bun.lock`); frontend uses **npm** (`package-lock.json`).
