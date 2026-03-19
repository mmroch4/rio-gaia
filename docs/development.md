# Development Guide

## Prerequisites

- **Node.js** >= 20
- **Yarn** (package manager for both backend and storefront)
- **Docker** & **Docker Compose** (for PostgreSQL, Redis, Meilisearch)

## Environment Setup

### Backend

Copy the template and fill in values:

```bash
cd backend
cp .env.template .env
```

Key variables to configure:

```env
DATABASE_URL=postgres://postgres:docker@localhost:5432/medusajs-test
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_API_KEY=minhasupersenhasegura
MEILISEARCH_PRODUCT_INDEX_NAME=products
BACKEND_URL=http://localhost:9000
STOREFRONT_URL=http://localhost:8000

# SMTP (optional for dev)
SMTP_HOST=
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@riogaia.com
```

### Storefront

Create `.env.local`:

```bash
cd storefront
```

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<your-publishable-key>
NEXT_PUBLIC_MEILISEARCH_HOST=http://127.0.0.1:7700
NEXT_PUBLIC_MEILISEARCH_API_KEY=minhasupersenhasegura
```

The publishable key is created in the Medusa admin panel under Settings > API Keys.

## Docker Services

From the `backend/` directory:

```bash
docker compose up -d
```

This starts:

| Service | Port | Credentials |
|---------|------|------------|
| PostgreSQL | 5432 | postgres:docker, db: medusajs-test |
| Redis | 6379 | (no auth) |
| Meilisearch | 7700 | master key: minhasupersenhasegura |

Data persists in Docker volumes (`pgdata`, `meilisearch_data`).

## Running the Project

### Backend

```bash
cd backend
yarn install
yarn dev        # Starts on port 9000, admin UI at http://localhost:9000/app
```

On first run, Medusa will run migrations automatically. Create an admin user:

```bash
npx medusa user -e admin@riogaia.com -p your-password
```

### Storefront

```bash
cd storefront
yarn install
yarn dev        # Starts on port 8000
```

Visit `http://localhost:8000/pt` (Portugal region).

## Seeding Data

```bash
cd backend
yarn seed
```

The seed script at `backend/src/scripts/seed.ts` populates the database with initial data.

## Database Migrations

MedusaJS handles core migrations automatically. For custom modules:

```bash
# Generate a new migration after model changes
npx medusa db:generate <module-name>

# Run pending migrations
npx medusa db:migrate

# Sync links (after adding/modifying defineLink)
npx medusa db:sync-links
```

## Testing

```bash
cd backend

# HTTP integration tests (API endpoints)
yarn test:integration:http

# Module integration tests (service layer)
yarn test:integration:modules

# Unit tests
yarn test:unit
```

```bash
cd storefront
yarn lint       # ESLint
```

## Common Tasks

### Adding a New API Route

1. Create route directory: `backend/src/api/{admin|store}/<resource>/`
2. Add `route.ts` with HTTP method handlers (GET, POST, DELETE)
3. Add `validators.ts` with Zod schemas for request validation
4. Add `query-config.ts` with allowed fields and relations
5. Add `middlewares.ts` with validation and auth middleware
6. Register middleware in the scope's middleware aggregator (e.g., `backend/src/api/admin/middlewares.ts`)
7. Export from `backend/src/api/middlewares.ts`

### Adding a Storefront Page

1. Create page file: `storefront/src/app/[countryCode]/<path>/page.tsx`
2. For portal pages: nest under `portal/` to use the authenticated layout
3. For marketing pages: place at the `[countryCode]` root level
4. Use server actions from `src/lib/data/` for data fetching
5. Use components from `src/modules/<feature>/`

### Creating a New Module

1. Create directory: `backend/src/modules/<name>/`
2. Define models in `models/` using `model.define()`
3. Create `service.ts` extending `MedusaService`
4. Create `index.ts` exporting the module constant and loader
5. Register in `backend/medusa-config.ts`
6. Generate and run migrations: `npx medusa db:generate <name> && npx medusa db:migrate`
7. Add types in `backend/src/types/<name>/`

### Adding a Cross-Module Link

1. Create link file: `backend/src/links/<descriptive-name>.ts`
2. Use `defineLink` from `@medusajs/framework/utils`
3. Run `npx medusa db:sync-links` to create the link table
4. Use in workflows to create/query relationships

### Adding a Subscriber

1. Create file: `backend/src/subscribers/<name>.ts`
2. Export default config with `event` and `handler`
3. Handler receives `SubscriberArgs` with event data and container for resolving services

### Triggering Meilisearch Sync

```bash
# Via admin API
curl -X POST http://localhost:9000/admin/meilisearch/sync

# Products auto-sync on create/update/delete via subscribers
```
