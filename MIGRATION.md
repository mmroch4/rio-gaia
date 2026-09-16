# Rio Gaia — Migration Plan

> Execution plan for the architecture refactor defined in [STRUCTURE.md](STRUCTURE.md).
> Strategy: **vertical slices** — prove the pattern with one complete feature before migrating everything.

---

## Approach: Vertical Slices, Not Horizontal Layers

Instead of "Phase 1: create all directories, Phase 2: migrate all data files", we migrate **one complete vertical feature** first. This proves the pattern works, exposes integration issues early, and lets old and new code coexist while migration progresses.

**First slice (backend):** Company spending-limit domain rules
**First slice (storefront):** Cart data layer + TanStack Query

These were chosen because:
- Spending-limit rules are the clearest domain logic in the backend, already isolated in a utility file
- Cart is the most complex storefront data flow (optimistic updates, multi-consumer state, cookies)
- If the pattern works for the hardest case, it works for everything else

---

## Phase 1: Core Foundation + First Backend Slice (Days 1-2)

### Backend: Core abstractions

- [ ] Create `src/core/logic/either.ts` — Either<L,R> monad
- [ ] Create `src/core/domain/value-object.ts` — ValueObject<T> base class
- [ ] Create `src/core/domain/errors/domain-error.ts` — DomainError base class
- [ ] Write unit tests for `core/` with Vitest (configure `vitest.config.ts` for backend domain tests)

### Backend: Company spending-limit domain extraction (first vertical slice)

- [ ] Create `src/modules/company/domain/types.ts` — domain interfaces
- [ ] Create `src/modules/company/domain/value-objects/spending-limit.vo.ts`
- [ ] Create `src/modules/company/domain/value-objects/reset-frequency.vo.ts`
- [ ] Create `src/modules/company/domain/rules/spending-limit.rules.ts` — extract from `src/utils/check-spending-limit.ts`
- [ ] Create `src/modules/company/domain/errors/spending-limit-exceeded.error.ts`
- [ ] Write unit tests for spending-limit rules and value objects
- [ ] Update workflow steps to call domain rules instead of utility functions
- [ ] Verify existing Jest integration tests still pass

### Checkpoint: Validate the pattern

Before proceeding, confirm:
- [ ] Domain rules are pure functions (no imports from `@medusajs/*`)
- [ ] Vitest unit tests pass independently of Jest integration tests
- [ ] Workflow steps correctly convert Either.Left → thrown exceptions
- [ ] No regressions in existing functionality

---

## Phase 2: First Storefront Slice — Cart (Days 3-5)

### Storefront: Directory structure

- [ ] Create `src/api/`, `src/actions/`, `src/hooks/`, `src/types/` directories
- [ ] Install `@tanstack/react-query`, `@tanstack/react-form`, `next-intl`

### Storefront: Cart vertical slice

- [ ] Create `src/api/cart.api.ts` — extract SDK calls from `lib/data/cart.ts`
- [ ] Create `src/actions/cart/` directory:
  - `add-to-cart.action.ts`
  - `update-line-item.action.ts`
  - `remove-line-item.action.ts`
  - `empty-cart.action.ts`
  - `add-to-cart-bulk.action.ts`
  - `retrieve-cart.action.ts`
  - `index.ts` (barrel exports)
- [ ] Create `src/hooks/query-client.ts` — QueryClient config + provider
- [ ] Create `src/hooks/use-cart.ts` — TanStack Query hook replacing CartProvider
- [ ] Add `QueryClientProvider` to portal layout
- [ ] Update cart-consuming components (`modules/cart/`, header cart button, checkout totals) to use `useCart()` hook
- [ ] Move cart types from `types/global.ts` → `types/cart.ts`
- [ ] Split `lib/data/cookies.ts` → `lib/cookies.ts` (keep only cookie utilities)

### Storefront: Search vertical slice (parallel)

- [ ] Create `src/hooks/use-search.ts` — Meilisearch hook
- [ ] Update `modules/search/` to use the new hook

### Checkpoint: Validate the pattern

- [ ] Cart add/remove/update works with TanStack Query optimistic updates
- [ ] Header cart count updates when items change
- [ ] Free shipping nudge updates reactively
- [ ] Old `CartProvider` and `lib/data/cart.ts` are fully replaced for cart operations
- [ ] Old and new code coexist (other `lib/data/` files still work)

---

## Phase 3: Remaining Storefront Migration (Days 6-9)

### Migrate remaining API + Actions (one resource at a time)

- [ ] `auth` → `api/auth.api.ts` + `actions/auth/` (directory — 5 actions)
- [ ] `checkout` → `api/cart.api.ts` (reuse) + `actions/checkout/` (directory — 7 actions)
- [ ] `customer` → `api/customer.api.ts` + `actions/customer.actions.ts`
- [ ] `quotes` → `api/quotes.api.ts` + `actions/quote.actions.ts`
- [ ] `companies` → `api/companies.api.ts` + `actions/company.actions.ts`
- [ ] `orders` → `api/orders.api.ts` (read-only, no actions needed — Server Component fetches)
- [ ] `products` → `api/products.api.ts` (read-only)
- [ ] `regions` → `api/regions.api.ts` + `actions/region.actions.ts`
- [ ] `collections` → `api/collections.api.ts` (read-only)
- [ ] `categories` → `api/categories.api.ts` (read-only)
- [ ] `fulfillment` → `api/fulfillment.api.ts` (read-only)
- [ ] `payment` → `api/payment.api.ts` (read-only)
- [ ] `contact` → `api/contact.api.ts` + `actions/contact.actions.ts`

### Migrate remaining types

- [ ] `types/customer.ts`, `types/company.ts`, `types/quote.ts`, `types/order.ts`, `types/shipping.ts`
- [ ] Create `types/index.ts` barrel

### Update component imports

- [ ] Update all `modules/` component imports from `lib/data/*` → `actions/*` or `api/*`
- [ ] Remove `lib/data/` directory
- [ ] Remove `lib/context/cart-context.tsx`
- [ ] Remove `lib/data/cart-event-bus.ts`

---

## Phase 4: Remaining Backend Domain Extraction (Days 8-10, parallel with Phase 3)

### Quote module domain layer

- [ ] Create `src/modules/quote/domain/types.ts`
- [ ] Create `src/modules/quote/domain/value-objects/quote-status.vo.ts`
- [ ] Create `src/modules/quote/domain/rules/quote-lifecycle.rules.ts`
- [ ] Create `src/modules/quote/domain/rules/quote-access.rules.ts`
- [ ] Create `src/modules/quote/domain/errors/`
- [ ] Write unit tests for quote domain rules
- [ ] Update quote workflow steps to call domain rules

### Company module — remaining domain logic

- [ ] Create `src/modules/company/domain/rules/company-access.rules.ts`
- [ ] Create `src/modules/company/domain/errors/company-not-verified.error.ts`
- [ ] Create `src/modules/company/domain/errors/employee-not-admin.error.ts`

### DTOs and Mappers (both modules)

- [ ] Create `dto/` and `mappers/` for company and quote modules
- [ ] Update API routes to use mappers for response formatting

---

## Phase 5: Forms + i18n Prep (Days 11-12)

### TanStack Form migration

- [ ] Migrate checkout forms (address, contact details, payment selection)
- [ ] Migrate auth forms (login, signup, password reset)
- [ ] Migrate account forms (profile, company, addresses, employees)
- [ ] Create shared Zod schemas used by both TanStack Form (client) and server actions (server)

### i18n preparation (structure only, not shipping multi-language)

- [ ] Set up `lib/i18n/` directory with next-intl configuration
- [ ] Extract hardcoded Portuguese strings from components into `lib/i18n/messages/pt.json`
- [ ] Locale detection via cookie (separate from `[countryCode]` region routing)

---

## Phase 6: Testing + Cleanup (Days 13-14)

### Tests

- [ ] Backend domain rules — unit tests (Vitest) — should already be done per phase
- [ ] Storefront `lib/utils/` — unit tests (Vitest): money, spending-limit, checkout-steps, csv-export
- [ ] 2-3 Playwright E2E flows: login → add to cart → checkout, quote request flow
- [ ] Verify all existing backend Jest tests still pass

### Cleanup

- [ ] Delete `lib/data/` directory (fully replaced)
- [ ] Delete `lib/context/cart-context.tsx` (replaced by TanStack Query)
- [ ] Delete `lib/data/cart-event-bus.ts` (replaced by TanStack Query mutations)
- [ ] Verify no dead imports across the codebase
- [ ] Update CLAUDE.md with architecture rules (proven patterns only)
- [ ] Update `docs/` to reflect new structure

---

## Rollback Strategy

Each phase is self-contained. If a phase doesn't work:
- **Phase 1** (backend core): Delete `src/core/` and `domain/` directories. No other code changed.
- **Phase 2** (cart slice): Revert to `CartProvider`. Old `lib/data/cart.ts` still exists until Phase 3 cleanup.
- **Phase 3** (remaining migration): Old files exist in git history. Revert individual resources.
- **Phases 4-6**: Independent of earlier phases.
