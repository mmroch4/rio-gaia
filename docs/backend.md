# Backend Guide

## Module System

Custom modules live in `backend/src/modules/<name>/` with this structure:

```
modules/<name>/
  index.ts              # Module registration (exports Module constant + loader)
  service.ts            # Business logic (extends MedusaService or custom class)
  models/               # MikroORM entity definitions
    index.ts            # Re-exports all models
    <entity>.ts         # Entity class with model.define()
  types/                # Module-specific types (optional, some modules use src/types/)
    common.ts           # DTO interfaces
    mutations.ts        # Create/Update/Delete DTOs
  migrations/           # Database migrations
    .snapshot-*.json    # MikroORM schema snapshot
    Migration*.ts       # Timestamped migrations
```

**Registering a module** in [medusa-config.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/medusa-config.ts):

```ts
// Standard module (Company, Quote)
modules: {
  [COMPANY_MODULE]: { resolve: "./modules/company" },
}

// Module provider (Email Notification — plugs into Medusa's notification system)
modules: {
  [Modules.NOTIFICATION]: {
    resolve: "@medusajs/medusa/notification",
    options: {
      providers: [{
        resolve: "./src/modules/email-notification",
        id: "email-notification",
        options: { channels: ["email"], smtp_host, smtp_port, ... },
      }],
    },
  },
}

// Service-only module with options (Meilisearch)
modules: {
  [MEILISEARCH_MODULE]: {
    resolve: "./modules/meilisearch",
    options: { host, apiKey, productIndexName },
  },
}
```

---

## Custom Modules (Detailed)

### Company Module (`src/modules/company/`)

Manages B2B company entities and their employees. Uses `MedusaService` which provides automatic CRUD methods out of the box.

**Registration**: `Module("company", { service: CompanyModuleService })` — constant exported as `COMPANY_MODULE = "company"`.

#### Company Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | `id (prefix: "comp")` | Primary key, e.g. `comp_01...` |
| `name` | `text` | Required |
| `email` | `text` | Required |
| `vat` | `text` | Required (NIF/VAT number) |
| `phone` | `text` | Nullable |
| `address` | `text` | Nullable |
| `city` | `text` | Nullable |
| `state` | `text` | Nullable |
| `zip` | `text` | Nullable |
| `country` | `text` | Nullable |
| `logo_url` | `text` | Nullable |
| `currency_code` | `text` | Nullable |
| `verified` | `boolean` | Default: `false`. Used by portal auth guard |
| `spending_limit_reset_frequency` | `enum` | `"never"`, `"daily"`, `"weekly"`, `"monthly"`, `"yearly"`. Default: `"monthly"` |
| `employees` | `hasMany(Employee)` | |

#### Employee Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | `id (prefix: "emp")` | Primary key, e.g. `emp_01...` |
| `spending_limit` | `bigNumber` | Default: `0` (no limit). Amount in currency units |
| `is_admin` | `boolean` | Default: `false`. Controls `company_admin` role in auth |
| `company` | `belongsTo(Company)` | Mapped by `employees` |

#### Service

```ts
class CompanyModuleService extends MedusaService({ Company, Employee }) {}
```

No custom methods — inherits full CRUD from `MedusaService`: `createCompanies`, `updateCompanies`, `deleteCompanies`, `createEmployees`, `updateEmployees`, `deleteEmployees`, `listCompanies`, `retrieveCompany`, etc.

#### Module Types (`src/modules/company/types/`)

- **`common.ts`** — `CompanyDTO` and `EmployeeDTO` interfaces with all fields
- **`mutations.ts`** — `CreateCompanyDTO`, `UpdateCompanyDTO`, `DeleteCompanyDTO`, `CreateEmployeeDTO` (requires `customer_id`), `UpdateEmployeeDTO`, `DeleteEmployeeDTO`

---

### Quote Module (`src/modules/quote/`)

Full request-for-quote lifecycle. Linked to draft orders for order-edit-based price/quantity modifications.

**Registration**: `Module("quote", { service: QuoteModuleService })` — constant exported as `QUOTE_MODULE = "quote"`.

#### Quote Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | `id (prefix: "quo")` | Primary key, e.g. `quo_01...` |
| `status` | `enum` | `"pending_merchant"` (default), `"pending_customer"`, `"accepted"`, `"customer_rejected"`, `"merchant_rejected"` |
| `customer_id` | `text` | Links to Medusa Customer |
| `draft_order_id` | `text` | Links to Medusa Order (draft) |
| `order_change_id` | `text` | Links to Medusa OrderChange |
| `cart_id` | `text` | Links to Medusa Cart |
| `messages` | `hasMany(Message)` | Conversation thread |

#### Message Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | `id (prefix: "mess")` | Primary key |
| `text` | `text` | Message content |
| `item_id` | `text` | Nullable — reference to specific line item |
| `admin_id` | `text` | Nullable — if sent by admin |
| `customer_id` | `text` | Nullable — if sent by customer |
| `quote` | `belongsTo(Quote)` | Mapped by `messages` |

#### Quote Status Lifecycle

```
  Customer submits RFQ
         │
         ▼
  ┌──────────────────┐
  │ pending_merchant  │ ← created via createRequestForQuoteWorkflow
  └────────┬─────────┘
           │ merchant modifies draft order (order edit)
           │ then sends to customer
           ▼
  ┌──────────────────┐         ┌────────────────────┐
  │ pending_customer  │────────▶│ merchant_rejected   │
  └────────┬─────────┘         └────────────────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
┌─────────┐  ┌───────────────────┐
│ accepted │  │ customer_rejected  │
└─────────┘  └───────────────────┘
     │
     ▼
  Draft order → real order (PENDING)
```

---

### Meilisearch Module (`src/modules/meilisearch/`)

Custom service wrapping the Meilisearch client for product search indexing. Not based on `MedusaService` — implements its own methods.

**Registration**: `Module("meilisearch", { service: MeilisearchModuleService })` — constant exported as `MEILISEARCH_MODULE = "meilisearch"`.

#### Constructor

Requires `host`, `apiKey`, `productIndexName` from options (validated — throws `MedusaError.INVALID_ARGUMENT` if missing). Creates a `Meilisearch` client instance.

#### Service Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `getIndexName(type)` | `type: "product"` | Resolves index name from options. Only `"product"` is supported |
| `indexData(data, type?)` | Array of record objects | Adds documents to index. Maps each to include `id` as primary key |
| `retrieveFromIndex(ids, type?)` | Array of document IDs | Fetches documents by ID, returns non-null results |
| `deleteFromIndex(ids, type?)` | Array of document IDs | Removes documents from index |
| `search(query, type?)` | Search query string | Full-text search on the index |

---

### Email Notification Module (`src/modules/email-notification/`)

SMTP email provider using Nodemailer and react-email templates. Extends `AbstractNotificationProviderService` — plugs into Medusa's notification system as a **module provider**, not a standalone module.

**Registration**: `ModuleProvider(Modules.NOTIFICATION, { services: [EmailNotificationProviderService] })`.

#### Configuration

Takes SMTP options: `smtp_host`, `smtp_port`, `smtp_user`, `smtp_pass`, `smtp_from`. Auto-detects encryption:
- Port 465 → implicit TLS/SSL (`secure: true`)
- Port 587/2525 → STARTTLS (`secure: false`)

#### `send()` Method

Handles notifications dispatched through Medusa's notification system:

1. Validates `channel === "email"` (warns and returns `"unsupported-channel"` otherwise)
2. Renders template by name:
   - `"password-reset"` → renders `PasswordResetEmail` component with `resetUrl` and `email`
   - Other templates → warns and returns `"unsupported-template"`
3. Sends via Nodemailer transporter
4. Logs message ID, supports Ethereal preview URLs in dev

#### Shared Email Infrastructure (`templates/shared/`)

All email templates use a shared layout and style system:

- **`email-styles.ts`** — Brand constants (`BRAND` object with colors, company info, font stack) and reusable inline `styles` object. Primary color: `#0047AB`.
- **`email-layout.tsx`** — `<EmailLayout preview="...">` wrapper with branded header (text-based, not image), content area, and company footer (legal name, address, contact). All templates should be wrapped in this layout.

To create a new template:
1. Create a `.tsx` file in `templates/`
2. Import `EmailLayout` and `styles` from `./shared/`
3. Wrap content in `<EmailLayout preview="inbox preview text">`
4. Add a case in `service.ts` `send()` switch block

#### Password Reset Template

React-email template (`templates/password-reset.tsx`) in Portuguese:
- Heading, personalized greeting, explanation text
- "Redefinir Palavra-passe" CTA button links to `resetUrl`
- 15min expiration notice
- Fallback URL text for non-clickable clients

#### Quote Email Templates

5 templates for the quote lifecycle + 1 admin notification template. All use `EmailLayout`.

| Template | Recipient | Trigger Event | Description |
|----------|-----------|---------------|-------------|
| `quote-requested` | Customer | `quote.requested` | Confirmation that RFQ was received |
| `quote-sent` | Customer | `quote.sent` | Quote ready with items table, pricing, totals |
| `quote-accepted` | Customer | `quote.accepted` | Order created confirmation with display ID |
| `quote-rejected` | Customer | `quote.merchant_rejected` | Quote declined notification |
| `quote-admin-notification` | Admin | `quote.requested`, `quote.accepted`, `quote.customer_rejected` | Generic admin notification with dynamic content based on event type |

#### Quote Notification Subscriber (`src/subscribers/quote-notifications.ts`)

Single subscriber handling all 5 quote events. Fetches quote with linked customer and draft order data, then dispatches to the appropriate email template(s). Email failures are caught per-notification and logged — they never roll back the quote workflow.

Events: `quote.requested`, `quote.sent`, `quote.accepted`, `quote.customer_rejected`, `quote.merchant_rejected`

#### Quote Reminder Job (`src/jobs/quote-reminders.ts`)

Scheduled job running daily at 9:00 AM. Finds quotes in `pending_customer` status updated more than 5 days ago and sends reminder emails.

---

## API Routes

Routes follow the pattern: `src/api/{scope}/{resource}/[params]/route.ts`

Each route group can include:
- `route.ts` — HTTP method handlers (GET, POST, DELETE)
- `validators.ts` — Zod schemas for request body/query validation
- `query-config.ts` — Allowed fields, defaults, and relation expansion for queries
- `middlewares.ts` — Route-level middleware (validation, auth, body transforms)

### Middleware Architecture

```
Global middleware (src/api/middlewares.ts)
  ├── adminMiddlewares (admin/middlewares.ts)
  │     ├── adminCompaniesMiddlewares
  │     └── adminQuotesMiddlewares
  ├── storeMiddlewares (store/middlewares.ts)
  │     ├── storeCartsMiddlewares
  │     ├── storeCompaniesMiddlewares
  │     ├── storeQuotesMiddlewares
  │     └── storeFreeShippingMiddlewares
  ├── vendorMiddlewares (vendor/middlewares.ts)
  │     ├── reset-password route
  │     └── update route
  └── Custom: /store/customers/me → req.allowed = ["employee"]
```

The custom global rule on `/store/customers/me` allows the `employee` relation to be included when fetching the current customer, enabling the storefront to access the customer's linked employee data.

### Admin Routes (`/admin/*`)

Admin routes are protected by Medusa's built-in admin session authentication (cookie-based via the admin panel).

#### Companies (`/admin/companies`)

| Method | Endpoint | Handler | Description |
|--------|----------|---------|-------------|
| GET | `/admin/companies` | List | Paginated list via `query.graph`. Supports field selection, filtering |
| POST | `/admin/companies` | Create | Accepts single company or array. Delegates to `createCompaniesWorkflow` |
| GET | `/admin/companies/:id` | Retrieve | Single company with `throwIfKeyNotFound` |
| POST | `/admin/companies/:id` | Update | Delegates to `updateCompaniesWorkflow` |
| DELETE | `/admin/companies/:id` | Delete | Delegates to `deleteCompaniesWorkflow`. Returns `{ id, object: "company", deleted: true }` |

#### Company Employees (`/admin/companies/:id/employees`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/companies/:id/employees` | List employees for a company (fetches via `company.employees.*`) |
| POST | `/admin/companies/:id/employees` | Create employee. Delegates to `createEmployeesWorkflow` with company_id from URL |

#### Company Customer Group (`/admin/companies/:id/customer-group`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/companies/:id/customer-group/:customerGroupId` | Get customer group link |
| POST | `/admin/companies/:id/customer-group/:customerGroupId` | Manage customer group link |

#### Admin Company Validators (Zod)

**Create** (required: `name`, `email`, `vat`, `currency_code`; optional: `phone`, `address`, `city`, `state`, `zip`, `country`, `logo_url`, `verified`)

**Update** (all fields optional)

**Employee Create** (required: `customer_id`; optional: `spending_limit`, `raw_spending_limit: { value, precision }`, `is_admin`)

**Employee Update** (optional: `id` required, `spending_limit`, `raw_spending_limit`, `is_admin`)

#### Admin Company Query Config

Default fields: `id`, `name`, `logo_url`, `email`, `vat`, `phone`, `address`, `city`, `state`, `zip`, `country`, `verified`, `currency_code`, `*employees`

#### Quotes (`/admin/quotes`)

| Method | Endpoint | Handler | Description |
|--------|----------|---------|-------------|
| GET | `/admin/quotes` | List | Paginated (default 15/page). Filterable by `id`, `draft_order_id`, `status`, `created_at`, `updated_at`. Supports `q` search |
| GET | `/admin/quotes/:id` | Retrieve | Single quote with all relations |
| POST | `/admin/quotes/:id/send` | Send to customer | Delegates to `merchantSendQuoteWorkflow`. Updates status to `pending_customer` |
| POST | `/admin/quotes/:id/reject` | Merchant reject | Delegates to `merchantRejectQuoteWorkflow` |
| POST | `/admin/quotes/:id/messages` | Add message | Body: `{ text, item_id? }`. Delegates to `createQuoteMessageWorkflow` with `admin_id` from auth |

#### Admin Quote Query Config

Extensive field list including nested relations: `*customer`, `*messages`, `*messages.admin`, `*messages.customer`, `cart.id`, and full `draft_order` details (currency, display_id, status, totals including tax/discount/shipping breakdowns, `*items`, `*items.variant`, `*items.variant.product`, `*items.detail`, `*items.tax_lines`, `*items.adjustments`, `*order_change.actions`).

#### Meilisearch (`/admin/meilisearch/sync`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/meilisearch/sync` | Emits `"meilisearch.sync"` event via event bus. Subscriber handles paginated batch indexing. Returns `{ message: "Syncing data to Meilisearch" }` immediately |

### Store Routes (`/store/*`)

Store routes require customer authentication via `authenticate("customer", ["session", "bearer"])`.

#### Companies (`/store/companies`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/store/companies` | Customer | Create company (same workflow as admin) |
| GET | `/store/companies/:id` | Customer | Retrieve company |
| POST | `/store/companies/:id` | Customer | Update company |
| DELETE | `/store/companies/:id` | Customer | Delete company (returns 204) |

#### Company Employees (`/store/companies/:id/employees`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/store/companies/:id/employees` | Customer | List company employees |
| POST | `/store/companies/:id/employees` | Customer + `company_admin` role | Create employee |
| POST | `/store/companies/:id/employees/:employee_id` | Customer + `company_admin` role | Update employee |

> [!IMPORTANT]
> Employee mutation routes (POST) use the `ensureRole("company_admin")` middleware, which checks `provider_identity.user_metadata.role` against `"company_admin"`. This prevents non-admin employees from creating or modifying employees.

#### Store Company Validators

Store creates additionally accept `spending_limit_reset_frequency` (enum, optional). Phone and address fields are `optional().nullable()` (more lenient than admin).

#### Quotes (`/store/quotes`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/quotes` | List customer's quotes (auto-filtered by `customer_id` from auth context) |
| POST | `/store/quotes` | Create RFQ. Body: `{ cart_id }`. Delegates to `createRequestForQuoteWorkflow` |
| GET | `/store/quotes/:id` | Retrieve single quote (scoped to own customer_id) |
| GET | `/store/quotes/:id/preview` | Preview with `orderModuleService.previewOrderChange()` — returns `order_preview` alongside quote data |
| POST | `/store/quotes/:id/accept` | Accept quote. Delegates to `customerAcceptQuoteWorkflow` |
| POST | `/store/quotes/:id/reject` | Reject quote. Delegates to `customerRejectQuoteWorkflow` |
| POST | `/store/quotes/:id/messages` | Add message. Body: `{ text, item_id? }`. Uses `customer_id` from auth |

#### Carts — Bulk Line Items (`/store/carts/:id/line-items/bulk`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/store/carts/:id/line-items/bulk` | Bulk add line items. Body: `{ line_items: [{ variant_id, quantity }] }`. Uses `addToCartWorkflow` from `@medusajs/core-flows` |

#### Free Shipping Prices (`/store/free-shipping/prices`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/free-shipping/prices?cart_id=...` | Returns free shipping price rules applicable to the cart |

**How it works**:
1. Fetches cart `currency_code` and `item_total`
2. Lists shipping options via `listShippingOptionsForCartWorkflow`
3. Filters for prices with `amount === 0`, matching currency, and `item_total` price rules
4. Computes progress using `computeShippingOptionTargets()`:
   - `target_amount` — threshold from price rule value
   - `current_amount` — cart's `item_total`
   - `target_reached` — boolean
   - `target_remaining` — amount left to qualify
   - `remaining_percentage` — progress percentage
   - Supports operators: `gt`, `gte`, `lt`, `lte`, `eq`

### Vendor Routes (`/vendor/*`)

Custom routes for auth operations, parameterized by `[actor_type]` and `[auth_provider]`.

| Method | Endpoint | Middleware | Description |
|--------|----------|-----------|-------------|
| POST | `/vendor/auth/:actor_type/:auth_provider/reset-password` | `validateScopeProviderAssociation` + body validation | Requests password reset. Uses `generateResetPasswordTokenWorkflow` with `throwOnError: false` to prevent user enumeration. Returns `{ success: true }` regardless |
| POST | `/vendor/auth/:actor_type/:auth_provider/update` | `validateScopeProviderAssociation` + `validateToken` | Updates auth provider (e.g., password change). Extracts `entity_id` from JWT token, calls `authService.updateProvider`. Returns `{ success: true }` or throws `UNAUTHORIZED` |

#### Vendor Middleware Utilities

- **`validateScopeProviderAssociation`** — Checks that the `actor_type`/`auth_provider` combination is allowed by `projectConfig.http.authMethodsPerActor`. If not configured, all providers are allowed for that actor type
- **`validateToken`** — Extracts JWT from `Authorization: Bearer` header, validates against `jwtSecret`, looks up `provider_identity` by `entity_id`, and populates `req.auth_context` with `actor_type`, `auth_identity_id`, `actor_id`, and `user_metadata`

#### Vendor Validators

```ts
ResetPasswordRequest = z.object({
  identifier: z.string(),                                   // email
  metadata: z.record(z.unknown()).optional().default({}),
}).strict()
```

### Custom Middleware — `ensureRole` (`src/api/middlewares/ensure-role.ts`)

Role-based access control middleware for store company routes. Used on employee creation/update endpoints:

1. Queries the company by `req.params.id` to check if it has employees
2. If no employees exist (empty company), allows access (first employee creation)
3. Otherwise, looks up `provider_identity` by `auth_identity_id` from auth context
4. Checks `user_metadata.role` against the required role (e.g., `"company_admin"`)
5. Returns 403 Forbidden if role doesn't match

---

## Workflows & Steps

All mutations go through workflows in `src/workflows/`. Workflows orchestrate steps with compensation (rollback) logic using MedusaJS's `createWorkflow` API.

```
workflows/<domain>/
  workflows/           # Workflow definitions (orchestration)
    create-*.ts
    update-*.ts
    delete-*.ts
    index.ts           # Re-exports all workflows
  steps/               # Individual steps (atomic operations)
    create-*.ts
    update-*.ts
    delete-*.ts
    index.ts           # Re-exports all steps
```

### Company Workflows (`src/workflows/company/`)

| Workflow | ID | Steps | Description |
|----------|-----|-------|-------------|
| `createCompaniesWorkflow` | `create-companies` | `createCompaniesStep` | Creates company records |
| `updateCompaniesWorkflow` | `update-companies` | `updateCompaniesStep` | Updates company fields |
| `deleteCompaniesWorkflow` | `delete-companies` | `deleteCompaniesStep` | Deletes company by ID. **TODO**: cascade delete users |
| `addCompanyToCustomerGroupWorkflow` | `add-company-to-customer-group` | `createRemoteLinkStep` + `addCompanyEmployeesToCustomerGroupStep` | Links company to customer group (for B2B pricing) and adds all existing employees to the group |
| `removeCompanyFromCustomerGroupWorkflow` | `remove-company-from-customer-group` | `removeCompanyEmployeesFromCustomerGroupStep` + `removeRemoteLinkStep` | Removes employees from group first, then removes the link |

### Employee Workflows (`src/workflows/employee/`)

| Workflow | ID | Steps | Description |
|----------|-----|-------|-------------|
| `createEmployeesWorkflow` | `create-employees` | `createEmployeesStep` → `createRemoteLinkStep` → *(conditional)* `setAdminRoleStep` → `addEmployeeToCustomerGroupStep` | Creates employee, links to customer, optionally sets `company_admin` role via `user_metadata`, adds employee to company's customer group |
| `updateEmployeesWorkflow` | `update-employees` | `updateEmployeesStep` → *(conditional)* `removeAdminRoleStep` | Updates employee. If `is_admin` set to `false`, removes the admin role from auth |
| `deleteEmployeesWorkflow` | `delete-employees` | `deleteEmployeesStep` | Deletes employee by ID(s) |

#### Employee Steps Detail

- **`setAdminRoleStep`** — Looks up the auth identity by email and sets `user_metadata.role = "company_admin"` on the provider identity
- **`removeAdminRoleStep`** — Removes the `company_admin` role from `user_metadata`
- **`addEmployeeToCustomerGroupStep`** — Queries the employee's company, finds its linked customer group, and adds the employee's customer to the group
- **`linkEmployeeToCustomerStep`** — Creates the remote link between employee and customer

### Quote Workflows (`src/workflows/quote/`)

| Workflow | ID | Description |
|----------|-----|-------------|
| `createRequestForQuoteWorkflow` | `create-request-for-quote` | **Main RFQ flow**: Fetches cart (with items, shipping, promotions) → Fetches customer → Creates draft order (`is_draft_order: true`, `DRAFT` status) → Begins order edit on draft → Creates quote record linking everything |
| `createQuotesWorkflow` | `create-quotes` | Simple step wrapper: `createQuotesStep` |
| `updateQuotesWorkflow` | `update-quotes` | Simple step wrapper: `updateQuotesStep` |
| `merchantSendQuoteWorkflow` | `merchant-send-quote-workflow` | Verifies quote exists → Updates status to `"pending_customer"` |
| `merchantRejectQuoteWorkflow` | `merchant-reject-quote-workflow` | Updates status to `"merchant_rejected"` |
| `customerAcceptQuoteWorkflow` | `customer-accept-quote-workflow` | `validateQuoteAcceptanceStep` → Updates status to `"accepted"` → `confirmOrderEditRequestWorkflow` (commits staged changes) → `updateOrderWorkflow` (converts draft to real order with `PENDING` status) |
| `customerRejectQuoteWorkflow` | `customer-reject-quote-workflow` | `validateQuoteRejectionStep` → Updates status to `"customer_rejected"` |
| `createQuoteMessageWorkflow` | `create-quote-message` | `createQuoteMessageStep` — creates a message attached to the quote |

#### Quote Validation Steps

- **`validateQuoteAcceptanceStep`** — Validates that the quote is in `"pending_customer"` status before allowing acceptance
- **`validateQuoteRejectionStep`** — Validates that the quote is in the correct status before allowing rejection

### Meilisearch Workflows (`src/workflows/meilisearch/`)

| Workflow | ID | Description |
|----------|-----|-------------|
| `syncProductsWorkflow` | `sync-products` | Queries products (id, title, description, handle, thumbnail, categories, tags, status) → Separates published from unpublished → `syncProductsStep` indexes published products → `deleteProductsFromMeilisearchStep` removes unpublished. Returns products and metadata |
| `deleteProductsFromMeilisearchWorkflow` | `delete-products-from-meilisearch` | `deleteProductsFromMeilisearchStep` — removes documents by ID array |

### Order Workflows (`src/workflows/order/`)

| Workflow | ID | Description |
|----------|-----|-------------|
| `updateOrderWorkflow` | `update-order` | `updateOrderStep` — updates order fields (used by quote acceptance to convert draft → real order) |

### Hook Workflows (`src/workflows/hooks/`)

MedusaJS hooks allow intercepting core commerce workflows at specific extension points.

#### `cart-created` Hook

```ts
createCartWorkflow.hooks.cartCreated(handler, compensation)
```

**Handler**: When a cart is created with `metadata.company_id`, creates a remote link between the company and cart modules.

**Compensation**: On failure/rollback, dismisses the remote link.

#### `order-created` Hook

```ts
createOrderWorkflow.hooks.orderCreated(handler, compensation)
```

**Handler**: When an order is created with `metadata.company_id`, creates a remote link between the order and company modules.

**Compensation**: Dismisses the remote link on rollback.

#### `validate-cart-completion` Hook

```ts
completeCartWorkflow.hooks.validate(handler)
```

**Handler**: Before checkout completion:
1. Fetches cart's `customer_id` and `total`
2. If the customer has an employee with a spending limit, calls `checkSpendingLimit()`
3. Throws `"Cart total exceeds spending limit"` if the limit would be exceeded

---

## Links (Entity Relationships)

Entity relationships defined in `src/links/` using MedusaJS's `defineLink` API. These create database-level join tables that enable cross-module queries.

| File | From | To | Type | How It's Used |
|------|------|----|------|---------------|
| [company-customer-group.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/links/company-customer-group.ts) | `company.company` | `customer.customerGroup` | `defineLink` (1:1) | B2B pricing — associating a company with a customer group for special pricing rules |
| [company-carts.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/links/company-carts.ts) | `company.company` | `cart.cart` (`isList: true`) | `defineLink` (1:many) | Tracking all carts belonging to a company. Created by `cart-created` hook |
| [order-company.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/links/order-company.ts) | `order.order` | `company.company` | `defineLink` (1:1) | Tracking which company placed an order. Created by `order-created` hook |
| [employee-customer.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/links/employee-customer.ts) | `company.employee` | `customer.customer` | `defineLink` (1:1) | Mapping employees to Medusa customer accounts. Created by `createEmployeesWorkflow` |
| [quote-links.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/links/quote-links.ts) | Quote module | Various | Read-only virtual links | Uses `MedusaModule.setCustomLink()` — not `defineLink` |

#### Quote Virtual Links (Read-Only)

The quote module defines 5 read-only relationships using `MedusaModule.setCustomLink()`. These don't create database join tables — they define virtual relationships by matching foreign key fields on the Quote model to entities in other modules:

| Foreign Key | Target Module | Target Entity | Alias |
|-------------|--------------|---------------|-------|
| `draft_order_id` | Order | `Order` | `draft_order` |
| `cart_id` | Cart | `Cart` | `cart` |
| `order_change_id` | Order | `OrderChange` | `order_change` |
| `admin_id` | User | `User` | `admin` |
| `customer_id` | Customer | `Customer` | `customer` |

These aliases are used in `query.graph()` calls to fetch related data across modules (e.g., `"*draft_order.items.variant.product"`).

---

## Subscribers

Event handlers in `src/subscribers/`. Each exports a default handler function and a `config` with the event name(s) to listen for.

| File | Event(s) | Action |
|------|----------|--------|
| [product-sync.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/subscribers/product-sync.ts) | `product.created`, `product.updated` | Runs `syncProductsWorkflow` with the product's ID as filter. Indexes or re-indexes the single product |
| [product-delete.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/subscribers/product-delete.ts) | `product.deleted` | Runs `deleteProductsFromMeilisearchWorkflow` with the product's ID. Removes from search index |
| [meilisearch-sync.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/subscribers/meilisearch-sync.ts) | `meilisearch.sync` | Full batch re-index: loops through all products in batches of 50 using `syncProductsWorkflow`, tracking offset/limit. Logs total indexed count |
| [password-reset.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/subscribers/password-reset.ts) | `auth.password_reset` | Receives `entity_id` (email), `token`, `actor_type`. Builds reset URL based on actor type and sends email via notification module |

#### Password Reset URL Routing

The subscriber generates different reset URLs depending on who requested the reset:

| Actor Type | URL Base | Full Path |
|------------|----------|-----------|
| `customer` | `{STOREFRONT_URL}` | `{storefrontUrl}/conta/redefinir-password?token=...&email=...` |
| `vendor` / `admin` | `{BACKEND_URL}{ADMIN_PATH}` | `{backendUrl}/app/redefinir-password?token=...&email=...` |

---

## Types

Type definitions in `src/types/` organized by domain:

```
types/
  index.ts             # Re-exports company/ and quote/
  company/
    index.ts           # Re-exports all company types
    http.ts            # HTTP request/response types (admin, store)
    module.ts          # Module-level types (ModuleCompany, ModuleEmployee, enums)
    query.ts           # Query result types with relations
    service.ts         # Service method types
  quote/
    index.ts           # Re-exports all quote types
    http.ts            # HTTP types for quotes
    module.ts          # ModuleQuote, ModuleQuoteMessage, enums
    query.ts           # QueryQuote with draft_order, cart, customer, messages
    service.ts         # Service method types
  shipping-options/
    index.ts           # Re-exports shipping types
    http.ts            # StoreFreeShippingPrice type
```

### Key Type Relationships

```ts
// Query types include cross-module relations
type QueryCompany = ModuleCompany & {
  employees: QueryEmployee[];
  carts: StoreCart[];
};

type QueryEmployee = ModuleEmployee & {
  company: QueryCompany;
  customer: CustomerDTO;
};

type QueryQuote = ModuleQuote & {
  draft_order: AdminOrder;
  cart: StoreCart;
  customer: AdminCustomer & { employee: QueryEmployee };
  messages: QueryQuoteMessage[];
};

type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean;
  target_remaining: number;
  remaining_percentage: number;
};
```

---

## Utilities (`src/utils/`)

### Spending Limit Check (`check-spending-limit.ts`)

Three exported functions for enforcing employee spending limits:

| Function | Description |
|----------|-------------|
| `getSpendWindow(company)` | Computes `{ start, end }` date range based on `spending_limit_reset_frequency`. `never`: epoch → now. `daily`: midnight today → now. `weekly`: Sunday start → now. `monthly`: first of month → now. `yearly`: Jan 1 → now |
| `getOrderTotalInSpendWindow(orders, window)` | Sums `order.total` for all orders with `created_at` within the spend window |
| `checkSpendingLimit(cart, customer)` | Returns `true` if the employee's spending limit would be exceeded. Returns `false` if no limit set (0 or missing). Formula: `spent + cart.total > spendingLimit` |

---

## Seed Script (`src/scripts/seed.ts`)

Run with `yarn seed`. Creates a complete development dataset — region, sales channel, fulfillment, shipping, API key, and products.

### Infrastructure Data

| Entity | Details |
|--------|---------|
| **Sales Channel** | "Default Sales Channel" (idempotent — skips if exists) |
| **Store** | Sets EUR as default currency, links default sales channel |
| **Region** | "Portugal" — EUR currency, country code `pt`, system default payment provider |
| **Tax Region** | Portugal (`pt`) |
| **Stock Location** | "Portugal Warehouse" — Lisbon, PT. Linked to `manual_manual` fulfillment provider |
| **Fulfillment Set** | "Portugal Warehouse delivery" — shipping type, service zone covering all of PT |
| **Shipping Options** | "Standard Shipping" (2-3 days) and "Express Shipping" (24h) — both €10/\$10 flat rate, store-enabled, non-return |
| **Shipping Profile** | "Default" profile |
| **API Key** | "Webshop" publishable key, linked to default sales channel |
| **Collection** | "Featured" (`handle: featured`) |
| **Categories** | Laptops, Accessories, Phones, Monitors (all active) |

### Seed Products

| Product | Category | Variants | Price Range (EUR) |
|---------|----------|----------|-------------------|
| 16" Ultra-Slim AI Laptop | Laptops | 256GB/Blue, 512GB/Red | €1,259–€1,299 |
| 1080p HD Pro Webcam | Accessories | Black, White | €59–€65 |
| 6.5" Ultra HD Smartphone | Phones | 256GB/Purple, 256GB/Red | €959–€999 |
| 34" QD-OLED Curved Monitor | Monitors | White, Black | €599 |
| Hi-Fi Gaming Headset | Accessories | Black, White | €149 |
| Wireless Keyboard | Accessories | Black, White | €99 |
| Wireless Mouse | Accessories | Black, White | €79 |
| Conference Speaker | Accessories | Black, White | €55–€79 |

All products are `PUBLISHED` status, `manage_inventory: false`, dual-priced (EUR + USD), assigned to default sales channel. The laptop, smartphone, monitor, and headset are also added to the "Featured" collection.

---

## Meilisearch End-to-End Flow

### Automatic Sync (Single Product)

```
product.created / product.updated (Medusa event)
       │
       ▼
  product-sync subscriber
       │
       ▼
  syncProductsWorkflow({ filters: { id: product.id } })
       │
       ├── Query product fields: id, title, description, handle,
       │   thumbnail, categories (id/name/handle), tags (id/value), status
       │
       ├── Published? → syncProductsStep → index in Meilisearch
       └── Unpublished? → deleteProductsFromMeilisearchStep → remove from index
```

### Automatic Delete

```
product.deleted (Medusa event)
       │
       ▼
  product-delete subscriber
       │
       ▼
  deleteProductsFromMeilisearchWorkflow({ ids: [product.id] })
       │
       ▼
  deleteProductsFromMeilisearchStep → removes document from index
```

### Manual Full Sync (Admin Trigger)

```
Admin clicks "Sync Data to Meilisearch" button (/app/settings/meilisearch)
       │
       ▼
  POST /admin/meilisearch/sync → emits "meilisearch.sync" event
       │
       ▼
  meilisearch-sync subscriber
       │
       ▼
  Loop: syncProductsWorkflow in batches of 50 (offset/limit pagination)
       │
       ├── Each batch: query products → separate published/unpublished
       ├── Index published products
       └── Remove unpublished products
       │
       ▼
  Logs total indexed count when complete
```

### Indexed Product Fields

`id`, `title`, `description`, `handle`, `thumbnail`, `categories` (id, name, handle), `tags` (id, value). The `status` field is queried but not indexed — it's used to decide whether to index or delete the product.

---

## Vendor Auth Flow

### Why Vendor Routes Exist

The vendor routes (`/vendor/auth/:actor_type/:auth_provider/*`) provide a **unified, actor-agnostic auth endpoint**. Instead of having separate password-reset and password-update routes for customers and admins, both actor types share the same route structure — the `actor_type` path parameter determines the behavior.

### Password Reset End-to-End Flow

```
1. User submits email on reset form
       │
       ▼
2. POST /vendor/auth/:actor_type/:auth_provider/reset-password
   Body: { identifier: "user@email.com" }
   Middleware: validateScopeProviderAssociation (checks actor/provider is allowed)
   Handler: generateResetPasswordTokenWorkflow (throwOnError: false — prevents user enumeration)
   Response: { success: true } (always, regardless of whether email exists)
       │
       ▼
3. MedusaJS emits "auth.password_reset" event with { entity_id, token, actor_type }
       │
       ▼
4. password-reset subscriber builds URL:
   • customer → {STOREFRONT_URL}/conta/redefinir-password?token=...&email=...
   • admin/vendor → {BACKEND_URL}/app/redefinir-password?token=...&email=...
       │
       ▼
5. Email sent via notification module → EmailNotificationProviderService.send()
   Template: "password-reset" → renders PasswordResetEmail react-email component
       │
       ▼
6. User clicks link → submits new password to:
   POST /vendor/auth/:actor_type/:auth_provider/update
   Middleware: validateToken (extracts entity_id from JWT)
   Handler: authService.updateProvider() → updates password
```

---

## Email Notification How-To

### Template Rendering Pipeline

```
1. Event triggers subscriber (e.g., auth.password_reset)
       │
       ▼
2. Subscriber calls notificationModuleService.createNotifications({
     to, channel: "email", template: "password-reset", data: { ... }
   })
       │
       ▼
3. Medusa routes to EmailNotificationProviderService.send()
       │
       ▼
4. send() matches template name → renders react-email component to HTML
       │
       ▼
5. Nodemailer transporter sends email via configured SMTP
```

### Supported Templates

| Template Name | Component | Subject | Data Fields |
|---------------|-----------|---------|-------------|
| `password-reset` | `PasswordResetEmail` | "Reset your password" | `reset_url`, `email` (from `to` field) |

### Adding a New Email Template

1. Create a react-email component in `src/modules/email-notification/templates/`:
   ```tsx
   // templates/order-confirmation.tsx
   import { Html, Head, Body, Text, Button } from "@react-email/components";
   export default function OrderConfirmationEmail({ orderId }: { orderId: string }) {
     return (<Html><Head /><Body><Text>Order #{orderId} confirmed</Text></Body></Html>);
   }
   ```

2. Add a case to the `switch` in `service.ts`:
   ```ts
   case "order-confirmation":
     html = await render(OrderConfirmationEmail({ orderId: notification.data.order_id }));
     subject = "Order Confirmed";
     break;
   ```

3. Trigger from a subscriber or workflow:
   ```ts
   await notificationModuleService.createNotifications({
     to: customer.email, channel: "email",
     template: "order-confirmation", data: { order_id: order.id },
   });
   ```

### Dev Behavior

When using [Ethereal](https://ethereal.email/) as the SMTP provider (common in development), the service logs a preview URL where you can view the rendered email in a browser — no real inbox required.

---

## Configuration (`medusa-config.ts`)

### Module Registration

| Module | Constant | Type | Resolution | Options |
|--------|----------|------|------------|---------|
| Company | `COMPANY_MODULE` | Standard | `./modules/company` | — |
| Quote | `QUOTE_MODULE` | Standard | `./modules/quote` | — |
| Cache | `Modules.CACHE` | Core override | `@medusajs/medusa/cache-inmemory` | — |
| Workflow Engine | `Modules.WORKFLOW_ENGINE` | Core override | `@medusajs/medusa/workflow-engine-inmemory` | — |
| Notification | `Modules.NOTIFICATION` | Module provider | `@medusajs/medusa/notification` | Email provider with SMTP config |
| Meilisearch | `MEILISEARCH_MODULE` | Standard | `./modules/meilisearch` | `host`, `apiKey`, `productIndexName` |

### Design Decisions

- **In-memory cache and workflow engine** — Simpler deployment (no Redis dependency for these modules). Suitable for single-instance deployments. For multi-instance production, switch to Redis-backed modules.
- **Admin path: `/app`** — Configured via `admin.path`. The admin panel's `backendUrl` and `storefrontUrl` are used by subscribers (e.g., password reset URL generation).
- **Email as module provider** — Uses Medusa's built-in notification routing (`Modules.NOTIFICATION`) rather than a standalone module, so `notificationModuleService.createNotifications()` automatically dispatches to the correct provider based on `channel`.

---

## Admin Dashboard (`src/admin/`)

Custom UI extensions for the Medusa admin panel at `/app`. Built with React, Medusa UI, TanStack React Query, and TanStack React Table. Includes company management, quote workflows with inline order editing, employee CRUD, and Meilisearch sync controls.

**See [Admin Dashboard Guide](admin-dashboard.md) for full documentation** — hooks, routes, components, data table system, and shared component library.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| [medusa-config.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/medusa-config.ts) | Module registration, CORS, DB, Redis, admin config |
| [compose.yml](file:///home/miguel/Desktop/jobs/riogaia/backend/compose.yml) | Docker services (PostgreSQL, Redis, Meilisearch) |
| [src/api/middlewares.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/api/middlewares.ts) | Global middleware aggregation |
| [src/api/middlewares/ensure-role.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/api/middlewares/ensure-role.ts) | Role-based access control for store routes |
| [src/modules/company/models/company.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/company/models/company.ts) | Company entity definition |
| [src/modules/company/models/employee.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/company/models/employee.ts) | Employee entity definition |
| [src/modules/quote/models/quote.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/quote/models/quote.ts) | Quote entity definition |
| [src/modules/quote/models/message.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/quote/models/message.ts) | Message entity definition |
| [src/modules/meilisearch/service.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/meilisearch/service.ts) | Search service implementation |
| [src/modules/email-notification/service.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/email-notification/service.ts) | Email provider implementation |
| [src/modules/email-notification/templates/shared/email-layout.tsx](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/email-notification/templates/shared/email-layout.tsx) | Shared email layout with branded header/footer |
| [src/modules/email-notification/templates/shared/email-styles.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/email-notification/templates/shared/email-styles.ts) | Brand constants and reusable inline styles |
| [src/modules/email-notification/templates/password-reset.tsx](file:///home/miguel/Desktop/jobs/riogaia/backend/src/modules/email-notification/templates/password-reset.tsx) | Password reset email template (Portuguese) |
| [src/utils/check-spending-limit.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/utils/check-spending-limit.ts) | Spending limit enforcement logic |
| [src/workflows/hooks/cart-created.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/workflows/hooks/cart-created.ts) | Company-cart linking hook |
| [src/workflows/hooks/order-created.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/workflows/hooks/order-created.ts) | Order-company linking hook |
| [src/workflows/hooks/validate-cart-completion.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/workflows/hooks/validate-cart-completion.ts) | Spending limit enforcement hook |
| [src/workflows/quote/workflows/create-request-for-quote.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/workflows/quote/workflows/create-request-for-quote.ts) | Main RFQ workflow |
| [src/workflows/quote/workflows/customer-accept-quote.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/workflows/quote/workflows/customer-accept-quote.ts) | Quote acceptance workflow |
| [src/types/index.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/types/index.ts) | Type system entry point |
| [src/scripts/seed.ts](file:///home/miguel/Desktop/jobs/riogaia/backend/src/scripts/seed.ts) | Database seed script |
