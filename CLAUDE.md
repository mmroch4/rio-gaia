# Rio Gaia B2B Ecommerce

B2B ecommerce platform for a Portuguese ceramic company built on MedusaJS v2.8.4 (backend) and Next.js 15 (storefront). Features company management, employee hierarchies with spending limits, quote workflows, Meilisearch product search, and SMTP email notifications. Portuguese-language storefront with routes like `/conta`, `/portal`, `/produtos`.

## Tech Stack

- **Backend**: MedusaJS v2.8.4, MikroORM, PostgreSQL, Redis, Zod validation
- **Storefront**: Next.js 15 (App Router), React 19, Tailwind CSS, Geist font
- **Search**: Meilisearch v1.11 with real-time product sync
- **Payments**: Stripe, PayPal
- **Email**: Nodemailer + react-email templates
- **Package Manager**: Yarn (both packages)

## Project Structure

```
backend/
  src/
    admin/           # Admin dashboard UI extensions (Medusa admin)
    api/             # API routes: admin/, store/, vendor/
    links/           # defineLink entity relationships
    modules/         # Custom modules: company, quote, meilisearch, email-notification
    subscribers/     # Event handlers (product sync, password reset)
    workflows/       # Business logic: company, quote, employee, meilisearch, hooks
    types/           # Shared TypeScript types
    scripts/         # Seed script
  medusa-config.ts   # Module registration, CORS, DB config
  compose.yml        # Docker: PostgreSQL, Redis, Meilisearch

storefront/
  src/
    app/
      robots.ts              # robots.txt generation (blocks /portal/, /conta/, /api/)
      sitemap.ts             # Static sitemap of all public /pt/ pages
      [countryCode]/
        page.tsx                    # Landing page
      conta/                      # Auth pages (entrar, registar, recuperar-password)
      portal/                     # Authenticated B2B area
        catalogo/                 # Product catalog
        carrinho/                 # Cart
        conta/                    # Account dashboard (perfil, empresa, moradas, encomendas, orcamentos)
        produtos/[handle]/        # Product detail
        categorias/[...category]/ # Category pages
        colecoes/[handle]/        # Collection pages
      sobre/, contacto/, casos-de-sucesso/  # Marketing pages
      produtos/                   # Public product category pages
    lib/
      config.ts        # Medusa SDK + Meilisearch client init
      context/         # Cart context with optimistic updates
      data/            # Server-side data fetching (cart, companies, customer, etc.)
      data/cookies.ts  # Cookie management (auth JWT, cart ID, cache ID)
      util/            # Utility functions (pricing, spending limits, CSV export, checkout steps)
    config/            # Company config constants (name, VAT, address, social links)
    modules/           # UI organized by feature (account, cart, checkout, products, etc.)
    styles/globals.css # Tailwind + CSS variables + custom typography
    middleware.ts      # Region detection, country routing, cart cookie handling
```

## Common Commands

```bash
# Backend
cd backend
yarn dev              # Dev server (port 9000, admin at /app)
yarn build            # Production build
yarn seed             # Seed database
yarn test:integration:http     # HTTP integration tests
yarn test:integration:modules  # Module integration tests
yarn test:unit                 # Unit tests

# Storefront
cd storefront
yarn dev              # Dev server (port 8000)
yarn build            # Production build
yarn lint             # ESLint

# Docker (from backend/)
docker compose up -d  # PostgreSQL (5432), Redis (6379), Meilisearch (7700)
```

## Environment Variables

### Backend (`backend/.env`)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis URL
- `JWT_SECRET`, `COOKIE_SECRET` - Auth secrets
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` - CORS origins
- `MEILISEARCH_HOST`, `MEILISEARCH_API_KEY`, `MEILISEARCH_PRODUCT_INDEX_NAME`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` - Email
- `BACKEND_URL`, `STOREFRONT_URL`

### Storefront (`storefront/.env`)
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend API URL
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - Medusa publishable API key
- `NEXT_PUBLIC_MEILISEARCH_HOST`, `NEXT_PUBLIC_MEILISEARCH_API_KEY`, `NEXT_PUBLIC_MEILISEARCH_INDEX_NAME`

## Key Patterns

- **API routes**: `src/api/{admin|store|vendor}/resource/route.ts` with separate `middlewares.ts`, `validators.ts`, `query-config.ts`
- **Modules**: `src/modules/name/` with `index.ts` (registration), `service.ts`, `models/`, `migrations/`
- **Workflows**: `src/workflows/name/workflows/` + `steps/` - all mutations go through workflows
- **Links**: `src/links/` - cross-module entity relationships via `defineLink`
- **Storefront data**: Server actions in `src/lib/data/` using Medusa JS SDK
- **Cart**: Optimistic updates via `useOptimistic` hook in `CartProvider`
- **Storefront routing**: Marketing pages at root, authenticated portal under `/portal/`, auth under `/conta/`
- **Auth**: JWT in httpOnly cookie (`_medusa_jwt`), signup creates customer+company+employee atomically
- **Checkout**: URL-driven steps via `?step=` search params (shipping-address → billing-address → delivery → contact-information → payment)
- **Caching**: Per-session cache tags via `_medusa_cache_id` cookie, `getCacheTag(tag)` builds `{tag}-{cacheId}`
- **Analytics**: Vercel Analytics tracking key B2B events (add_to_cart, order_completed, company_created, etc.)
- **Config**: Company details in `storefront/src/config/index.ts`
- **Default region**: Portugal (`pt`)
- **SEO**: Title template `"%s | Rio Gaia"` in root layout — pages export only page-specific titles. `robots.ts` blocks `/portal/`, `/conta/`, `/api/`. `sitemap.ts` lists static public `/pt/` pages. Portal layout sets `noindex, nofollow`.

## Custom Modules

| Module | Purpose | Key Models |
|--------|---------|------------|
| `company` | B2B company & employee management | Company, Employee |
| `quote` | Request-for-quote workflow | Quote, Message |
| `meilisearch` | Product search indexing | - (service only) |
| `email-notification` | SMTP email via react-email | - (provider service) |

## Links (Entity Relationships)

- Company <-> CustomerGroup, Company -> Cart, Company -> Order
- Employee -> Customer
- Quote -> Cart, Order, OrderChange, User, Customer

## Detailed Documentation

See `docs/` for in-depth guides: [architecture](docs/architecture.md) | [backend](docs/backend.md) | [storefront](docs/storefront.md) | [development](docs/development.md) | [api-reference](docs/api-reference.md)
