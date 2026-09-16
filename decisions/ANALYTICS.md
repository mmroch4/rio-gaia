# Analytics Decision: Umami vs PostHog vs Agilo

**Date:** 2026-04-18
**Status:** Decided
**Context:** Evaluating analytics solutions to replace Vercel Analytics on a self-hosted Hetzner/Coolify infrastructure.

---

## Current State

Vercel Analytics (`@vercel/analytics@^1.4.1`) is installed in the storefront with:
- `<Analytics />` component in root layout (auto page views)
- 9 server-side tracked events: `add_to_cart`, `order_completed`, `customer_logged_in`, `customer_logged_out`, `company_created`, `employee_created`, `quote_created`, `quote_accepted`, `quote_message_created`

**Problem:** The project deploys to Hetzner via Coolify, not Vercel. Vercel Analytics is designed for Vercel-hosted apps — data ownership, platform lock-in, and limited free tier are concerns.

---

## Options Evaluated

### 1. Umami (Self-Hosted)

**What it is:** Open-source website analytics platform. Full replacement for Vercel Analytics / Google Analytics.

| Aspect | Detail |
|--------|--------|
| **Type** | Website analytics (page views + custom events + visitor stats) |
| **Frontend** | Yes — JS tracker with automatic SPA page view detection |
| **Backend** | Yes — HTTP API for server-side events |
| **Cookies** | None (cookieless by design) |
| **GDPR consent** | Not required for analytics |
| **Self-host complexity** | Low — 1 Docker container + PostgreSQL |
| **Cloud pricing** | Hobby ~$9/mo (100K events), Pro ~$20/mo (1M events) |
| **Self-host cost** | Free (unlimited events) |
| **Dashboard** | Built-in, real-time |
| **Session replay** | No |
| **Feature flags** | No |

**Pros:**
- Lightweight, fits existing Coolify/Docker infrastructure
- Cookieless = no GDPR consent needed for analytics
- Full data ownership
- Custom tracker script name bypasses ad blockers
- Server-side tracking via Docker-internal HTTP calls (zero latency overhead)

**Cons:**
- Another service to maintain (updates, backups, monitoring)
- Adds 2 Docker services (umami + umami-db) to the stack
- Basic funnel analysis compared to PostHog
- No session replay

### 2. PostHog (Medusa Module + JS SDK)

**What it is:** Product analytics suite with official Medusa backend integration (`@medusajs/analytics-posthog`).

| Aspect | Detail |
|--------|--------|
| **Type** | Product analytics suite (events + session replay + feature flags + funnels) |
| **Frontend** | Yes — separate `posthog-js` SDK (not part of Medusa module) |
| **Backend** | Yes — via Medusa Analytics Module (`@medusajs/analytics-posthog`) |
| **Cookies** | Yes (uses cookies for user identification) |
| **GDPR consent** | Required |
| **Self-host complexity** | Very high — ClickHouse, Kafka, PostgreSQL, Redis, multiple microservices |
| **Cloud free tier** | 1M events/mo, 5K session recordings, 1 project, 1-year retention |
| **Paid pricing** | Pay-as-you-go: ~$0.00005/event after free tier |
| **Dashboard** | Feature-rich (funnels, cohorts, paths, retention) |
| **Session replay** | Yes |
| **Feature flags** | Yes |

**Medusa module limitation:** Only one analytics provider allowed per Medusa application.

**Pros:**
- Generous free cloud tier (1M events/mo)
- Official Medusa backend integration
- Advanced analytics features (session replay, funnels, feature flags)
- No infrastructure to manage (cloud)

**Cons:**
- Uses cookies — requires GDPR consent management
- Medusa module is backend-only; frontend needs separate `posthog-js` integration
- Self-hosting is extremely complex (not viable for this project's scale)
- Heavier client-side footprint
- Overkill feature set for a B2B ceramics storefront

### 3. Agilo Analytics (Medusa Plugin)

**What it is:** Free admin dashboard plugin that visualizes existing Medusa order/product data. Not an analytics collection tool.

| Aspect | Detail |
|--------|--------|
| **Type** | Admin dashboard reporting plugin |
| **Frontend** | No |
| **Backend** | No (reads existing Medusa data, collects nothing new) |
| **Cookies** | N/A |
| **Self-host complexity** | N/A (Medusa plugin, no extra services) |
| **Cost** | Free (MIT license) |
| **Dashboard** | Built into Medusa admin panel |
| **Requires** | Medusa v2.11.0+ (project has v2.13.4) |

**What it provides:**
- Orders: total orders, total sales, orders/sales over time, top regions, order status breakdown
- Products: top-selling products, out-of-stock variants, low stock variants
- Date range picker with presets

**Pros:**
- 2-minute installation, zero infrastructure overhead
- Free operational insights directly in admin panel
- No data leaves your system

**Cons:**
- Not an analytics solution — no page views, no user behavior, no custom events
- Only visualizes data already in Medusa's database
- Limited to orders and inventory metrics

---

## Comparison Matrix

| Capability | Umami | PostHog | Agilo |
|------------|-------|---------|-------|
| Page views | Automatic | Automatic (JS SDK) | No |
| Custom events | Yes | Yes | No |
| Visitor stats | Yes | Yes | No |
| Order/sales reports | No | No | Yes |
| Inventory monitoring | No | No | Yes |
| Session replay | No | Yes | No |
| Funnels | Basic | Advanced | No |
| Feature flags | No | Yes | No |
| Cookieless | Yes | No | N/A |
| GDPR consent needed | No | Yes | No |
| Self-host viable | Yes (easy) | No (too complex) | N/A (plugin) |
| Cloud free tier | No | 1M events/mo | N/A |
| Infra overhead | Low (2 containers) | None (cloud) / Very high (self-host) | None |
| Medusa integration | Manual (works fine) | Official module | Official plugin |

---

## Decision

### Install now: Agilo Analytics
- Zero overhead, free, 2-minute setup
- Gives admin users order/product reporting
- Complementary to any analytics solution

### Primary analytics: Umami (self-hosted)
- Best fit for self-hosted Hetzner/Coolify infrastructure
- Cookieless = no GDPR consent complexity
- Full data ownership, lightweight Docker footprint
- Server-side tracking via Docker-internal network
- Detailed plan in `ANALYTICS.md` (root)

### Skip: PostHog
- Overkill for project scope (session replay, feature flags not needed)
- Self-hosting not viable; cloud adds external dependency
- Cookie-based = GDPR consent management overhead
- Medusa module alone doesn't replace website analytics

---

## Implementation Order

1. **Agilo Analytics** — install plugin in backend (immediate, ~5 min)
2. **Umami** — follow phased plan in `ANALYTICS.md` (next deployment cycle)

---

## Agilo Analytics — Implementation Plan

### Prerequisites

- Medusa v2.11.0+ (project has v2.13.4)
- Caching Module configured (already satisfied — Redis in prod, in-memory in dev)
- No environment variables required
- No database migrations required

### Step 1: Install the package

```bash
cd backend
yarn add @agilo/medusa-analytics-plugin
```

### Step 2: Add plugin to `medusa-config.ts`

The config currently uses `defineConfig()` with `modules` and `admin` keys but no `plugins` array. Add it:

```typescript
module.exports = defineConfig({
  projectConfig: {
    // ... existing config unchanged ...
  },
  modules,
  plugins: [
    {
      resolve: "@agilo/medusa-analytics-plugin",
      options: {},
    },
  ],
  admin: {
    // ... existing config unchanged ...
  },
});
```

**Why `plugins` and not `modules`?** Agilo is a Medusa v2 plugin, not a standalone module. Plugins can bundle admin UI extensions, API routes, and modules together. Medusa auto-registers a plugin's internal components — you just declare it in the `plugins` array.

### Step 3: Restart the dev server

```bash
yarn dev
```

Medusa rebuilds the admin UI automatically on startup, picking up Agilo's dashboard extension.

### Step 4: Verify

1. Open the Medusa admin at `http://localhost:9000/app`
2. Look for "Analytics" in the admin sidebar
3. Navigate to the Orders and Products tabs
4. Verify date range picker works and data loads correctly

### Production deployment

No additional steps. The plugin is bundled into the admin build during `yarn build`. Since it reads existing Medusa data and uses the already-configured Caching Module, it works in production without any extra environment variables or Docker services.

### What this gives you

| Tab | Metrics |
|-----|---------|
| **Orders** | Total orders, total sales, orders/sales over time (line charts), top regions by sales (bar chart), order status breakdown (pie chart) |
| **Products** | Top-selling products (bar chart), out-of-stock variants (table), low stock variants (table) |

All views support date range filtering: This Month, Last Month, Last 3 Months, Custom Range.

### References

- npm: `@agilo/medusa-analytics-plugin` v1.4.0
- GitHub: https://github.com/Agilo/medusa-analytics-plugin
- Medusa plugin docs: https://docs.medusajs.com/learn/configurations/medusa-config#plugin-configurations-plugins
