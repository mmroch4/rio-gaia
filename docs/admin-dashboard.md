# Admin Dashboard Guide

Custom UI extensions for the Medusa admin panel, accessible at `/app`. Built with React, Medusa UI components, TanStack React Query, TanStack React Table, and React Router.

## Architecture

```
admin/
  lib/
    client.ts              # Medusa JS SDK instance (session auth, baseUrl="/")
    query-key-factory.ts   # Generic React Query cache key generator
  hooks/
    api/                   # Data-fetching hooks (React Query) per domain
      companies.tsx        # useCompanies, useCompany, useCreateCompany, useUpdateCompany, useDeleteCompany, useAddCompanyToCustomerGroup, useRemoveCompanyFromCustomerGroup
      employees.tsx        # useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee
      quotes.tsx           # useQuotes, useQuote, useAddItemsToQuote, useUpdateQuoteItem, useRemoveQuoteItem, useUpdateAddedQuoteItem, useConfirmQuote, useSendQuote, useRejectQuote, useCreateQuoteMessage
      order-preview.tsx    # useOrderPreview
      customers.tsx        # useAdminCustomerGroups, useAdminCreateCustomer
      regions.tsx          # useRegions
      variants.tsx         # useVariants
    use-data-table.tsx     # TanStack React Table wrapper with URL-driven pagination
    use-query-params.tsx   # Search params extraction for table queries
    regions.tsx            # Region formatting utilities
  components/common/       # Shared UI components
  routes/                  # Admin page components
  utils/                   # formatAmount, currency symbol map
```

---

## SDK Client (`lib/client.ts`)

```ts
const sdk = new Medusa({ baseUrl: "/", auth: { type: "session" } });
```

- **`baseUrl: "/"`** — Admin is served from the same origin as the backend (`/app`), so relative URLs work for all API calls.
- **Session auth** — Uses the admin panel's built-in cookie-based session. No bearer tokens needed.
- Custom routes use `sdk.client.fetch<T>()` for typed requests to custom endpoints (e.g., `/admin/companies`).
- Built-in Medusa routes use the SDK's higher-level methods (e.g., `sdk.admin.orderEdit.addItems()`).

---

## Query Key Factory (`lib/query-key-factory.ts`)

Generic factory that produces hierarchical cache keys for React Query:

```ts
const companyQueryKey = queryKeysFactory("company");

companyQueryKey.all          // ["company"]
companyQueryKey.lists()      // ["company", "list"]
companyQueryKey.list(query)  // ["company", "list", { query }]
companyQueryKey.details()    // ["company", "detail"]
companyQueryKey.detail(id)   // ["company", "detail", id, { query: undefined }]
```

This enables granular cache invalidation — e.g., after creating a company, invalidate `companyQueryKey.lists()` to refresh the table without clearing individual detail caches.

---

## Custom Hooks

All hooks live in `hooks/api/` and follow a consistent pattern:
- **Queries** return `useQuery` results with typed response types
- **Mutations** return `useMutation` results with automatic cache invalidation via `queryClient.invalidateQueries()`
- All use the shared `queryKeysFactory` for cache key consistency

### Companies (`hooks/api/companies.tsx`)

| Hook | Type | Cache Key | Description |
|------|------|-----------|-------------|
| `useCompanies` | Query | `company.list` | List all companies with optional query params |
| `useCompany` | Query | `company.detail(id)` | Single company by ID |
| `useCreateCompany` | Mutation | Invalidates `lists`, `detail` | Create company via POST |
| `useUpdateCompany` | Mutation | Invalidates `lists`, `detail(id)` | Update company fields |
| `useDeleteCompany` | Mutation | Invalidates `lists` | Delete company |
| `useAddCompanyToCustomerGroup` | Mutation | Invalidates `lists`, `detail(id)` | Link company to customer group for B2B pricing |
| `useRemoveCompanyFromCustomerGroup` | Mutation | Invalidates `lists`, `detail(id)` | Remove customer group link |

### Employees (`hooks/api/employees.tsx`)

| Hook | Type | Cache Key | Description |
|------|------|-----------|-------------|
| `useEmployees` | Query | `employee.list(companyId)` | List employees for a company |
| `useCreateEmployee` | Mutation | Invalidates `list(companyId)` | Create employee in company |
| `useUpdateEmployee` | Mutation | Invalidates `detail(id)`, `list(companyId)` | Update employee fields |
| `useDeleteEmployee` | Mutation | Invalidates `list(companyId)` | Delete employee |

### Quotes (`hooks/api/quotes.tsx`)

| Hook | Type | Cache Key | Description |
|------|------|-----------|-------------|
| `useQuotes` | Query | `quote.list` | List all quotes with filter params |
| `useQuote` | Query | `quote.detail(id)` | Single quote with relations |
| `useAddItemsToQuote` | Mutation | Invalidates `orderPreview.detail(id)` | Add line items via order edit API |
| `useUpdateQuoteItem` | Mutation | Invalidates `orderPreview.detail(id)` | Update original item quantity/price |
| `useRemoveQuoteItem` | Mutation | Invalidates `orderPreview.detail(id)` | Remove an added item by action ID |
| `useUpdateAddedQuoteItem` | Mutation | Invalidates `orderPreview.detail(id)` | Update a newly added item |
| `useConfirmQuote` | Mutation | Invalidates `orderPreview.details` | Confirm order edit (request changes) |
| `useSendQuote` | Mutation | Invalidates `orderPreview`, `quote.detail`, `quote.lists` | Send quote to customer |
| `useRejectQuote` | Mutation | Invalidates `orderPreview`, `quote.detail`, `quote.lists` | Merchant reject quote |
| `useCreateQuoteMessage` | Mutation | Invalidates `quote.details` | Add message to quote thread |

### Other Hooks

| Hook | File | Description |
|------|------|-------------|
| `useOrderPreview` | `order-preview.tsx` | Preview order changes via `sdk.admin.order.retrievePreview()`. Key: `custom_orders` |
| `useAdminCustomerGroups` | `customers.tsx` | List customer groups via `sdk.admin.customerGroup.list()` |
| `useAdminCreateCustomer` | `customers.tsx` | Create customer via `sdk.admin.customer.create()` |
| `useRegions` | `regions.tsx` | List regions via `sdk.admin.region.list()` |
| `useVariants` | `variants.tsx` | List product variants via `sdk.admin.productVariant.list()` |

---

## Data Table System

### `useDataTable` Hook (`hooks/use-data-table.tsx`)

Wraps TanStack React Table with URL-driven pagination:

- **Pagination state** synced to URL search params (e.g., `?offset=20`)
- Supports optional `prefix` to avoid param collisions (e.g., `?quo_offset=50`)
- Configurable `pageSize` (default: 20), row selection, expandable rows
- Returns a configured `table` instance ready for the `DataTable` component

### `DataTable` Component (`components/common/table/data-table/`)

Full-featured table component with:
- Column definitions via TanStack `columnHelper`
- Server-side pagination with `offset`/`limit` params
- Search input (text filter)
- Filter chips (string, select, number filter types)
- Row click navigation via `navigateTo` prop
- Empty state with configurable title/message
- Order by controls

### Table Cell Components (`components/common/table/table-cells/`)

| Component | Purpose |
|-----------|---------|
| `TextCell` | Plain text display |
| `DateCell` | Formatted date/time |
| `AmountCell` | Currency-formatted amounts |
| `ProductCell` | Product thumbnail + title |
| `PlaceholderCell` | Dash placeholder for empty values |

---

## Routes / Pages

### Companies List (`/app/companies`)

**File**: `routes/companies/page.tsx`

- **Nav config**: `defineRouteConfig({ label: "Companies", icon: BuildingStorefront })` — adds "Companies" to the admin sidebar
- **Data**: `useCompanies` with `*employees`, `*employees.customer`, `*customer_group` relations
- **Table columns**: Avatar, Name, Phone, Email, Address, Employee count, Verified badge (green/grey), Customer Group badge (blue), Actions
- **Actions**: `CompanyCreateDrawer` button in header for creating new companies
- **Row click**: Navigates to `/app/companies/:companyId`
- **Row actions**: `CompanyActionsMenu` with Edit, Manage Customer Group, Delete options

### Company Detail (`/app/companies/:companyId`)

**File**: `routes/companies/[companyId]/page.tsx`

Two-section layout:

1. **Company Info** — Key-value table showing Phone, Email, VAT, Address, City, State, Currency, Verified status, Customer Group. Header has avatar + company name + actions menu.

2. **Employees Table** — Lists all employees with columns: Avatar, Name (with Admin badge), Email, Spending Limit (formatted via `formatAmount`), Actions. Empty state shows "No records" message.
   - **Employee row click**: Navigates to Medusa's built-in customer page (`/app/customers/:customerId`)
   - **Create button**: `EmployeeCreateDrawer` for adding employees
   - **Row actions**: `EmployeesActionsMenu` for edit/delete

### Quotes List (`/app/quotes`)

**File**: `routes/quotes/page.tsx`

- **Nav config**: `defineRouteConfig({ label: "Quotes", icon: DocumentText })`
- **Component**: Delegates to `QuotesTable` component
- **Page size**: 50 items, prefix `quo` for URL params
- **Columns**: Order display ID (`#123`), Status badge, Customer email, Company name, Total amount, Created at
- **Features**: Search, pagination, ordering by `id` or `created_at`, row click navigates to `/quotes/:quoteId`
- **Data**: Fetches with `+draft_order.total`, `+draft_order.customer.email`, `*draft_order.customer.employee.company` relations

### Quote Detail (`/app/quotes/:quoteId`)

**File**: `routes/quotes/[quoteId]/page.tsx`

Two-column responsive layout:

**Main column** (left):
- **Accepted banner** — Green checkmark + "View Order" button linking to `/orders/:draft_order_id` (visible only when status is `accepted`)
- **QuoteDetailsHeader** — Quote metadata and status
- **QuoteItems** — Line items with order preview comparison
- **CostBreakdown** — Subtotal, shipping, tax, discount breakdowns
- **QuoteTotal** — Final total with preview diff
- **Action buttons** — Conditional on status:
  - "Send Quote" visible when `pending_merchant` or `customer_rejected`
  - "Reject Quote" visible when NOT `customer_rejected`, `merchant_rejected`, or `accepted`
  - Both use `usePrompt` confirmation dialogs
- **QuoteMessages** — Conversation thread between admin and customer
- **JsonViewSection** — Raw JSON data for debugging

**Sidebar** (right, max 400px):
- **Customer card** — Email (linked to `/customers/:id`), Phone, Spending limit
- **Company card** — Name (linked to `/companies/:id`)

### Quote Manage Modal (`/app/quotes/:quoteId/manage`)

**File**: `routes/quotes/[quoteId]/manage/page.tsx`

- Opens as a `RouteFocusModal` overlay on top of the quote detail page
- Contains `ManageQuoteForm` which provides inline order editing:
  - Add/remove line items
  - Update quantities and prices
  - Uses Medusa's order edit API (`sdk.admin.orderEdit.*`)
  - Items table with product thumbnails, variant info, quantity controls
  - Search and filter for adding new products

### Meilisearch Settings (`/app/settings/meilisearch`)

**File**: `routes/settings/meilisearch/page.tsx`

- **Nav config**: `defineRouteConfig({ label: "Meilisearch" })` — appears under Settings
- Simple single-button page: "Sync Data to Meilisearch"
- Triggers POST to `/admin/meilisearch/sync` via `useMutation`
- Shows success/error toast notifications
- Loading state on button while sync request is in flight

---

## Shared Components (`components/common/`)

### ActionMenu

Reusable dropdown menu (three-dot `⋯` button) for row-level actions. Accepts `groups` of `Action` objects, each with `icon`, `label`, and either `onClick` handler or `to` (React Router link). Supports disabled state and group separators.

### DeletePrompt

Confirmation dialog for destructive actions. Props: `handleDelete` callback, `loading` state, `open`/`setOpen` state controls.

### CoolSwitch

Custom styled toggle switch component.

### RouteFocusModal

Modal system for route-based overlays (e.g., the quote manage page). Includes:
- `RouteFocusModal` — Main modal wrapper
- `RouteModalProvider` / `RouteModalContext` — Modal state management
- `StackedFocusModal` / `StackedModalProvider` — Support for nested modals
- `RouteModalForm` — Form wrapper for modal content
- `useRouteModal` / `useStackedModal` — Hooks for programmatic control

### JsonViewSection

Collapsible section that renders raw JSON data, useful for debugging entity state in the admin panel.

### Thumbnail

Product thumbnail image component with fallback handling.

### Skeleton

Loading placeholder component for content-loading states.

---

## Utilities (`utils/`)

| Function | File | Description |
|----------|------|-------------|
| `formatAmount(amount, currency_code)` | `format-amount.ts` | Formats numbers as currency using `Intl.NumberFormat` (e.g., `€1,299.00`) |
| Currency symbol map | `currency-symbol-map.ts` | Lookup table for currency code → symbol mapping |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `admin/lib/client.ts` | SDK instance with session auth |
| `admin/lib/query-key-factory.ts` | Cache key generator |
| `admin/hooks/api/index.ts` | Re-exports all API hooks |
| `admin/hooks/use-data-table.tsx` | Table pagination + state management |
| `admin/components/common/index.ts` | Re-exports shared components |
| `admin/routes/companies/page.tsx` | Companies list page |
| `admin/routes/companies/[companyId]/page.tsx` | Company detail page |
| `admin/routes/quotes/page.tsx` | Quotes list page |
| `admin/routes/quotes/[quoteId]/page.tsx` | Quote detail page |
| `admin/routes/quotes/[quoteId]/manage/page.tsx` | Quote order edit modal |
| `admin/routes/settings/meilisearch/page.tsx` | Meilisearch sync settings |
