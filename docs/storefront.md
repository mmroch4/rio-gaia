# Storefront Guide

## Next.js App Router Structure

The storefront uses Next.js 15 with the App Router. All routes are nested under `[countryCode]` for multi-region support (default: `pt` for Portugal).

```
src/app/
  layout.tsx                          # Root layout (Portuguese lang, Geist font, Toaster, CookieConsent, Analytics)
  not-found.tsx                       # Global 404
  [countryCode]/
    page.tsx                          # Landing/homepage
    not-found.tsx                     # Country-scoped 404

    # Marketing pages (public)
    sobre/page.tsx                    # About
    contacto/page.tsx                 # Contact
    politica-privacidade/page.tsx     # Privacy policy
    termos-e-condicoes/page.tsx       # Terms & conditions
    casos-de-sucesso/                 # Case studies
      page.tsx                        # Overview
      algarve-gift-shops/page.tsx
      hotel-quinta-regaleira/page.tsx
      museu-nacional-azulejo/page.tsx
    produtos/                         # Public product categories
      azulejos-decorativos/page.tsx
      imanes-ceramicos/page.tsx
      porta-copos/page.tsx

    # Auth pages
    conta/
      entrar/page.tsx                 # Login
      registar/page.tsx               # Registration
      recuperar-password/page.tsx     # Password recovery
      redefinir-password/page.tsx     # Password reset
      verificacao-pendente/page.tsx   # Email verification pending

    # B2B Portal (authenticated)
    portal/
      layout.tsx                      # Portal layout (auth guard, client-area header/footer)
      not-found.tsx
      catalogo/page.tsx               # Product catalog with search
      carrinho/page.tsx               # Shopping cart
      produtos/[handle]/page.tsx      # Product detail
      categorias/[...category]/page.tsx  # Category browsing
      colecoes/[handle]/page.tsx      # Collection pages
      encomenda/confirmada/[id]/page.tsx # Order confirmation
      conta/                          # Account dashboard
        layout.tsx                    # Account sidebar layout
        page.tsx                      # Dashboard overview
        perfil/page.tsx               # Profile settings
        empresa/page.tsx              # Company info
        moradas/page.tsx              # Address book
        encomendas/page.tsx           # Orders list
        encomendas/detalhes/[id]/page.tsx  # Order details
        orcamentos/page.tsx           # Quotes list
        orcamentos/detalhes/[id]/page.tsx  # Quote details
```

### Key Page Details

**Landing page** (`[countryCode]/page.tsx`):
- Composition: Header → Hero → TrustIndicators → TechnicalSpecs → CustomizationSection → CaseStudies → CTASection → Footer
- Uses its own Header/Footer (not the portal client-area layout)
- Static generation via `generateStaticParams()` from `listRegions()`

**Marketing pages** (content is volatile — brief summaries):
- **About** (`sobre/`): Mission/vision cards, values, company stats, facility section, CTA
- **Contact** (`contacto/`): Info cards (phone/email/address/hours) + ContactForm + FAQ accordion. **ContactForm is a mock** — uses `setTimeout(1000)` stub, needs backend integration
- **Case Studies** (`casos-de-sucesso/`): Overview with 3 hardcoded cases (testimonials, metrics) + 3 detail sub-pages
- **Privacy Policy** (`politica-privacidade/`): 9 GDPR sections (Portuguese)
- **Terms** (`termos-e-condicoes/`): 11 legal sections (Portuguese)

**Portal catalog** (`portal/catalogo/page.tsx`):
- `StoreBreadcrumb` + `RefinementList` (left sidebar with category filters) + `PaginatedProducts` (Suspense-wrapped with `SkeletonProductGrid` fallback)
- Accepts `sortBy` and `page` query params, defaults to `created_at` sort

**Portal product detail** (`portal/produtos/[handle]/page.tsx`):
- Static generation: `generateStaticParams()` for all handles × country codes
- Generates OpenGraph metadata (title, description, thumbnail) — uses `"Rio Gaia"` branding
- Renders `ProductTemplate` with priced product, region, countryCode

**Category/collection pages**: Same static generation pattern — `generateStaticParams()` for all handles × country codes

**Account overview** (`portal/conta/page.tsx`):
- Renders `Overview` component with customer data and orders list
- Profile completion via `getProfileCompletion()` — counts 4 fields: email, first+last name, phone, default billing address → `(count / 4) × 100`
- Stats cards: profile completion %, saved addresses count
- Recent orders (top 5 as `OrderCard` components)
- Previously purchased products (extracted from order history)

**Account sub-pages**:

| Page | Components | Data |
|------|-----------|------|
| Profile (`perfil/`) | ProfileCard + SecurityCard | `retrieveCustomer()`, `listRegions()` |
| Company (`empresa/`) | CompanyCard + EmployeesCard | `retrieveCustomer()` → `retrieveCompany()`, `listRegions()` |
| Addresses (`moradas/`) | AddressBook | `retrieveCustomer()`, `getRegion()` |
| Orders (`encomendas/`) | OrderOverview | `listOrders()` |
| Order Detail (`encomendas/detalhes/[id]/`) | OrderDetailsTemplate | `retrieveOrder(id)` |
| Quotes (`orcamentos/`) | QuotesOverview | `fetchQuotes()` |
| Quote Detail (`orcamentos/detalhes/[id]/`) | QuoteDetails + preview | `fetchQuote(id)`, `fetchQuotePreview(id)` |

**Auth pages**:
- **Login/Register**: Render template components with form validation
- **Password recovery** (`recuperar-password/`): `useActionState(requestPasswordReset)` form, success shows green alert + redirect link
- **Password reset** (`redefinir-password/`): Validates `token` + `email` from URL params, `PasswordStrengthIndicator`, auto-redirects to login after 3s on success
- **Pending verification** (`verificacao-pendente/`): Static template page shown after registration

## Component Organization

Components follow a `modules/<feature>/components/<component>/index.tsx` pattern:

```
src/modules/
  account/          # Account management (login, register, profile, company, orders, quotes)
  cart/             # Cart drawer, items, totals, CSV export
  checkout/         # Multi-step checkout (address, shipping, payment, review)
  categories/       # Category breadcrumb and templates
  collections/      # Collection breadcrumb and templates
  common/           # Shared components (Button, CookieConsent, password inputs)
  contact/          # Contact form
  home/             # Landing page sections (Hero, CTASection, CaseStudies, TrustIndicators, etc.)
  layout/           # Navigation, footer, mega-menu, cart button, client-area header/footer
  order/            # Order confirmation and detail views
  products/         # Product cards, gallery, actions, variants table, related products
  quotes/           # Quote request confirmation
  search/           # Search modal (Meilisearch integration)
  shipping/         # Shipping components
  skeletons/        # Loading state skeletons for all major components
  store/            # Catalog pagination, refinement/sort, breadcrumb
```

## Configuration

### SDK & Search Client (`src/lib/config.ts`)

Two named exports:

- **`sdk`** — Medusa JS SDK instance. `baseUrl` from `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (default `http://localhost:9000`), `publishableKey` from `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
- **`searchClient`** — Meilisearch client from `instantMeiliSearch()` using `NEXT_PUBLIC_MEILISEARCH_HOST` and `NEXT_PUBLIC_MEILISEARCH_API_KEY`.

### Company Config (`src/config/index.ts`)

`CONFIG` object with static company info: `name`, `shortName`, `longName`, `description`, `vat` ("519165276"), `logo`, `favicon`, `address`, `phone`, `email`, `website`.

### Next.js Config

- Strict mode enabled
- `typescript.ignoreBuildErrors: true`
- Remote image patterns: S3, localhost, GitHub

### Yarn

Yarn 4.12.0 with `node-modules` linker (`.yarnrc.yml`).

## Data Layer

### Cookie Management (`src/lib/data/cookies.ts`)

All functions are server-only async. Three cookies are managed:

| Cookie | Name | Purpose | Settings |
|--------|------|---------|----------|
| Auth token | `_medusa_jwt` | JWT for authenticated requests | 7-day, httpOnly, strict SameSite, secure in prod |
| Cache ID | `_medusa_cache_id` | Per-session cache namespace | 24h, set by middleware |
| Cart ID | `_medusa_cart_id` | Active cart reference | 7-day, httpOnly, strict SameSite, secure in prod |

**Exports:**

| Function | Returns | Description |
|----------|---------|-------------|
| `getAuthHeaders()` | `{ authorization: "Bearer <token>" }` or `{}` | Reads JWT from cookie; proactively clears expired tokens (30s buffer) to avoid silent 401 redirects |
| `getCacheTag(tag)` | `"${tag}-${cacheId}"` | Builds session-scoped cache tag |
| `getCacheOptions(tag)` | `{ tags: [...] }` or `{}` | Next.js fetch cache options |
| `setAuthToken(token)` | `void` | Sets JWT cookie |
| `removeAuthToken()` | `void` | Deletes JWT cookie |
| `getCartId()` | `string \| undefined` | Reads cart ID |
| `setCartId(cartId)` | `void` | Sets cart cookie |
| `removeCartId()` | `void` | Expires cart cookie |

### Cart (`src/lib/data/cart.ts`)

All server actions (`"use server"`).

| Function | Parameters | Description |
|----------|-----------|-------------|
| `retrieveCart` | `id?: string` | Fetches cart with expanded items, region, product, variant, promotions, company, customer |
| `getOrSetCart` | `countryCode` | Gets existing cart or creates one with `region_id` and `metadata.company_id` from customer's employee |
| `updateCart` | `data: StoreUpdateCart` | Updates cart, revalidates `fulfillment` and `carts` tags |
| `addToCart` | `{ variantId, quantity, countryCode }` | Creates line item, ensures cart exists first |
| `addToCartBulk` | `{ lineItems, countryCode }` | Raw fetch to `/store/carts/{id}/line-items/bulk` (custom endpoint) |
| `updateLineItem` | `{ lineId, data }` | Updates single line item |
| `deleteLineItem` | `lineId` | Removes line item |
| `emptyCart` | — | Deletes all line items sequentially |
| `setShippingMethod` | `{ cartId, shippingMethodId }` | Sets shipping option on cart |
| `initiatePaymentSession` | `cart, { provider_id, context? }` | Creates payment session |
| `applyPromotions` | `codes: string[]` | Applies promo codes via `updateCart` |
| `submitPromotionForm` | `currentState, formData` | Form action wrapper for `applyPromotions` |
| `setShippingAddress` | `formData` | Updates cart shipping address and email from form |
| `setBillingAddress` | `formData` | Updates cart billing address from form |
| `setContactDetails` | `currentState, formData` | Updates email and metadata: `invoice_recipient`, `cost_center`, `requisition_number`, `door_code`, `notes` |
| `placeOrder` | `cartId?` | Completes cart, tracks `order_completed`, removes cart cookie, redirects to confirmation |
| `updateRegion` | `countryCode, currentPath` | Updates cart region, revalidates `regions`/`products`, redirects |

### Customer (`src/lib/data/customer.ts`)

| Function | Description |
|----------|-------------|
| `retrieveCustomer()` | Fetches `/store/customers/me` with `*employee, *orders` |
| `updateCustomer(body)` | Updates profile, revalidates `customers` |
| `signup(state, formData)` | Full registration: creates auth account → customer → company → employee (as admin). Redirects to `/conta/verificacao-pendente` |
| `login(state, formData)` | Authenticates, sets JWT, creates/updates cart with `company_id`, transfers anonymous cart. Redirects to `/portal/conta` |
| `signout(countryCode)` | Clears token and cart cookies, revalidates caches |
| `transferCart()` | Associates anonymous cart with authenticated customer |
| `addCustomerAddress(state, formData)` | Creates new address |
| `deleteCustomerAddress(addressId)` | Deletes address |
| `updateCustomerAddress(state, formData)` | Updates address (reads `addressId` from state) |
| `requestPasswordReset(state, formData)` | POSTs to `/vendor/auth/customer/emailpass/reset-password` |
| `resetPassword(state, formData)` | Validates password (8 chars, lowercase, uppercase, number), posts with reset token |
| `updateCustomerPassword(state, formData)` | Same validation, uses session auth instead of reset token |

### Companies (`src/lib/data/companies.ts`)

| Function | Description |
|----------|-------------|
| `retrieveCompany(companyId)` | Fetches company with `+spending_limit_reset_frequency, *employees.customer` |
| `createCompany(data, customHeaders?)` | Creates company, tracks `company_created` event |
| `updateCompany(data)` | Updates company by ID |
| `createEmployee(data, customHeaders?)` | Creates employee, tracks `employee_created` event |
| `updateEmployee(data)` | Updates employee |
| `deleteEmployee(companyId, employeeId)` | Deletes employee |

### Products (`src/lib/data/products.ts`)

| Function | Description |
|----------|-------------|
| `getProductsById({ ids, regionId })` | Batch fetch with `*variants, *variants.calculated_price, *variants.inventory_quantity` |
| `getProductByHandle(handle, regionId)` | Single product by handle with pricing, inventory, metadata, tags |
| `listProducts({ pageParam?, queryParams?, countryCode })` | Paginated listing, 12/page default |
| `listProductsWithSort({ page?, queryParams?, sortBy?, countryCode })` | Fetches 100 products, client-side sort via `sortProducts()`, then paginates |

### Quotes (`src/lib/data/quotes.ts`)

| Function | Description |
|----------|-------------|
| `createQuote()` | Creates quote from current cart, tracks `quote_created` |
| `fetchQuotes(query?)` | Lists quotes ordered by `-created_at` |
| `fetchQuote(id, query?)` | Single quote with per-quote cache tag |
| `fetchQuotePreview(id, query?)` | Quote preview with separate cache tag |
| `acceptQuote(id)` | Accepts quote, tracks `quote_accepted`, revalidates quote caches |
| `rejectQuote(id)` | Rejects quote, revalidates quote caches |
| `createQuoteMessage(id, body)` | Adds message to quote thread, tracks `quote_message_created` |

### Orders (`src/lib/data/orders.ts`)

| Function | Description |
|----------|-------------|
| `retrieveOrder(id)` | Fetches order with payments, items, variants, products |
| `listOrders(limit=10, offset=0, filters?)` | Paginated list sorted by `-created_at` |

### Regions (`src/lib/data/regions.ts`)

In-process `regionMap` cache for performance.

| Function | Description |
|----------|-------------|
| `listRegions()` | All regions with `force-cache` and `"regions"` tag |
| `retrieveRegion(id)` | Single region by ID |
| `getRegion(countryCode)` | Looks up region by ISO-2 code, populates map on first call, falls back to `"us"` |

### Categories (`src/lib/data/categories.ts`)

| Function | Description |
|----------|-------------|
| `listCategories(query?)` | All categories (limit 100) with children, products, parent chain |
| `getCategoryByHandle(categoryHandle[])` | Joins handle array with `/`, returns first match |

### Collections (`src/lib/data/collections.ts`)

| Function | Description |
|----------|-------------|
| `retrieveCollection(id)` | Single collection with `force-cache` |
| `listCollections(queryParams?)` | All collections (limit 100) |
| `getCollectionByHandle(handle)` | Collection by handle |

### Fulfillment (`src/lib/data/fulfillment.ts`)

| Function | Description |
|----------|-------------|
| `listCartShippingMethods(cartId)` | Shipping options for cart |
| `listCartFreeShippingPrices(cartId)` | Custom endpoint: `/store/free-shipping/prices?cart_id=...`, returns `StoreFreeShippingPrice[]` |

### Payment (`src/lib/data/payment.ts`)

| Function | Description |
|----------|-------------|
| `listCartPaymentMethods(regionId)` | Payment providers for region |

### Cart Event Bus (`src/lib/data/cart-event-bus.ts`)

Client-safe module (not a server action). Observer pattern for cross-component cart updates.

- **`AddToCartEventPayload`** (type) — `{ lineItems: Array<{ productVariant, quantity }>, regionId }`
- **`addToCartEventBus`** (singleton):
  - `emitCartAdd(payload)` — Calls registered handler, tracks `add_to_cart` event per line item
  - `registerCartAddHandler(handler)` — Replaces handler. Called once from `CartProvider`
  - `handler` — Currently registered callback (default no-op)

## Caching Strategy

The storefront uses per-session cache isolation via the `_medusa_cache_id` cookie.

### How It Works

1. Middleware generates a UUID `_medusa_cache_id` cookie on first visit (24h expiry)
2. `getCacheTag(tag)` builds `"${tag}-${cacheId}"` to scope cache entries per session
3. Data functions pass these tags to Next.js `fetch` via `next: { tags: [...] }`
4. After mutations, `revalidateTag()` invalidates specific cache entries

### Cache Tags

| Tag | Used By |
|-----|---------|
| `carts` | Cart operations |
| `customers` | Customer/profile operations |
| `companies` | Company and employee operations |
| `products` | Product listings |
| `orders` | Order operations |
| `quotes` | Quote listings |
| `quote-{id}` | Individual quote |
| `quotePreview-{id}` | Individual quote preview |
| `regions` | Region data |
| `regions-{id}` | Individual region |
| `categories` | Category data |
| `collections` | Collection data |
| `fulfillment` | Shipping methods |
| `freeShipping` | Free shipping thresholds |
| `payment_providers` | Payment methods |
| `auth` | Auth state |

## Utility Functions (`src/lib/util/`)

### Spending Limits (`check-spending-limit.ts`)

- **`getSpendWindow(company)`** — Computes `{ start, end }` based on `spending_limit_reset_frequency`: `never` (epoch→now), `daily`, `weekly` (Sunday start), `monthly`, `yearly`
- **`getOrderTotalInSpendWindow(orders, window)`** — Sums order totals within the date window
- **`checkSpendingLimit(cart, customer)`** — Returns `true` if the employee would exceed their spending limit. Returns `false` if no limit is set (0 or missing)

### Product Pricing (`get-product-price.ts`)

- **`getPricesForVariant(variant)`** — Returns `VariantPrice` with `calculated_price`, `original_price`, `currency_code`, `price_type`, `percentage_diff`
- **`getProductPrice({ product, variantId? })`** — Returns `cheapestPrice` and optionally `variantPrice` for a specific variant

### CSV Export (`convert-cart-to-csv.ts`)

- **`cartToCsv(cart)`** — Maps line items to CSV with columns: Item ID, Variant ID, Product Title, Description, SKU, Variant Title, Quantity, Unit Price, Tax Rate, Total Price, Total Tax

### Sorting (`sort-products.ts`)

- **`sortProducts(products, sortBy)`** — Client-side sort: `price_asc`, `price_desc` (by min variant `calculated_amount`), `created_at` (most recent first)

### Currency (`money.ts`)

- **`convertToLocale({ amount, currency_code, locale? })`** — Formats via `Intl.NumberFormat` with `style: "currency"`. Defaults to `"en-US"` locale

### Checkout Steps (`get-checkout-step.ts`)

- **`getCheckoutStep(cart)`** — Returns first incomplete step in order: `"shipping-address"` → `"billing-address"` → `"delivery"` → `"contact-information"` → `"payment"` → `null` (complete)

### Other Utilities

| Function | File | Description |
|----------|------|-------------|
| `compareAddresses(a, b)` | `compare-addresses.ts` | Lodash `isEqual` on address fields |
| `getPercentageDiff(original, calculated)` | `get-precentage-diff.ts` | Percentage decrease as string |
| `medusaError(error)` | `medusa-error.ts` | Normalizes Axios errors into thrown `Error` |
| `isEmpty(input)` | `isEmpty.ts` | Checks null, undefined, empty object/array/string |
| `repeat(times)` | `repeat.ts` | Returns `[0, 1, ..., n-1]` for skeleton loaders |
| `getBaseURL()` | `env.ts` | Returns `NEXT_PUBLIC_BASE_URL` or `https://localhost:8000` |
| `isRateLimitError(error)` | `rate-limit-error.ts` | Checks if error is a 429 `FetchError` (server-side only) |
| `getRateLimitMessage(error)` | `rate-limit-error.ts` | Extracts Portuguese message from 429 response |

### Rate Limit Error Handling

Backend rate-limited endpoints return 429 with `{ type: "rate_limit", message: "..." }`. Since Next.js strips custom error properties (like `FetchError.status`) when serializing across the server→client boundary, **rate limit detection must happen inside server actions** — not in client component catch blocks.

Server actions (`contact.ts`, `quotes.ts`) catch 429 errors and return structured results:
```typescript
{ success: false, rateLimited: true, message: "..." }
```

Client components then check the `rateLimited` flag:
- **Contact form** → amber warning banner with the Portuguese message
- **Quote creation** → toast via `@medusajs/ui`: "Limite atingido" + message
- **Login/signup** → error message string returned from server action (already caught server-side in `customer.ts`)

## SEO & Metadata

### Title Template

The root layout (`src/app/layout.tsx`) defines a title template `"%s | Rio Gaia"` that automatically appends the brand suffix to all page titles. Individual pages should export only the page-specific title (e.g., `title: "Sobre Nós"` renders as "Sobre Nós | Rio Gaia"). Do **not** manually append `" - Rio Gaia"` or `" | Rio Gaia"` to page titles.

### robots.ts

`src/app/robots.ts` generates `/robots.txt` blocking crawlers from `/portal/`, `/conta/`, and `/api/` paths. The portal layout also sets `robots: { index: false, follow: false }` as a page-level directive for defense in depth.

### sitemap.ts

`src/app/sitemap.ts` generates a static `/sitemap.xml` with all 13 public `/pt/` pages (homepage, marketing pages, product category pages, legal pages). It does not call Medusa APIs — all public pages are statically defined.

### Portal noindex

The portal layout (`src/app/[countryCode]/portal/layout.tsx`) sets `robots: { index: false, follow: false }` in its metadata export. This propagates to all nested portal pages via Next.js metadata merging. Portal pages do not need canonical URLs since they are noindex.

## Authentication Flow

### Signup

`signup()` in `customer.ts` performs an atomic multi-step registration:

1. Registers auth identity via `sdk.auth.register("customer", "emailpass", { email, password })`
2. Creates customer with name, email, phone via `sdk.store.customer.create()`
3. Logs in to get JWT token, sets `_medusa_jwt` cookie
4. Creates company via `createCompany()` (with name, NIF/VAT, phone, address, currency)
5. Creates employee via `createEmployee()` (as admin, `spending_limit: 0`)
6. Redirects to `/conta/verificacao-pendente`

### Login

1. Authenticates via `sdk.auth.login("customer", "emailpass", { email, password })`
2. Sets JWT cookie (7-day, httpOnly, strict SameSite)
3. Revalidates caches, creates/updates cart with `company_id`
4. Transfers anonymous cart to authenticated customer
5. Redirects to `/portal/conta`

### Session Expiry

`getAuthHeaders()` proactively checks the JWT `exp` claim with a 30-second buffer. If expired, the token is deleted before any API call is made. When the portal layout detects `customer = null`, it redirects to `/conta/entrar?session_expired=true`. The login page reads the `session_expired` query param and displays an info banner: "A sua sessão expirou. Por favor, inicie sessão novamente."

### Signout

Clears JWT token, removes cart ID, revalidates `auth`, `customers`, `products`, `carts` tags.

### Password Reset

1. **Request**: `requestPasswordReset()` POSTs email to `/vendor/auth/customer/emailpass/reset-password`
2. **Email**: Backend sends reset link (handled by email-notification module)
3. **Reset**: `resetPassword()` validates password requirements (8+ chars, lowercase, uppercase, number), POSTs to `/vendor/auth/customer/emailpass/update` with Bearer token

## Portal Layout & Auth Guards

The portal layout (`src/app/[countryCode]/portal/layout.tsx`) is a server component that enforces authentication:

1. **Not authenticated** → redirect to `/conta/entrar`
2. **No company** → renders inline error ("empresa associada ao seu perfil nao foi encontrada")
3. **Company not verified** → redirect to `/conta/verificacao-pendente`

If all checks pass, renders:
- `CartProvider` wrapping all children
- `ClientAreaHeader` (navigation)
- Promotional banner ("Novos produtos disponiveis")
- `CartMismatchBanner` (if cart and customer exist)
- Page `{children}` in white container
- `ClientAreaFooter`
- `FreeShippingPriceNudge` popup (if cart and free shipping prices available)

## Checkout Flow

### URL-Driven Steps

Checkout progress is driven by `?step=` search params. `getCheckoutStep(cart)` determines the first incomplete step:

1. **`shipping-address`** — Cart has no `shipping_address.address_1`
2. **`billing-address`** — Cart has no `billing_address.address_1`
3. **`delivery`** — Cart has no `shipping_methods`
4. **`contact-information`** — Cart has no `email`
5. **`payment`** — No pending payment session
6. **`null`** — All steps complete, ready for order placement

### Checkout Form Components

Rendered in order by `CheckoutForm` (server component):
1. "Voltar ao carrinho" link → `/portal/carrinho`
2. `SignInPrompt` (if unauthenticated)
3. `Company` (B2B company info from cart)
4. `ShippingAddress`
5. `BillingAddress`
6. `Shipping` (available shipping methods)
7. `ContactDetails` — metadata fields: `invoice_recipient`, `cost_center`, `requisition_number`, `door_code`, `notes`
8. `Payment` (available payment methods)

### Payment Providers

`PaymentButton` dispatches based on `provider_id`:

| Provider | Component | Behavior |
|----------|-----------|----------|
| Stripe | `StripePaymentButton` | `stripe.confirmCardPayment()` with billing details, proceeds on `requires_capture` or `succeeded` |
| PayPal | `PayPalPaymentButton` | `actions.order.authorize()`, proceeds only on `COMPLETED` status |
| Manual/Invoice | `ManualTestPaymentButton` | Directly calls `completeCart()` |

**Guard**: Payment button is disabled if cart is missing `shipping_address`, `billing_address`, `email`, or shipping methods.

### Order Placement

`placeOrder()` calls `cart.complete()` → tracks `order_completed` event → removes cart cookie → redirects to `/portal/encomenda/confirmada/{id}`.

Spending limit validation happens before order placement via `checkSpendingLimit()`.

## Search Integration

Modal-based search using `react-instantsearch` with Meilisearch backend (`src/modules/search/`).

- **Trigger**: Rounded gray button with magnifying glass icon, "Pesquisar produtos" label
- **Modal**: `InstantSearch` with `searchClient` from config and `NEXT_PUBLIC_MEILISEARCH_INDEX_NAME` index (default `"products"`)
- **Search box**: Portuguese placeholder "Pesquisar produtos..."
- **Results**: `Hits` rendering product previews with thumbnail, title, categories, tags
- **Links**: Each hit links to `/portal/produtos/{handle}` (portal-scoped)
- **Auto-close**: Modal closes on route change via `usePathname()` watcher

## Cart Context & Optimistic Updates

`src/lib/context/cart-context.tsx` provides `CartProvider` wrapping the portal. Uses React 19's `useOptimistic` and `useTransition` for instant UI feedback with background server sync.

### Optimistic ID System

- New items get IDs prefixed with `__optimistic__` (e.g., `__optimistic__-variant_123`)
- Items with optimistic IDs skip server API calls on quantity updates — they only exist locally until the bulk add resolves
- `isOptimisticItemId(id)` helper exported for use by other components

### Rollback Pattern

- Before every mutation, `structuredClone(prevCart)` saves the pre-mutation state
- On API failure, restores the snapshot + shows toast error
- Items sorted by `created_at` descending via `useMemo`

### Event Bus Integration

- On mount, registers `handleOptimisticAddToCart` via `addToCartEventBus.registerCartAddHandler()`
- When `emitCartAdd()` fires (from `ProductVariantsTable`), the handler:
  1. Optimistically merges new items (increments existing variant quantities or creates new line items with `__optimistic__` IDs)
  2. Recalculates `item_subtotal` as sum of `unit_price × quantity`
  3. Calls `addToCartBulk()` server action
  4. Rolls back on failure

### Exposed Context (`useCart()`)

| Field | Type | Description |
|-------|------|-------------|
| `cart` | `B2BCart \| null` | Optimistic cart state |
| `handleDeleteItem(lineId)` | `Promise<void>` | Optimistic remove + `deleteLineItem()` API |
| `handleUpdateCartQuantity(lineId, qty)` | `Promise<void>` | Optimistic update + API (skips for `__optimistic__` items) |
| `handleEmptyCart()` | `Promise<void>` | Optimistic nullify + `emptyCart()` API |
| `isUpdatingCart` | `boolean` | True during API calls |

### CartDrawer

`src/modules/cart/components/cart-drawer/index.tsx` — slide-out cart preview in the portal header.

- **Auto-open**: Opens with 5-second auto-close timer when `totalItems` changes (tracked via `useRef`)
- **Path exclusions**: Does NOT auto-open on `/portal/carrinho` (cart page) or `/portal/conta` (account pages)
- **Hover cancels timer**: `onMouseEnter` on the `<Drawer>` clears the auto-close timeout
- **Route change closes**: `useEffect` on `pathname` cancels timer and closes drawer
- **Backdrop**: Blur overlay (`backdrop-blur-sm`) when open
- **Trigger button**: Shopping bag icon + subtotal (formatted) + item count badge (blue)
- **Content**: Applied promotions → line items → free shipping nudge → subtotal → "Ver Carrinho" button → "Esvaziar Carrinho" button
- **Spending limit warning**: Orange `ExclamationCircle` with message "Esta encomenda excede o seu limite de gastos..." when `checkSpendingLimit()` returns true

## Middleware (`src/middleware.ts`)

The Next.js middleware runs on all non-asset routes:

### Flow

1. **Cart ID handling**: If `cart_id` query param exists, sets `_medusa_cart_id` cookie (24h) and appends `&step=address`
2. **Fast path**: If URL already has correct country code, cart cookie, and cache cookie — passes through
3. **Static assets**: Passes through if URL contains `.`
4. **Region map**: Fetches `/store/regions` from backend with 1-hour revalidation, builds country-to-region map
5. **Country detection**: Priority: URL path → `x-vercel-ip-country` header → `DEFAULT_REGION` env (default `"pt"`) → first region in map
6. **Cache ID**: Reads from query param or generates new UUID, sets `_medusa_cache_id` cookie (24h)
7. **Redirect**: If country code missing from URL, 307 redirect to `/{countryCode}{path}{query}`

### Matcher

Excludes: `api`, `_next/static`, `_next/image`, `favicon.ico`, `images`, `assets`, common image extensions.

## B2B-Specific Features

### Company Registration

Signup form has two sections: personal info (name, email, phone, password) and company info (name, NIF/VAT, phone, address, city, postal code, currency). The `signup()` action atomically creates all entities.

### Spending Limits

Employees have configurable `spending_limit` with `spending_limit_reset_frequency` (never, daily, weekly, monthly, yearly). The `checkSpendingLimit()` utility sums orders within the current spend window and checks against the limit before checkout.

### Bulk Ordering

`ProductVariantsTable` renders inline quantity inputs per variant. On submit, emits items via `addToCartEventBus.emitCartAdd()` which the `CartProvider` picks up for optimistic updates and bulk API call.

### Cart CSV Export

`cartToCsv()` generates CSV from cart line items. UI uses File System Access API (`showSaveFilePicker`) with blob fallback. Default filename: `"carrinho.csv"`.

### Quote Requests

`RequestQuoteConfirmation` component allows creating an RFQ from the current cart. Creates a quote linked to the cart, which admins can respond to with pricing.

### Free Shipping Nudge

`FreeShippingPriceNudge` component shows progress toward free shipping threshold, using data from `listCartFreeShippingPrices()`.

## Analytics

Vercel Analytics (`@vercel/analytics`) tracks key B2B events. Server-side uses `@vercel/analytics/server`.

| Event | Location | Trigger |
|-------|----------|---------|
| `add_to_cart` | `cart-event-bus.ts` | Product added via event bus (includes `product_name`, `quantity`) |
| `order_completed` | `cart.ts` | Order placed via `placeOrder()` |
| `customer_logged_in` | `customer.ts` | Successful login |
| `customer_logged_out` | `customer.ts` | Signout |
| `company_created` | `companies.ts` | Company registration |
| `employee_created` | `companies.ts` | Employee added |
| `quote_created` | `quotes.ts` | Quote submitted |
| `quote_accepted` | `quotes.ts` | Quote accepted by customer |
| `quote_message_created` | `quotes.ts` | Message added to quote thread |

## Server vs Client Component Patterns

### Server Components

Used for: layouts, pages (data fetching), templates, auth checks. All data fetching happens server-side via `"use server"` actions.

### Client Components

Used for: forms, cart interactions, navigation state, search modal, cookie consent.

### Suspense Boundaries

Key components wrapped in `Suspense` with skeleton fallbacks:
- `ProductActionsWrapper` — product page actions
- `RelatedProducts` — related product grid
- `MegaMenu` — navigation menu
- `AccountButton` — account dropdown
- `CartButton` — cart icon with count

## Common Components

### Button (`src/modules/common/components/button/`)

Wraps `@medusajs/ui` Button with custom styling. Always `!rounded-full text-sm font-normal`. Variants:
- **primary**: `bg-neutral-900 text-white`, no shadow
- **secondary/disabled**: `!shadow-borders-base !border-none`
- **transparent**: `bg-transparent text-neutral-900`

### LocalizedClientLink

Auto-prepends `/{countryCode}` from `useParams()` to all internal links.

### CookieConsent (`src/modules/common/components/CookieConsent.tsx`)

GDPR cookie banner using `localStorage` key `"rio-gaia-cookie-consent"`. Fixed bottom position with brand blue (`#0047AB`). Links to privacy policy and terms. Portuguese text. Accept or dismiss (no actual consent enforcement).

### PasswordStrengthIndicator

4-bar visual indicator with 5 criteria: length >= 8, uppercase, lowercase, digit, special character. Portuguese labels:
- Score 1 (<=2 criteria): "Fraca" (red)
- Score 2 (3 criteria): "Razoavel" (orange)
- Score 3 (4 criteria): "Boa" (yellow)
- Score 4 (all 5): "Forte" (green)

## Design System

### Colors

- **Primary blue**: `#0047AB` (used in buttons, banners, CTA)
- **Dark blue**: `#003685`
- **Destructive**: `#d4183d`
- **Neutral dark**: `#030213` (near-black foreground)
- CSS variables use `oklch()` color space with light/dark mode support

### Typography

Custom utility classes defined in `globals.css`:
- Scale from `.text-xsmall-regular` (10px) through `.text-3xl-semi` (32px)
- Variants: `-regular` (normal weight) and `-semi` (semibold)
- Font: Geist Sans (variable font)

### Layout

- `.content-container` — `max-w-[1440px] w-full mx-auto px-6`
- `.contrast-btn` — rounded border button with hover fill

### UI Libraries

- **Medusa UI**: Button, Drawer, Input, Container, Toaster, Table
- **Icons**: `@medusajs/icons` + `lucide-react`

## Portuguese Localization

All UI strings are in Portuguese:

- **Route paths**: `/conta/entrar`, `/portal/catalogo`, `/portal/carrinho`, `/portal/conta/encomendas`, etc.
- **Form labels**: "Nome", "Apelido", "Email", "Palavra-passe", "Morada", "Codigo Postal", "Cidade", etc.
- **Button text**: "Entrar", "Registar", "Adicionar ao carrinho", "Finalizar encomenda", etc.
- **Password strength**: "Fraca", "Razoavel", "Boa", "Forte"
- **Cookie consent**: Full GDPR banner in Portuguese with privacy/terms links
- **Error messages**: Portuguese form validation and API error messages

## B2B Types (`src/types/global.ts`)

```ts
enum SpendingLimitResetFrequency { never, daily, weekly, monthly, yearly }

interface B2BCart extends StoreCart {
  completed_at?: string
  company: QueryCompany
  promotions: StoreCartPromotion[]
  customer?: StoreCustomer
}

interface B2BOrder extends StoreOrder {
  company: QueryCompany
}

interface B2BCustomer extends StoreCustomer {
  employee: QueryEmployee | null
  orders?: StoreOrder[]
  cart?: B2BCart[]
}
```

## Known Issues & TODOs

1. **ContactForm not wired up** — `src/modules/contact/components/contact-form.tsx` has `// TODO: Implement actual form submission`. Uses a 1000ms `setTimeout` stub that always shows success. Needs a backend API endpoint or email integration.

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout (lang=pt, Geist font, Toaster, CookieConsent, Analytics) |
| `src/middleware.ts` | Region detection, country routing, cart/cache cookies |
| `src/lib/config.ts` | Medusa SDK and Meilisearch client initialization |
| `src/config/index.ts` | Company details constant (name, VAT, address, social links) |
| `src/lib/context/cart-context.tsx` | Cart state with optimistic updates |
| `src/lib/data/cookies.ts` | Cookie management (auth, cart, cache) |
| `src/lib/data/cart.ts` | Cart server actions (16 functions) |
| `src/lib/data/customer.ts` | Auth + customer server actions (12 functions) |
| `src/lib/data/cart-event-bus.ts` | Cross-component cart event observer |
| `src/types/global.ts` | B2BCart, B2BOrder, B2BCustomer type extensions |
| `src/modules/layout/components/client-area-header/` | Portal header with nav, search, cart |
| `src/modules/checkout/templates/checkout-form/index.tsx` | Multi-step checkout form |
| `src/modules/checkout/components/payment-button/index.tsx` | Stripe/PayPal/Manual payment dispatch |
| `src/modules/search/components/modal/index.tsx` | Meilisearch search modal |
| `src/modules/products/components/product-variants-table/index.tsx` | Bulk ordering table |
| `src/styles/globals.css` | Tailwind config, CSS variables, custom utilities |
