# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       Storefront                             │
│              Next.js 15 (port 8000)                          │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Marketing │  │  Portal  │  │   Auth    │  │  Checkout │  │
│  │  (public) │  │  (B2B)   │  │  (Conta)  │  │ (?step=)  │  │
│  └──────────┘  └────┬─────┘  └───────────┘  └───────────┘  │
│                 auth guard:                                   │
│                 JWT + company                                 │
│                 verification                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │ Medusa JS SDK / Server Actions
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     MedusaJS Backend                         │
│                      (port 9000)                             │
│  ┌──────────────┐  ┌────────────┐  ┌─────────────────────┐ │
│  │ Admin API    │  │ Store API  │  │ Vendor API          │ │
│  │ /admin/*     │  │ /store/*   │  │ /vendor/*           │ │
│  └──────┬───────┘  └─────┬──────┘  └──────────┬──────────┘ │
│         │                │                     │            │
│  ┌──────▼────────────────▼─────────────────────▼──────────┐ │
│  │                  Workflows & Steps                      │ │
│  │  company / quote / employee / meilisearch / hooks       │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│         │               │               │                    │
│  ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────────────┐   │
│  │   Modules   │ │    Links    │ │   Subscribers       │   │
│  │ company     │ │ company↔cg  │ │ product-sync        │   │
│  │ quote       │ │ company→cart│ │ product-delete       │   │
│  │ meilisearch │ │ employee→cx │ │ meilisearch-sync     │   │
│  │ email-notif │ │ order→co    │ │ password-reset       │   │
│  └──────┬──────┘ │ quote→*     │ └─────────────────────┘   │
│         │        └─────────────┘                            │
└─────────┼───────────────────────────────────────────────────┘
          │
  ┌───────▼───────┐  ┌────────────┐  ┌──────────────┐
  │  PostgreSQL   │  │   Redis    │  │  Meilisearch │
  │  (port 5432)  │  │ (port 6379)│  │  (port 7700) │
  └───────────────┘  └────────────┘  └──────────────┘
```

## Backend Modules

### Company Module (`backend/src/modules/company/`)
Manages B2B company entities and employees. Companies have customer groups for pricing, and employees have spending limits with configurable reset frequencies (daily, weekly, monthly, yearly).

**Models**: `Company` (name, logo, currency), `Employee` (spending_limit, is_admin flag, linked to customer)

### Quote Module (`backend/src/modules/quote/`)
Full request-for-quote lifecycle. Customers submit RFQs, admins respond with pricing, customers accept/reject. Quotes link to draft orders and carts.

**Models**: `Quote` (status, draft_order_id, cart_id, admin_id, customer_id), `Message` (quote conversation thread)

### Meilisearch Module (`backend/src/modules/meilisearch/`)
Product search indexing service. Syncs products on create/update/delete events. Provides full-text search for the storefront catalog.

**Service-only** (no models) - wraps the Meilisearch client with index/search/delete operations.

### Email Notification Module (`backend/src/modules/email-notification/`)
SMTP email provider using Nodemailer and react-email templates. Currently handles password reset emails with Portuguese URL routing.

**Service-only** - extends `AbstractNotificationProviderService`.

## Storefront Structure

The storefront has three distinct areas:

### Marketing Site (public)
Root-level pages: landing (`/`), about (`/sobre`), contact (`/contacto`), privacy policy (`/politica-privacidade`), terms (`/termos-e-condicoes`), case studies (`/casos-de-sucesso/*`), product categories (`/produtos/*`).

### B2B Portal (authenticated)
Under `/portal/`: catalog (`/portal/catalogo`), cart (`/portal/carrinho`), product pages, category/collection browsing, account dashboard with profile, company, addresses, orders, and quotes management. The portal `layout.tsx` enforces authentication (JWT check) and company verification before rendering — unauthenticated users redirect to `/conta/entrar`, unverified companies redirect to `/conta/verificacao-pendente`.

### Auth Pages
Under `/conta/`: login (`/conta/entrar`), registration (`/conta/registar`), password recovery, email verification pending.

## Data Flow Patterns

### Server Actions (Data Fetching)
Storefront uses server-side functions in `storefront/src/lib/data/` that call the Medusa backend via the JS SDK. These are used in Next.js Server Components and server actions for mutations.

### Cart Context (Optimistic Updates)
`CartProvider` wraps the app with React's `useOptimistic` hook. Cart mutations (add, update quantity, delete) apply immediately to the UI with temporary optimistic IDs (`__optimistic__` prefix), then sync with the server. Failed operations roll back automatically with toast notifications.

### Event Bus
`cart-event-bus.ts` provides cross-component communication for bulk add-to-cart events, allowing product tables to trigger cart updates that the cart drawer picks up.

## Entity Relationships (Links)

MedusaJS uses `defineLink` to create cross-module relationships:

| Link | From | To | Cardinality |
|------|------|----|-------------|
| `company-customer-group` | Company | CustomerGroup | 1:1 |
| `company-carts` | Company | Cart | 1:many |
| `order-company` | Order | Company | 1:1 |
| `employee-customer` | Employee | Customer | 1:1 |
| `quote-cart`, `quote-customer`, `quote-order`, `quote-order-change` | Quote | Cart, Customer, Order (alias: `draft_order`), OrderChange | read-only (field-based links) |

These links are used in workflows to associate entities and in API queries to fetch related data across modules.

## Hook Workflows

MedusaJS hooks allow intercepting core commerce events:

- **`cart-created`**: Links company to cart via `company_id` metadata
- **`validate-cart-completion`**: Enforces employee spending limits before checkout
- **`order-created`**: Links company to order via `company_id` metadata
- **`customer-deleted`**: Soft-deletes linked employee when a customer is deleted via `deleteCustomersWorkflow` (safety net for non-admin-route callers)

### Cascade Deletion

All three entity types cascade deletions bidirectionally:

| Entry Point | Cascade |
|-------------|---------|
| Delete **Company** | → employees (soft) → customers (soft) → auth identities (hard) |
| Delete **Employee** | → customer (soft) → auth identity (hard) |
| Delete **Customer** | → employee (soft) → auth identity (hard) |

Auth identities are hard-deleted (not soft) to enable email reuse for re-registration. Customer email uniqueness uses `WHERE deleted_at IS NULL`, so soft-deleted customers don't block new signups.

## Security

- **Secrets**: `JWT_SECRET` and `COOKIE_SECRET` are required — fail-fast on missing env vars (no fallback defaults)
- **HTTP Headers**: `X-Content-Type-Options`, `X-Frame-Options`, `HSTS`, `Referrer-Policy`, `Permissions-Policy` on all storefront routes
- **Cookies**: `_medusa_cache_id` set with `httpOnly`, `sameSite: lax`, `secure` (production)
- **Rate Limiting**: IP-based throttling via `express-rate-limit` on auth (10 req/15min), quote creation (5 req/hour), and contact form (3 req/hour). See `backend/src/api/middlewares/rate-limiter.ts`
- **Docker**: Pinned image versions (`postgres:16-alpine`, `redis:7-alpine`), parameterized passwords
