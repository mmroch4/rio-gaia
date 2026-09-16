# Umami Analytics Integration Plan

Replace Vercel Analytics with self-hosted Umami — cookieless, GDPR-compliant, open-source.
Deployed on Hetzner via Coolify alongside the existing stack.

---

## Phase 1: Infrastructure — Coolify Deployment

### Updated architecture

```
                          ┌─── Hetzner VPS (CX42) ──────────────────────────┐
                          │                                                  │
  riogaia.com ──► Traefik ├──► storefront (Next.js, port 3000)              │
  api.riogaia.com ────────├──► medusa-server (API + Admin, port 9000)       │
  search.riogaia.com ─────├──► meilisearch (port 7700)                      │
  analytics.riogaia.com ──├──► umami (port 3000)                  ← NEW    │
                          │                                                  │
                          │    medusa-worker (background jobs, no port)      │
                          │    postgres (internal, port 5432)                │
                          │    redis (internal, port 6379)                   │
                          │    umami-db (internal, port 5432)      ← NEW    │
                          └──────────────────────────────────────────────────┘
```

### Add to `compose.prod.yml`

Two new services under the `# ── Infrastructure ──` section:

```yaml
  umami-db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${UMAMI_DB_USER:-umami}
      POSTGRES_PASSWORD: ${UMAMI_DB_PASSWORD:?Umami DB password required}
      POSTGRES_DB: ${UMAMI_DB_NAME:-umami}
    volumes:
      - umami_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${UMAMI_DB_USER:-umami}"]
      interval: 10s
      timeout: 5s
      retries: 5

  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://${UMAMI_DB_USER:-umami}:${UMAMI_DB_PASSWORD}@umami-db:5432/${UMAMI_DB_NAME:-umami}
      APP_SECRET: ${UMAMI_APP_SECRET:?Umami app secret required}
      TRACKER_SCRIPT_NAME: ${UMAMI_TRACKER_SCRIPT_NAME:-rg-analytics}
      COLLECT_API_ENDPOINT: /api/send
      CORS_MAX_AGE: "86400"
      DISABLE_TELEMETRY: "1"
      REMOVE_TRAILING_SLASH: "1"
    depends_on:
      umami-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--spider", "http://localhost:3000/api/heartbeat"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Add `umami_pgdata` to the `volumes:` section.

Add Umami env vars to the storefront `build.args`:

```yaml
  storefront:
    build:
      args:
        # ... existing args ...
        NEXT_PUBLIC_UMAMI_URL: ${NEXT_PUBLIC_UMAMI_URL:-}
        NEXT_PUBLIC_UMAMI_WEBSITE_ID: ${NEXT_PUBLIC_UMAMI_WEBSITE_ID:-}
        NEXT_PUBLIC_UMAMI_SCRIPT_NAME: ${NEXT_PUBLIC_UMAMI_SCRIPT_NAME:-rg-analytics.js}
        NEXT_PUBLIC_UMAMI_DOMAINS: ${NEXT_PUBLIC_UMAMI_DOMAINS:-}
    environment:
      # ... existing env ...
      UMAMI_INTERNAL_URL: http://umami:3000
```

**Note**: No `ports:` on `umami` or `umami-db` — Traefik handles external routing via domain assignment in Coolify. Internal Docker networking handles service-to-service communication.

### DNS record

Add an A record in your DNS provider:

| Subdomain | Target |
|-----------|--------|
| `analytics.riogaia.com` | `<server-ip>` |

### Coolify configuration

1. **Environment Variables** — add in Coolify UI → Project → Environment:

```
# ── Umami ──
UMAMI_DB_USER=umami
UMAMI_DB_PASSWORD=                    # openssl rand -hex 24
UMAMI_DB_NAME=umami
UMAMI_APP_SECRET=                     # openssl rand -hex 32
UMAMI_TRACKER_SCRIPT_NAME=rg-analytics
```

2. **Storefront build variables** — add and tick **"Build Variable"**:

```
NEXT_PUBLIC_UMAMI_URL=https://analytics.riogaia.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=         # UUID from Umami dashboard (set after first deploy)
NEXT_PUBLIC_UMAMI_SCRIPT_NAME=rg-analytics.js
NEXT_PUBLIC_UMAMI_DOMAINS=riogaia.com,www.riogaia.com
```

3. **Domain assignment** in Coolify → Service Configuration:
   - `umami` → `https://analytics.riogaia.com` (port 3000)
   - `umami-db` → no domain (internal only)

   Coolify auto-provisions the Let's Encrypt TLS certificate for `analytics.riogaia.com`.

### Post-deploy steps

1. Deploy via Coolify
2. Visit `https://analytics.riogaia.com` — login with default `admin` / `umami`
3. **Change the default password immediately**
4. Add Website → name: `Rio Gaia`, domain: `riogaia.com` → copy the **Website ID** (UUID)
5. Go back to Coolify → paste the UUID into `NEXT_PUBLIC_UMAMI_WEBSITE_ID` → **redeploy storefront**
6. In Umami → Website Settings → set "Allowed URLs" to `riogaia.com,www.riogaia.com`

### Update `.env.production.template`

Add to the file:

```
# ── Umami Analytics ──
UMAMI_DB_USER=umami
UMAMI_DB_PASSWORD=                    # openssl rand -hex 24
UMAMI_DB_NAME=umami
UMAMI_APP_SECRET=                     # openssl rand -hex 32
UMAMI_TRACKER_SCRIPT_NAME=rg-analytics

# ── Storefront Umami (build-time, set as Build Variables in Coolify) ──
NEXT_PUBLIC_UMAMI_URL=https://analytics.riogaia.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=         # from Umami dashboard → Add Website
NEXT_PUBLIC_UMAMI_SCRIPT_NAME=rg-analytics.js
NEXT_PUBLIC_UMAMI_DOMAINS=riogaia.com,www.riogaia.com
```

### Backup

Add to the existing backup strategy:

| Resource | Method | Frequency | Retention |
|----------|--------|-----------|-----------|
| Umami PostgreSQL | Coolify built-in `pg_dump` → S3 | Daily | 30 days |

---

## Phase 2: Security Hardening

### Summary

| Layer | What | How |
|-------|------|-----|
| **HTTPS** | TLS on analytics subdomain | Coolify auto-provisions Let's Encrypt cert |
| **Traefik routing** | All traffic through Traefik reverse proxy | Coolify domain assignment (no exposed ports) |
| **Dashboard access** | Restrict Umami dashboard to admin IPs | Traefik IP allowlist middleware (see below) |
| **Allowed origins** | Only accept tracking data from your domains | Umami website settings + `data-domains` attribute |
| **Script obfuscation** | Custom script name `rg-analytics` | `TRACKER_SCRIPT_NAME` env var — bypasses ad-blocker rules |
| **Auth** | Strong password + individual accounts | Umami built-in user management |
| **Rate limiting** | Throttle `/api/send` endpoint | Traefik rate limit middleware |
| **CSP headers** | Allow Umami in Content-Security-Policy | `next.config.js` headers |
| **Telemetry** | Disable Umami's own telemetry | `DISABLE_TELEMETRY=1` |

### Dashboard IP allowlist (Traefik middleware)

Restrict the Umami dashboard to your IP(s) while keeping the tracking endpoints public. Add Traefik labels to the `umami` service in `compose.prod.yml`:

```yaml
  umami:
    labels:
      # ── Dashboard IP restriction ──
      # Middleware: allow only admin IPs on dashboard paths
      - "traefik.http.middlewares.umami-ipallow.ipallowlist.sourcerange=${UMAMI_ADMIN_IPS:-127.0.0.1/32}"

      # Route 1: Tracking script + collect endpoint (public)
      - "traefik.http.routers.umami-public.rule=Host(`analytics.riogaia.com`) && (PathPrefix(`/api/send`) || PathPrefix(`/rg-analytics`))"
      - "traefik.http.routers.umami-public.entrypoints=https"
      - "traefik.http.routers.umami-public.tls.certresolver=letsencrypt"

      # Route 2: Everything else = dashboard (IP-restricted)
      - "traefik.http.routers.umami-dashboard.rule=Host(`analytics.riogaia.com`)"
      - "traefik.http.routers.umami-dashboard.entrypoints=https"
      - "traefik.http.routers.umami-dashboard.tls.certresolver=letsencrypt"
      - "traefik.http.routers.umami-dashboard.middlewares=umami-ipallow"
      - "traefik.http.routers.umami-dashboard.priority=1"
```

Add to Coolify environment variables:

```
UMAMI_ADMIN_IPS=<your-public-ip>/32    # comma-separated for multiple IPs
```

**Alternative**: If using Tailscale VPN for Coolify access (as noted in `docs/deployment.md`), don't assign a public domain to Umami at all. Instead, access the dashboard via Tailscale IP and only expose the tracking endpoints through a Next.js API route proxy (see Phase 3).

### Rate limiting on tracking endpoint

Add a Traefik rate limit middleware to the `umami-public` router:

```yaml
      # Rate limit: 30 req/s average, burst of 50
      - "traefik.http.middlewares.umami-ratelimit.ratelimit.average=30"
      - "traefik.http.middlewares.umami-ratelimit.ratelimit.burst=50"
      - "traefik.http.middlewares.umami-ratelimit.ratelimit.period=1s"
      - "traefik.http.routers.umami-public.middlewares=umami-ratelimit"
```

### CSP headers (`next.config.js`)

Add to the storefront's `headers()` configuration:

```javascript
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.riogaia.com",
    "connect-src 'self' https://analytics.riogaia.com https://*.stripe.com https://*.paypal.com",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "frame-src https://*.stripe.com https://*.paypal.com",
  ].join("; ")
}
```

### Hetzner firewall

No changes needed — Umami communicates through Traefik on ports 80/443 which are already open.

---

## Phase 3: Frontend Integration — Core Swap

### New files

**`storefront/src/lib/analytics/umami.ts`** — unified analytics utility:

```typescript
// Client-side tracking
export function trackEvent(
  eventName: string,
  eventData?: Record<string, string | number>
) {
  if (typeof window !== "undefined" && window.umami) {
    window.umami.track(eventName, eventData)
  }
}

// Server-side tracking (calls Umami HTTP API directly within Docker network)
export async function trackServerEvent(
  eventName: string,
  eventData?: Record<string, string | number>,
  url?: string
) {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const umamiUrl =
    process.env.UMAMI_INTERNAL_URL || process.env.NEXT_PUBLIC_UMAMI_URL

  if (!websiteId || !umamiUrl) return

  try {
    await fetch(`${umamiUrl}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: {
          website: websiteId,
          name: eventName,
          data: eventData,
          url: url || "/",
          hostname:
            process.env.NEXT_PUBLIC_UMAMI_DOMAINS?.split(",")[0] ||
            "riogaia.com",
          language: "pt-PT",
        },
        type: "event",
      }),
    })
  } catch {
    // Silently fail — analytics should never block business logic
  }
}
```

`UMAMI_INTERNAL_URL=http://umami:3000` routes server-side tracking calls through the Docker network directly — no public DNS roundtrip, no Traefik, no TLS overhead.

**`storefront/src/types/umami.d.ts`** — TypeScript declarations:

```typescript
interface UmamiTracker {
  track(
    eventName: string,
    eventData?: Record<string, string | number>
  ): void
  track(
    callback: (props: {
      hostname: string
      language: string
      referrer: string
      screen: string
      title: string
      url: string
      website: string
    }) => Record<string, unknown>
  ): void
}

interface Window {
  umami?: UmamiTracker
}
```

### Layout change (`storefront/src/app/layout.tsx`)

Remove:

```tsx
import { Analytics } from "@vercel/analytics/next"
// ...
<Analytics />
```

Add:

```tsx
import Script from "next/script"
// ...
<Script
  src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/${process.env.NEXT_PUBLIC_UMAMI_SCRIPT_NAME}`}
  data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
  strategy="afterInteractive"
  data-domains={process.env.NEXT_PUBLIC_UMAMI_DOMAINS}
/>
```

Umami auto-tracks page views (detects `history.pushState`/`replaceState` for SPA navigation). No additional config needed.

### Migration table

| File | Old import | New import | Change |
|------|-----------|------------|--------|
| `layout.tsx` | `@vercel/analytics/next` | `next/script` | `<Analytics />` → `<Script>` |
| `cart-event-bus.ts` | `@vercel/analytics` | `@/lib/analytics/umami` | `track()` → `trackEvent()` (client) |
| `cart.ts` | `@vercel/analytics/server` | `@/lib/analytics/umami` | `track()` → `trackServerEvent()` |
| `customer.ts` | `@vercel/analytics/server` | `@/lib/analytics/umami` | `track()` → `trackServerEvent()` |
| `companies.ts` | `@vercel/analytics/server` | `@/lib/analytics/umami` | `track()` → `trackServerEvent()` |
| `quotes.ts` | `@vercel/analytics/server` | `@/lib/analytics/umami` | `track()` → `trackServerEvent()` |

Final step: remove `@vercel/analytics` from `package.json`.

---

## Phase 4: Event Tracking — Existing + New

### Migrated events (9 existing)

| Event | Data | Context |
|-------|------|---------|
| `add_to_cart` | product_name, quantity | Client-side |
| `order_completed` | order_id | Server action |
| `customer_logged_in` | — | Server action |
| `customer_logged_out` | — | Server action |
| `company_created` | company_id, company_name | Server action |
| `employee_created` | employee_id | Server action |
| `quote_created` | quote_id | Server action |
| `quote_accepted` | quote_id | Server action |
| `quote_message_created` | quote_id | Server action |

### New events — Product engagement

| Event | Where | Data |
|-------|-------|------|
| `product_viewed` | Product detail template | product_id, handle, title |
| `product_variant_selected` | Variants table (`handleQuantityChange`) | product_id, variant_id, quantity |

### New events — Search

| Event | Where | Data |
|-------|-------|------|
| `search_performed` | Search modal (debounced) | search_query |
| `search_result_clicked` | Hit component | product_handle, search_query |

### New events — Catalog / browsing

| Event | Where | Data |
|-------|-------|------|
| `category_viewed` | Category page | category_handle, category_name |
| `collection_viewed` | Collection page | collection_handle |
| `catalog_page_viewed` | Catalog page | sort_by, page_number |

### New events — Cart & checkout funnel

| Event | Where | Data |
|-------|-------|------|
| `cart_viewed` | Cart page | item_count |
| `line_item_removed` | `deleteLineItem` server action | line_item_id |
| `checkout_step_completed` | Each checkout step component | step_name |
| `payment_initiated` | Payment button | payment_provider |

### New events — Quote workflow (B2B-specific)

| Event | Where | Data |
|-------|-------|------|
| `quote_request_started` | Quote request page | item_count |
| `quote_rejected` | `rejectQuote` action (currently untracked) | quote_id |
| `quote_detail_viewed` | Quote detail page | quote_id, status |

### New events — Account & marketing

| Event | Where | Data |
|-------|-------|------|
| `signup_started` | Registration page | — |
| `contact_form_submitted` | Contact form | — |
| `password_reset_requested` | Password reset action | — |
| `cta_clicked` | Landing page CTAs | cta_location |

---

## Phase 5: Cookie Consent

Umami uses **zero cookies**. It identifies visitors via a server-side hash of IP + User-Agent, never stored on the client.

- The `<Script>` tag goes directly in `layout.tsx`, **not gated by consent**
- The existing `CookieConsent` component stays as-is (covers Medusa's functional cookies)
- No "reject analytics" toggle needed
- Optionally update the privacy policy to mention cookieless analytics

---

## Implementation Sequence

```
Phase 1  Infrastructure      compose.prod.yml + Coolify env vars + deploy + dashboard setup
Phase 2  Security             Traefik labels + CSP headers + IP allowlist
Phase 3  Core swap            Analytics utility + migrate 5 files + remove @vercel/analytics
Phase 4  New events           Instrument ~17 new tracking points
Phase 5  Cookie consent       Verify no changes needed, update privacy policy
```

---

## Important Notes

- **Server-side tracking**: Server actions call Umami's HTTP API via `UMAMI_INTERNAL_URL=http://umami:3000` (Docker-internal). Events won't have client context (screen size, referrer) but custom event data is captured correctly. Zero latency overhead since it stays within the Docker network.
- **Ad-blocker resilience**: Custom `TRACKER_SCRIPT_NAME` (`rg-analytics` instead of `umami.js`) bypasses basic ad-blocker rules. For maximum resilience, proxy the script through a Next.js API route.
- **Development**: `data-domains` attribute prevents tracking on localhost. Alternatively, leave `NEXT_PUBLIC_UMAMI_WEBSITE_ID` empty in dev `.env` and conditionally render the script.
- **Storefront redeploy**: After first deploy, you must get the Website ID from Umami dashboard, set it as `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Build Variable) in Coolify, and redeploy the storefront for tracking to start.
- **No exposed ports**: Unlike the dev `compose.yml`, the production compose does not expose any ports directly — all traffic flows through Traefik. The `umami` and `umami-db` services are internal to the Docker network.
