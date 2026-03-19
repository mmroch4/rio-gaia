# API Reference

Base URL: `http://localhost:9000`

## Authentication

- **Admin routes** (`/admin/*`): Requires admin session (cookie-based via Medusa admin)
- **Store routes** (`/store/*`): Most require customer authentication via `session` or `bearer` token
- **Vendor routes** (`/vendor/*`): Token-based with scope/provider validation

## Admin Endpoints

### Companies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/companies` | List companies (paginated, filterable) |
| POST | `/admin/companies` | Create company (or multiple) |
| GET | `/admin/companies/:id` | Retrieve company |
| POST | `/admin/companies/:id` | Update company |
| GET | `/admin/companies/:id/employees` | List company employees |
| POST | `/admin/companies/:id/employees` | Create employee |
| GET | `/admin/companies/:id/employees/:employeeId` | Retrieve employee |
| POST | `/admin/companies/:id/employees/:employeeId` | Update employee |
| GET | `/admin/companies/:id/customer-group/:customerGroupId` | Get customer group link |
| POST | `/admin/companies/:id/customer-group/:customerGroupId` | Manage customer group link |

### Quotes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/quotes` | List all quotes |
| POST | `/admin/quotes` | Create quote |
| GET | `/admin/quotes/:id` | Retrieve quote |
| POST | `/admin/quotes/:id` | Update quote |
| POST | `/admin/quotes/:id/send` | Send quote to customer |
| POST | `/admin/quotes/:id/reject` | Reject quote |
| GET | `/admin/quotes/:id/messages` | List quote messages |
| POST | `/admin/quotes/:id/messages` | Add message to quote |

### Meilisearch

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/meilisearch/sync` | Trigger full product index sync |

## Store Endpoints

### Companies (requires auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/store/companies` | Create company |
| GET | `/store/companies/:id` | Get company details |
| GET | `/store/companies/:id/employees` | List employees |
| POST | `/store/companies/:id/employees` | Create employee |

### Quotes (requires auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/quotes` | List customer's quotes |
| POST | `/store/quotes` | Create request for quote (RFQ) |
| GET | `/store/quotes/:id` | Retrieve quote |
| GET | `/store/quotes/:id/preview` | Preview quote |
| POST | `/store/quotes/:id/accept` | Accept quote (creates order) |
| POST | `/store/quotes/:id/reject` | Reject quote |
| GET | `/store/quotes/:id/messages` | List messages |
| POST | `/store/quotes/:id/messages` | Add message |

### Carts

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/store/carts/:id/line-items/bulk` | Bulk add/update line items |

### Free Shipping

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/store/free-shipping/prices` | Get free shipping price rules |

## Vendor Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vendor/auth/:actor_type/:auth_provider/reset-password` | Request password reset |
| POST | `/vendor/auth/:actor_type/:auth_provider/update` | Update auth provider info |

**Actor types**: `customer`, `vendor`, `admin`
**Auth providers**: `emailpass` (and others configured in Medusa)

## Request Patterns

### Query Parameters (GET requests)

List endpoints support:
- `fields` - Comma-separated field selection
- `limit` - Page size (default varies by endpoint)
- `offset` - Pagination offset
- `order` - Sort field and direction
- `q` - Search query (where supported)

### Response Format

All responses follow MedusaJS conventions:

```json
// List response
{
  "companies": [...],
  "count": 42,
  "offset": 0,
  "limit": 20
}

// Single resource
{
  "company": { "id": "comp_01...", "name": "..." }
}
```

### Error Format

```json
{
  "type": "not_found",
  "message": "Company with id comp_01... was not found"
}
```

## Validation

All request bodies are validated with Zod schemas. Invalid requests return 400 with validation errors. Validators are defined in `validators.ts` files alongside each route group.
