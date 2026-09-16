# Rio Gaia — Target Architecture

> Decision document for the architectural refactor. Captures what we're building and why.
> Companion documents: [MIGRATION.md](MIGRATION.md) (execution plan), [CLAUDE.md](CLAUDE.md) (conventions, updated after migration proves the patterns).

---

## Current Pain Points

| Problem | Where it hurts | Example |
|---------|---------------|---------|
| **Spaghetti data layer** | Storefront `lib/data/` | `cart.ts` is 300+ lines mixing SDK calls, cookies, redirects, revalidation, and error handling |
| **No separation of business logic** | Backend services and workflows | Spending limit rules live in `utils/check-spending-limit.ts` with no clear ownership |
| **Hard-coded values and scattered types** | Both | Portuguese strings, magic numbers, types in `global.ts` instead of domain-specific files |
| **Fragile database layer** | Backend | No typed errors, no validation Value Objects, business rules mixed with persistence |
| **Confusing client state** | Storefront `CartProvider` | `useOptimistic` (React 19) is unfamiliar, single-consumer, no devtools, manual rollback |
| **Functions outgrowing scope** | Both | Single files accumulate unrelated logic; no structural pressure to stay focused |
| **LLM-generated code drifts** | Both | No structural conventions → AI scatters logic across random locations |

## Non-Goals

- **Not rewriting MedusaJS internals.** Modules, workflows, links, subscribers, and API route conventions stay as MedusaJS defines them. We add layers inside that structure, not around it.
- **Not building a monorepo/packages structure now.** Multi-storefront readiness means keeping layers extractable, not extracting them today.
- **Not achieving 100% test coverage.** Tests target business logic and critical flows first. Component-level tests come later.
- **Not implementing i18n now.** We prepare the structure (string extraction, library choice) but don't ship multi-language in this refactor.
- **Not migrating backend tests from Jest to Vitest.** Backend keeps Jest (Medusa's test infrastructure). Vitest is for the storefront and backend domain layer unit tests only. See [Testing Strategy](#testing-strategy).

## Success Criteria

1. Every business rule is a **pure function** testable without framework/DB dependencies
2. Storefront data flow has **one clear path**: API → Action → Hook → Component (each layer has one job)
3. A new developer can look at the directory structure and **know where to put new code** without asking
4. Cart state uses **TanStack Query** — optimistic updates, devtools, multi-consumer cache invalidation
5. Backend domain logic returns **typed errors** (Either pattern) — no guessing what went wrong
6. **No file exceeds ~100-150 lines** for actions/rules/hooks — one concern per file, directories for grouping

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend pattern | **Domain Layer Extraction** (Clean Architecture adapted to MedusaJS) | Framework-agnostic business logic, testable, matches developer's preferred patterns |
| Storefront pattern | **Hybrid: Layered Data + Feature UI** | Server-side first, flat navigation, clear layer boundaries |
| Client state | **TanStack Query** (replaces useOptimistic) | Only for client-side mutations that need it (cart, search) |
| Forms | **TanStack Form** for portal forms | Client-side validation, instant feedback, familiar to developer |
| i18n library | **next-intl** (setup only, not shipped) | Server Component native, App Router integration, type-safe keys |
| Backend error handling | **Either\<L,R\> monad** in domain layer | Typed errors, no thrown exceptions in business logic |
| Storefront error handling | **ActionResult\<T\>** return type | Structured results from server actions, never thrown |
| Backend tests | **Jest** (existing Medusa infrastructure) | Don't fight the framework — Medusa's test utils expect Jest |
| Storefront + domain unit tests | **Vitest** | Fast, ESM-native, no Medusa dependency |
| E2E tests | **Playwright** | Cross-browser, best Next.js support |

---

## 1. Backend Architecture

### Adapting Clean Architecture to MedusaJS

The developer's preferred architecture (from [inline-server](https://github.com/mmroch4/inline-server)) uses classic Clean Architecture: `Entity<T>` base class, `Either<L,R>` monad, Value Objects, Use Cases, Handlers, DTOs, Mappers.

MedusaJS already provides some of these layers. We adapt, not duplicate:

| inline-server pattern | MedusaJS equivalent | Adaptation |
|---|---|---|
| `Entity<T>` base class | MikroORM models (`model.define()`) | **Don't duplicate** — ORM entities are persistence. Domain types are separate interfaces. |
| `Either<L,R>` monad | None (try/catch) | **Add** — use in `domain/` for business rule returns |
| Value Objects (`Id.create()`) | None | **Add** — for complex validation (SpendingLimit, QuoteStatus) |
| Use Case classes (`execute()`) | Workflows + Steps | **Don't duplicate** — workflows ARE the use cases. Domain rules called FROM steps. |
| `Handler` interface | API route functions | **Don't duplicate** — Medusa API routes are function-based. Keep them thin. |
| DTOs | None (raw objects) | **Add** — `dto/` per module for request/response contracts |
| Mappers | None | **Add** — `mappers/` per module for entity → DTO transformation |
| Typed errors per domain | Generic `MedusaError` | **Add** — typed error classes in `domain/errors/` |

**Key principle**: MedusaJS provides the **infrastructure and application layers**. We add the **domain layer** inside it, not around it.

### Backend Structure

```
backend/src/
  core/                                  # Shared abstractions (framework-agnostic)
    logic/
      either.ts                          #   Either<L,R>, Left, Right, left(), right()
    domain/
      value-object.ts                    #   Abstract ValueObject<T> base class
      errors/
        domain-error.ts                  #   Base DomainError class

  modules/
    company/
      models/                            # MikroORM entities (Medusa convention, unchanged)
        company.ts
        employee.ts
        company-address.ts
      domain/                            # Pure business logic — zero framework imports
        types.ts                         #   ICompany, IEmployee — domain interfaces
        errors/
          company-not-verified.error.ts
          spending-limit-exceeded.error.ts
          employee-not-admin.error.ts
        value-objects/
          spending-limit.vo.ts           #   SpendingLimit.create(amount) → Either<Error, SpendingLimit>
          reset-frequency.vo.ts          #   ResetFrequency.create(freq) → Either<Error, ResetFrequency>
        rules/
          spending-limit.rules.ts        #   getSpendWindow(), isWithinSpendingLimit(), calculateRemaining()
          company-access.rules.ts        #   canEmployeeOrder(), isCompanyVerified()
      dto/
        company-response.dto.ts
        employee-response.dto.ts
      mappers/
        company.mapper.ts
        employee.mapper.ts
      service.ts                         # MedusaService — thin CRUD only
      migrations/
      index.ts

    quote/
      models/
        quote.ts
        message.ts
      domain/
        types.ts
        errors/
          quote-not-pending.error.ts
          quote-expired.error.ts
          unauthorized-quote-access.error.ts
        value-objects/
          quote-status.vo.ts             #   QuoteStatus.create(status) → Either<Error, QuoteStatus>
        rules/
          quote-lifecycle.rules.ts       #   canAcceptQuote(), canRejectQuote(), isQuoteExpired()
          quote-access.rules.ts          #   canCustomerAccessQuote(), canMerchantModifyQuote()
      dto/
        quote-response.dto.ts
        message-response.dto.ts
      mappers/
        quote.mapper.ts
        message.mapper.ts
      service.ts
      migrations/
      index.ts

    meilisearch/                         # Simple module — no domain/ layer needed
      service.ts
      types.ts
      index.ts

    email-notification/                  # Simple module — no domain/ layer needed
      service.ts
      templates/
        shared/
        (individual templates)
      index.ts

  workflows/                             # Unchanged structure — workflows call domain rules
    company/
      workflows/
      steps/
    employee/
      workflows/
      steps/
    quote/
      workflows/
      steps/
    meilisearch/
      workflows/
      steps/

  api/                                   # Unchanged structure — thin controllers
    store/
    admin/
    vendor/
    middlewares/

  subscribers/                           # Unchanged
  links/                                 # Unchanged
  jobs/                                  # Unchanged
```

### Core Abstractions

Live in `src/core/`, used across all modules, framework-agnostic.

**Either Monad** (`core/logic/either.ts`):
```typescript
export type Either<L, A> = Left<L, A> | Right<L, A>
export const left = <L, A>(l: L): Either<L, A> => new Left(l)
export const right = <L, A>(a: A): Either<L, A> => new Right(a)
```

**Value Object Base** (`core/domain/value-object.ts`):
```typescript
export abstract class ValueObject<T> {
  protected readonly props: T
  constructor(props: T) { this.props = props }
  public equals(vo?: ValueObject<T>): boolean { /* compare props */ }
}
```

**Domain Error Base** (`core/domain/errors/domain-error.ts`):
```typescript
export abstract class DomainError {
  abstract readonly code: string
  abstract readonly message: string
}
```

### Boundary Convention

The `Either` pattern is used **inside** the domain layer. At the workflow/API boundary, `Either.Left` is converted to thrown exceptions (because MedusaJS workflows expect exceptions for error handling):

```typescript
// In a workflow step:
const result = canAcceptQuote(input.quote)
if (result.isLeft()) {
  throw new Error(result.value.message) // Convert Either → exception at boundary
}
```

Domain stays pure and testable. MedusaJS gets the exceptions it expects.

---

## 2. Storefront Architecture

### Guiding Principles

1. **Server-side first**: Everything is server-side unless it must be client-side
2. **TanStack Query only when necessary**: Cart mutations, search, real-time updates — nothing else
3. **TanStack Form for portal forms**: Client-side validation and instant feedback
4. **One concern per file**: If a file would exceed ~100-150 lines, break it into a directory with individual files
5. **Feature-organized UI**: Components grouped by feature in `modules/`

### Storefront Structure

```
storefront/src/
  api/                                   # Layer 1 — Raw API calls (framework-agnostic)
    cart.api.ts                          #   Small: sdk.store.cart.retrieve(), .create()
    customer.api.ts
    products.api.ts
    quotes.api.ts
    companies.api.ts
    orders.api.ts
    regions.api.ts
    collections.api.ts
    categories.api.ts
    fulfillment.api.ts
    payment.api.ts
    contact.api.ts
    auth.api.ts

  actions/                               # Layer 2 — Server actions (server-side orchestration)
    cart/                                #   Large resource → directory with one action per file
      add-to-cart.action.ts
      update-line-item.action.ts
      remove-line-item.action.ts
      empty-cart.action.ts
      add-to-cart-bulk.action.ts
      retrieve-cart.action.ts
      index.ts                           #   Barrel: export * from './add-to-cart.action'
    checkout/                            #   Large resource → directory
      set-shipping-address.action.ts
      set-billing-address.action.ts
      set-shipping-method.action.ts
      set-contact-details.action.ts
      initiate-payment.action.ts
      place-order.action.ts
      apply-promotions.action.ts
      index.ts
    auth/                                #   Medium resource → directory
      login.action.ts
      signup.action.ts
      signout.action.ts
      request-password-reset.action.ts
      reset-password.action.ts
      index.ts
    quote.actions.ts                     #   Small resource → single file (3-4 functions)
    customer.actions.ts                  #   Small resource → single file
    company.actions.ts                   #   Small resource → single file
    contact.actions.ts                   #   Small resource → single file (1 function)
    region.actions.ts                    #   Small resource → single file (1 function)

  hooks/                                 # Layer 3 — Client-side state (THIN — only when needed)
    query-client.ts                      #   QueryClient config + provider
    use-cart.ts                          #   useQuery(['cart']) + mutations
    use-search.ts                        #   Meilisearch real-time search

  modules/                               # Layer 4 — UI components (feature-organized, unchanged)
    account/
      components/
      templates/
    cart/
      components/
      templates/
    checkout/
      components/
      templates/
    products/
      components/
      templates/
    quotes/
      components/
      templates/
    store/
      components/
    search/
      components/
    layout/
      components/
    common/
      components/
    home/
      components/
    order/
      components/
      templates/
    contact/
      components/
    shipping/
      components/
    skeletons/

  lib/                                   # Cross-cutting pure code
    config.ts                            # Medusa SDK + Meilisearch client init
    constants.ts                         # Payment providers, currency map
    cookies.ts                           # Cookie utilities (auth, cart, cache)
    analytics.ts                         # Vercel Analytics event tracking
    utils/
      money.ts
      spending-limit.ts
      checkout-steps.ts
      csv-export.ts
      compare-addresses.ts
      sort-products.ts
      get-product-price.ts
      medusa-error.ts
      rate-limit.ts
    i18n/                                # i18n preparation (NOT shipped in this refactor)
      index.ts                           #   next-intl configuration
      request.ts                         #   getRequestConfig()
      navigation.ts                      #   Localized Link, redirect, useRouter
      messages/
        pt.json                          #   Portuguese translations (extracted from hardcoded strings)

  types/                                 # Shared TypeScript types (one file per domain)
    cart.ts
    customer.ts
    company.ts
    quote.ts
    order.ts
    shipping.ts
    index.ts

  app/                                   # Next.js App Router (unchanged structure)
  middleware.ts                           # Region detection, cart cookies, cache ID (unchanged)
```

### File Granularity Rule

> **Threshold**: If a resource has **4+ server actions**, break it into a **directory** with one file per action and a barrel `index.ts`. Otherwise, keep it as a **single file**.

This prevents both extremes: monolithic 300-line files AND 50 tiny files with 10 lines each.

| Resource | Action count | Format |
|----------|-------------|--------|
| Cart | 6 (add, update, remove, empty, bulk, retrieve) | Directory: `actions/cart/` |
| Checkout | 7 (address x2, shipping, contact, payment, order, promos) | Directory: `actions/checkout/` |
| Auth | 5 (login, signup, signout, request-reset, reset) | Directory: `actions/auth/` |
| Quote | 3 (create, accept/reject, message) | Single file: `actions/quote.actions.ts` |
| Customer | 2 (update, password) | Single file: `actions/customer.actions.ts` |
| Company | 3 (update, employees, addresses) | Single file: `actions/company.actions.ts` |
| Contact | 1 (submit) | Single file: `actions/contact.actions.ts` |
| Region | 1 (update) | Single file: `actions/region.actions.ts` |

### Data Flow

**Server Components (default — most pages):**
```
Server Component → api/*.api.ts → Medusa SDK → Backend
```

**Client Components (only when interactivity requires it):**
```
Component → Hook (TanStack Query) → Action → API → Backend
    ↑                                   │
    └────── cache invalidation ─────────┘
```

**Forms (TanStack Form):**
```
TanStack Form → onSubmit → Action → API → Backend
                   │
                   └→ revalidateTag() → Server Components re-render
```

### Layer Responsibilities

| Layer | Does | Does NOT |
|-------|------|----------|
| `api/` | Call Medusa SDK, return typed data | Cookies, redirects, caching, UI |
| `actions/` | Orchestrate: API call + cookies + cache revalidation + redirect | UI rendering, client state |
| `hooks/` | Client cache, optimistic updates, loading/error states | Direct API calls, cookies, server logic |
| `modules/` | Render UI, handle user interactions | Data fetching, business logic |

---

## 3. Region vs Locale (Multi-Region and Multi-Language)

**These are two separate axes.** The current `[countryCode]` in the URL is a **Medusa region selector** — it drives pricing, currency, tax, and shipping. It is NOT a language parameter.

| Axis | Determines | Current mechanism | URL example |
|------|-----------|-------------------|-------------|
| **Region** (country) | Pricing, currency, tax, shipping | `[countryCode]` in URL + middleware | `/pt/portal/catalogo` (Portugal prices in EUR) |
| **Locale** (language) | UI text, date formats, number formats | None yet (hardcoded Portuguese) | N/A |

**Why they must be separate:**
- Portugal (`pt`) and Brazil (`br`) share Portuguese but have different currencies (EUR vs BRL)
- A French company buying from Rio Gaia may want English UI but Portuguese region pricing
- Adding Spanish language doesn't mean adding a Spanish region

### Proposed Approach (for future implementation)

**Region stays in the URL** (unchanged): `[countryCode]` maps to Medusa regions for pricing.

**Locale uses a cookie + next-intl**: Language preference stored in `_locale` cookie, detected from browser `Accept-Language` header, overridable by user.

```
URL: /pt/portal/catalogo          ← region = Portugal (EUR pricing)
Cookie: _locale=en                ← language = English UI
```

**URL structure does NOT change.** No `/pt/en/portal/...` double-segment. Language is a user preference, not a URL concern for this B2B portal.

**next-intl configuration** (`lib/i18n/index.ts`):
```typescript
// Reads locale from cookie, falls back to region-default mapping
export const locales = ['pt', 'en'] as const
export type Locale = typeof locales[number]

// Region → default locale mapping (user can override)
const regionDefaultLocale: Record<string, Locale> = {
  pt: 'pt',    // Portugal defaults to Portuguese
  br: 'pt',    // Brazil defaults to Portuguese
  es: 'es',    // Spain defaults to Spanish (future)
  gb: 'en',    // UK defaults to English (future)
}
```

**This is preparation only.** The i18n structure is set up during this refactor (string extraction into `pt.json`), but multi-language is not shipped. The separation ensures we don't have to restructure later.

---

## 4. TanStack Query: Scope and Usage

**Principle**: Server-side first. TanStack Query ONLY for client-side interactivity.

| Use Case | TanStack Query? | Why |
|----------|----------------|-----|
| Product listing | No — Server Component | Static data fetched at render |
| Product detail | No — Server Component | Fetched once |
| Cart display + mutations | **Yes** | Multiple consumers (header, totals, items), optimistic updates |
| Search (as-you-type) | **Yes** | Real-time client interaction with Meilisearch |
| Quote list | No — Server Component | Read-only |
| Order history | No — Server Component | Read-only, paginated |
| Customer/company profile | No — Server Component | Fetched once, mutations via form submit |

`QueryClientProvider` wraps **only** the portal layout (`/portal/layout.tsx`). Public pages never load TanStack Query.

---

## 5. Error Handling

### Backend: Domain → Workflow Boundary

```
Domain rules return Either<DomainError, T>
         ↓
Workflow steps convert Either.Left → thrown MedusaError
         ↓
API routes return HTTP response with status + message
```

### Storefront: Actions → UI

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; rateLimited?: boolean }
```

Every server action returns `ActionResult<T>`. Never throws. Hooks and components check `result.success`.

---

## 6. Testing Strategy

### Tool Split

| Scope | Tool | Why |
|-------|------|-----|
| Backend integration + module tests | **Jest** (existing) | Medusa's test infrastructure expects Jest. Already configured in `package.json`. Don't migrate. |
| Backend `core/` + `domain/` unit tests | **Vitest** | Pure functions with no Medusa dependency. Vitest is faster for unit tests. Coexists with Jest (separate config). |
| Storefront unit tests (`lib/utils/`) | **Vitest** | No Jest dependency in storefront. Vitest is the natural choice. |
| Storefront action/hook tests | **Vitest** + MSW | Mock server responses, test orchestration logic. |
| E2E critical flows | **Playwright** | Cross-browser, best Next.js integration. |

**Coexistence**: Jest runs via `yarn test:unit` / `yarn test:integration:*` (backend, existing scripts). Vitest runs via a new `yarn test:domain` script (backend domain layer) and `yarn test` (storefront). They don't overlap — Jest never touches `core/` or `domain/`, Vitest never touches Medusa integration tests.

### Priority for This Refactor

1. Backend `core/` + `domain/` rules — unit tests (Vitest)
2. Storefront `lib/utils/` — unit tests (Vitest)
3. 2-3 Playwright E2E flows (login → cart → checkout, quote request)
4. Storefront actions — integration tests (post-refactor, not blocking)

---

## 7. Multi-Storefront Readiness

No packages or monorepo now. The architecture keeps these layers **extractable** for the future:

- `api/` — pure SDK calls, no storefront-specific logic
- `actions/` — server actions, reusable across storefronts
- `types/` — shared TypeScript types
- `lib/utils/` — pure functions

If a second storefront is ever needed, these directories lift into shared packages without restructuring.
