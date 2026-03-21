# PLAN.md — Rio Gaia B2B Platform: Revised Features & Fixes

> **Overview:** 11-task action plan for the Rio Gaia B2B platform, structured using a strict 5-Step Implementation Template. Revised from the original 7-task plan after multiple codebase audits that corrected inaccurate assumptions, added 5 new tasks (including a Next.js 16 upgrade), merged SEO with brand/i18n work, expanded security hardening beyond rate limiting, and cataloged known technical debt.

> **Documentation policy:** After completing each task, update the relevant `docs/` files and `CLAUDE.md` as specified in each task's "Section 6: Documentation Update". Record the completion in the [Completion Log](#completion-log) and update the task's Status field to `Done (YYYY-MM-DD)`.

---

## Changes from Previous Plan

| Original Task | What Changed | Why |
|---------------|-------------|-----|
| #1 Token Handling | Rewritten as "proactive validation + UX messaging" instead of "crash prevention". Dropped `authenticated-fetch.ts` wrapper. Reduced effort from 1-2 days to 1 day. | `.catch(() => null)` already prevents crashes in all data functions. Portal layout already redirects to login on `null` customer. No crashes actually occur. |
| #4 MedusaJS Upgrade | Target changed from "v2.13.4" to "latest stable v2.x". Moved to lowest priority. | v2.13.4 is unverified — may not exist. Actual target version should be determined at execution time via `npx @medusajs/cli@latest`. Highest risk task should run last. |
| #6 SEO Metadata | Merged with brand sweep (shares 5 files with "Medusa Store" metadata). | Efficiency — same files need editing for both brand and SEO fixes. |
| #7 Security | Toned down language. Focus narrowed to rate limiting as the critical gap. | Auth endpoints are not "naked" — password validation exists at `customer.ts:356-370`. Baseline error handling is in place. |
| NEW: Brand Sweep | Added as Task #1 (highest priority, quick win). | 10+ user-visible "Medusa Store" references, wrong footer contact info, "REPLACE_ME" social links, 13+ production console.logs. |
| NEW: Contact Form | Added as Task #6. | `setTimeout(1000)` stub deceives users into thinking messages are sent. |
| NEW: Cascade Delete | Added as Task #7. | Explicit `TODO: DELETE USERS FROM COMPANY` in `delete-companies.ts` — orphaned employee records on company deletion. |
| NEW: Next.js 16 Upgrade | Added as Task #11. Updated to keep `middleware.ts` (no `proxy.ts` rename) due to Medusa compatibility constraint. | Storefront runs Next.js 15.5.7 — 16.2.0 is latest. RC React types, dead deps (`webpack`, `@babel/core`, `babel-loader`), mismatched `eslint-config-next@15.0.1`. Next.js 16 breaking changes: `next lint` removed, sync Request APIs removed. Medusa explicitly does not support proxy approach. |
| NEW: Storefront Tests | Noted as future initiative, not in this plan cycle. | Zero storefront tests exist. Critical flows (signup, checkout, quote) completely untested. |
| #9 Security (expanded) | Renamed from "Security Hardening (Rate Limiting)" to "Security Hardening". Added 5 new steps: secret fail-fast, security headers, cookie httpOnly, Docker image pinning, conditional fetch logging. Effort increased from 2 to 3-4 days. Split into two execution phases. | Audit revealed hardcoded `"supersecret"` fallbacks in `medusa-config.ts`, zero security headers, non-httpOnly cookie, unpinned Docker images, and production fetch URL logging. |
| #1 Brand Sweep (fix) | Added missing `console.error` in `meilisearch/page.tsx:16` to Step 1.5. | Audit found 1 console statement not listed. |
| #11 Next.js Upgrade (expanded) | Added Prettier v3 upgrade, `packageManager` field, dead `pg` dependency removal, and Medusa test S3 remote pattern cleanup. | Audit found 4 dependency/config issues not covered by the original task. |
| NEW: Known Tech Debt | Added "Known Technical Debt" section cataloging ~10 uncovered TODOs. | Audit found scattered TODOs across the codebase not addressed by any task. |

---

## Table of Contents

1. [Brand Consistency Sweep + Console Cleanup](#1-brand-consistency-sweep--console-cleanup)
2. [Proactive Token Validation + Session UX](#2-proactive-token-validation--session-ux)
3. [Brand-Aligned Email Templates](#3-brand-aligned-email-templates)
4. [Quote Lifecycle Email Notifications](#4-quote-lifecycle-email-notifications)
5. [SEO Metadata + i18n Cleanup](#5-seo-metadata--i18n-cleanup)
6. [Contact Form Backend Integration](#6-contact-form-backend-integration)
7. [Company Cascade Delete Fix](#7-company-cascade-delete-fix)
8. [Enhanced Quote Request Form (Checkout-Like)](#8-enhanced-quote-request-form-checkout-like)
9. [Security Hardening](#9-security-hardening)
10. [MedusaJS Version Upgrade (v2.8.4 → Latest Stable v2.x)](#10-medusajs-version-upgrade-v284--latest-stable-v2x)
11. [Next.js Storefront Upgrade (15.5.7 → 16.2.0)](#11-nextjs-storefront-upgrade-1557--1620)

---

## 1. Brand Consistency Sweep + Console Cleanup
**Priority:** 1 (Highest — Quick Win) | **Est. Effort:** 1 Day | **Dependencies:** None | **Status:** Done (2026-03-19)

#### 1. Context & Objective
* **Problem**: The storefront contains 10+ user-visible "Medusa Store" and "Medusa B2B Starter" references inherited from the starter template. The client-area footer has incorrect placeholder contact info. Social links point to "REPLACE_ME". 13+ `console.log`/`console.error` statements leak debug data in production. One dead-code file (`password-strength.tsx`) is never imported.
* **Goal**: Replace all template branding with Rio Gaia identity, source contact details from the centralized `CONFIG` object, remove production console statements, and delete orphaned code.

#### 2. Architecture & Design
* **Current State**: Brand references are scattered across metadata exports, footer components, nav header, and side menu. Contact info in the client-area footer is hardcoded with placeholder values (`+351 210 000 000`, `b2b@riogaia.pt`, `Zona Industrial de Lisboa`) that don't match the real config (`+351 966 764 605`, `geral@riogaia.com`). Social links in `config/index.ts` are all `"REPLACE_ME"`.
* **Proposed Solution**: Centralize all branding through `CONFIG` from `storefront/src/config/index.ts`. Replace or remove Medusa references. Strip console statements. Delete unused file.

#### 3. Step-by-Step Implementation

**Step 1.1: Fix Navigation & Footer Branding**
* **Files:**
  - `storefront/src/modules/layout/templates/nav/index.tsx` — line 30: "Medusa B2B Starter" → "Rio Gaia"
  - `storefront/src/modules/layout/templates/footer/index.tsx` — line 27: "Medusa Store" → "Rio Gaia"; line 116: "Medusa" section header → Replace with "Sobre Nós" or remove Medusa links entirely; line 154: "Medusa Store" → "Rio Gaia"
  - `storefront/src/modules/layout/components/side-menu/index.tsx` — line 94: "Medusa Store. All rights reserved." → "Rio Gaia. Todos os direitos reservados."

**Step 1.2: Fix Metadata "Medusa Store" References**
* **Files:**
  - `storefront/src/app/[countryCode]/portal/produtos/[handle]/page.tsx` — line 65, 68: `| Medusa Store` → `| Rio Gaia`
  - `storefront/src/app/[countryCode]/portal/categorias/[...category]/page.tsx` — line 29: `| Medusa Store` → `| Rio Gaia`
  - `storefront/src/app/[countryCode]/portal/colecoes/[handle]/page.tsx` — line 64: `| Medusa Store` → `| Rio Gaia`
  - `storefront/src/app/[countryCode]/portal/conta/perfil/page.tsx` — line 10: English "View and edit your Medusa Store profile." → Portuguese "Consulte e edite o seu perfil Rio Gaia."
  - `storefront/src/app/[countryCode]/conta/entrar/page.tsx` — line 6: English "Log in to your Medusa Store account." → Portuguese "Inicie sessão na sua conta Rio Gaia."

**Step 1.3: Fix Client-Area Footer Contact Info**
* **File:** `storefront/src/modules/layout/components/client-area-footer/index.tsx`
* **Action:** Import `CONFIG` from `@/config`. Replace hardcoded values:
  - Line 61: `+351 210 000 000` → `CONFIG.company.phone`
  - Line 65: `b2b@riogaia.pt` → `CONFIG.company.email`
  - Line 69: `Zona Industrial de Lisboa` → `CONFIG.company.address`

**Step 1.4: Fix Social Links Config**
* **File:** `storefront/src/config/index.ts`
* **Action:** Either populate social links with real URLs (ask client) or remove the `socialLinks` object entirely and conditionally hide social icons in the footer when links are absent.

**Step 1.5: Remove Production Console Statements**
* **Files & lines to clean:**
  - `storefront/src/lib/data/customer.ts` — lines 119, 122 (`console.log`), 153-154 (`console.log`), 332, 389, 454 (`console.error`)
  - `storefront/src/lib/util/medusa-error.ts` — lines 6-9 (`console.error` with response data)
  - `backend/src/admin/components/common/skeleton/skeleton.tsx` — line 179 (`console.log({ filters })`)
  - `backend/src/admin/routes/companies/components/company-customer-group-drawer.tsx` — line 44 (`console.log(error)`)
  - `backend/src/admin/routes/settings/meilisearch/page.tsx` — line 16 (`console.error` in mutation error handler — toast already handles user notification)
* **Action:** Replace with proper error handling where needed (return error messages to UI). For the admin skeleton, remove the debug log entirely.

**Step 1.6: Delete Orphaned Code**
* **File:** `storefront/src/modules/common/components/password-strength.tsx`
* **Action:** Delete — never imported anywhere. The password strength indicator at `password-strength-indicator/` is the one actually in use.

**Step 1.7: Fix package.json Template Branding**
* **File:** `storefront/package.json`
* **Action:** Change `"description": "Medusa B2B Starter Storefront"` → `"description": "Rio Gaia B2B Ecommerce Storefront"`.

#### 4. QA & Acceptance Criteria
* [ ] Zero occurrences of "Medusa Store", "Medusa B2B Starter", or "Medusa" as user-visible text (grep verification).
* [ ] Client-area footer displays correct Rio Gaia phone, email, and address from `CONFIG`.
* [ ] Zero `console.log` or `console.error` in storefront `src/lib/` (grep verification).
* [ ] `password-strength.tsx` deleted and build succeeds without it.
* [ ] `storefront/package.json` description no longer contains "Medusa" (Step 1.7).

#### 5. Rollback Plan
* **Action:** All changes are simple text replacements — revert individual file commits. No schema or API changes involved.

#### 6. Documentation Update
* **`CLAUDE.md`** — Update if `CONFIG` pattern references change (e.g., new config keys used in footer).
* Minimal doc changes expected — mostly code-level replacements with no new architecture.

---

## 2. Proactive Token Validation + Session UX
**Priority:** 2 | **Est. Effort:** 1 Day | **Dependencies:** None | **Status:** Done (2026-03-19)

#### 1. Context & Objective
* **Problem**: When a JWT expires, `getAuthHeaders()` still returns the stale token. API calls fail with 401s caught by `.catch(() => null)`, so the portal layout sees `customer = null` and redirects to login — but the user gets no explanation of *why* they were redirected. The experience feels broken even though it technically works.
* **Goal**: Proactively detect expired tokens before making API calls. When a session expires, redirect with a clear message: "A sua sessão expirou. Inicie sessão novamente."

#### 2. Architecture & Design
* **Current State**: `getAuthHeaders()` in `cookies.ts` returns `{ Authorization: Bearer <token> }` without checking expiry. The existing `.catch(() => null)` pattern in all data functions already prevents crashes. Portal layout redirects to `/conta/entrar` when `customer` is `null`.
* **Proposed Solution**: Add JWT `exp` claim checking inside `getAuthHeaders()`. If expired, clear the cookie proactively and return `{}`. Add a `?session_expired=true` query param to the redirect so the login page can display an informative message.

#### 3. Step-by-Step Implementation

**Step 2.1: Token Expiry Check in Cookie Helper**
* **File:** `storefront/src/lib/data/cookies.ts`
* **Action:** In `getAuthHeaders()`, decode the JWT payload (base64 middle segment) inside a `try/catch`. If `exp < Date.now() / 1000 + 30` (30-second buffer), delete the `_medusa_jwt` cookie and return `{}`. Add a comment: "This decode is for UX routing only — authorization is validated server-side."

**Step 2.2: Session Expiry Redirect**
* **File:** `storefront/src/app/[countryCode]/portal/layout.tsx`
* **Action:** When `customer` is `null` and the JWT was cleared due to expiry (detectable via a cookie flag or absence), redirect to `/conta/entrar?session_expired=true` instead of plain `/conta/entrar`.

**Step 2.3: Login Page Session Message**
* **File:** `storefront/src/modules/account/templates/login-template.tsx`
* **Action:** Read `searchParams.session_expired`. If `true`, display a styled info banner: "A sua sessão expirou. Por favor, inicie sessão novamente."

#### 4. QA & Acceptance Criteria
* [ ] Manually set JWT `maxAge` to 30 seconds. After expiry, navigating to `/portal/conta` redirects to `/conta/entrar?session_expired=true`.
* [ ] Login page displays the expiry message banner.
* [ ] `_medusa_jwt` cookie is confirmed deleted upon redirect.
* [ ] No application crashes or unhandled exceptions during the flow.
* [ ] Normal login/logout flows are unaffected.

#### 5. Rollback Plan
* **Action:** Revert `getAuthHeaders()` to return the raw cookie value without expiry checking. Remove the `session_expired` query param handling from the login template.

#### 6. Documentation Update
* **`docs/storefront.md`** — Document JWT expiry check in the auth flow section (new proactive validation pattern in `cookies.ts`).
* **`docs/development.md`** — Note the JWT `maxAge` test technique for verifying session expiry behavior.

---

## 3. Brand-Aligned Email Templates
**Priority:** 3 | **Est. Effort:** 1-2 Days | **Dependencies:** None | **Status:** Done (2026-03-19)

#### 1. Context & Objective
* **Problem**: The sole existing email template (`password-reset.tsx`) uses generic styling (purple buttons, generic fonts) unaligned with the Rio Gaia visual identity.
* **Goal**: Create a reusable React-Email layout shell using Rio Gaia's color palette (`#0047AB` blue), Portuguese language defaults, and consistent typography. Refactor the existing password reset template to use it.

#### 2. Architecture & Design
* **Current State**: Hardcoded inline hex codes in `password-reset.tsx`. No shared email components.
* **Proposed Solution**: Centralize brand constants (colors, fonts) into `shared/email-styles.ts`. Build a standard `<EmailLayout>` wrapper with header, footer, and brand styling. Refactor existing template.

#### 3. Step-by-Step Implementation

**Step 3.1: Shared Infrastructure**
* **Files:**
  - `[NEW] backend/src/modules/email-notification/templates/shared/email-layout.tsx`
  - `[NEW] backend/src/modules/email-notification/templates/shared/email-styles.ts`
* **Action:** Build a responsive HTML email shell with Rio Gaia logo, brand blue `#0047AB` button styling, Portuguese footer text, and web-safe font fallbacks: `"GeistSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"`. Include dark mode `@media (prefers-color-scheme: dark)` overrides.

**Step 3.2: Refactor Existing Template**
* **File:** `backend/src/modules/email-notification/templates/password-reset.tsx`
* **Action:** Strip legacy inline styles. Import and wrap content in `<EmailLayout>`. Translate subject line from English "Reset your password" to Portuguese "Redefinir a sua palavra-passe". Update the switch case in `service.ts` (line 80) accordingly.

#### 4. QA & Acceptance Criteria
* [ ] All emails use `#0047AB` as the primary interactive element color.
* [ ] Header/footer renders cleanly across Gmail, Apple Mail, and Outlook (test with email preview tools).
* [ ] Password reset email triggers with the rebranded template.

#### 5. Rollback Plan
* **Action:** Restore `password-reset.tsx` to its previous snapshot if HTML rendering issues occur in specific email clients.

#### 6. Documentation Update
* **`docs/backend.md`** — Add shared email layout (`EmailLayout`) to the email-notification module section.
* **`docs/architecture.md`** — Note the email layout component in the module table (new shared infrastructure).

---

## 4. Quote Lifecycle Email Notifications
**Priority:** 4 | **Est. Effort:** 2-3 Days | **Dependencies:** #3 (Email Templates) | **Status:** Done

#### 1. Context & Objective
* **Problem**: No email notifications during the B2B quote lifecycle. Users and merchants are unaware of status changes (new request, merchant sends quote, acceptance, rejection).
* **Goal**: Emit events from quote workflows and dispatch styled emails to the appropriate parties at each lifecycle stage.

#### 2. Architecture & Design
* **Current State**: Workflows update quote status in the database but don't trigger notifications. Only the password reset email template exists.
* **Proposed Solution**: Add custom event emission at the end of each quote workflow. Build a subscriber to dispatch SMTP emails. Create templates for each lifecycle stage.

#### 3. Step-by-Step Implementation

**Step 4.1: Reusable Notification Emission Step**
* **File:** `[NEW] backend/src/workflows/quote/steps/emit-quote-notification.ts`
* **Action:** Create a reusable workflow step that emits events via `eventBusService.emit()` with a strict payload interface:
  ```typescript
  export interface QuoteEventPayload {
    quote_id: string;
    actor_role: "admin" | "customer";
    transitioned_to: string;
    triggered_at: number;
  }
  ```

**Step 4.2: Workflow Event Injections**
* **Files:**
  - `backend/src/workflows/quote/workflows/create-request-for-quote.ts`
  - `backend/src/workflows/quote/workflows/merchant-send-quote.ts`
  - `backend/src/workflows/quote/workflows/customer-accept-quote.ts`
  - `backend/src/workflows/quote/workflows/customer-reject-quote.ts`
  - `backend/src/workflows/quote/workflows/merchant-reject-quote.ts`
* **Action:** Append the notification emission step to the end of each workflow.

**Step 4.3: Quote Notification Subscriber**
* **File:** `[NEW] backend/src/subscribers/quote-notifications.ts`
* **Action:** Build subscriber listening to custom events (`quote.requested`, `quote.sent`, `quote.customer_accepted`, `quote.customer_rejected`, `quote.merchant_rejected`). Query quote relations. Call `notificationModuleService.createNotifications()`.
* **Edge Case:** Wrap `createNotifications()` in `try/catch`. On SMTP failure, log the error but allow the subscriber to resolve successfully — email failures must never roll back the quote transaction.

**Step 4.4: Email Templates**
* **Files:** `[NEW] backend/src/modules/email-notification/templates/quote-*.tsx` (5 templates)
* **Action:** Build React-Email templates for each lifecycle event using the shared `<EmailLayout>` from Task #3. Update `email-notification/service.ts` switch statement (around line 72) to map template strings to components.

**Step 4.5: Quote Reminders (Cron Job)**
* **File:** `[NEW] backend/src/jobs/quote-reminders.ts`
* **Action:** Use Medusa Scheduled Jobs to scan for quotes in `pending_customer` status > 5 days. Emit `quote.reminder_customer` handled by the subscriber.

#### 4. QA & Acceptance Criteria
* [ ] Customer and admin receive relevant emails during Request, Send, Accept, and Reject flows.
* [ ] Emails contain correct Quote IDs, Order Display IDs, and portal links.
* [ ] SMTP failure does **not** roll back the quote database transaction.
* [ ] Scheduled job fires reminders for stale quotes after 5 days.

#### 5. Rollback Plan
* **Action:** Remove the `emit-quote-notification.ts` step from workflows to decouple email from core domain. Disable the cron job.

#### 6. Documentation Update
* **`docs/backend.md`** — Document the new quote notification subscriber and emitted events; add the cron job to the workflows section.
* **`docs/api-reference.md`** — Document quote event payloads (`quote.requested`, `quote.sent`, etc.).

---

## 5. SEO Metadata + i18n Cleanup
**Priority:** 5 | **Est. Effort:** 1-2 Days | **Dependencies:** #1 (Brand Sweep must be done first so metadata references are clean) | **Status:** Done (2026-03-20)

#### 1. Context & Objective
* **Problem**: No `robots.ts` or `sitemap.ts`. Portal routes are exposed to search bots. Root layout has minimal metadata. Several pages still have English metadata descriptions after the brand sweep.
* **Goal**: Block private routes from indexing, generate a dynamic sitemap for public catalog pages, and apply consistent Portuguese-language OpenGraph metadata.

#### 2. Architecture & Design
* **Current State**: Only a sparse `metadataBase` in `<RootLayout>`. No structured SEO scaffolding.
* **Proposed Solution**: Add `robots.ts` and `sitemap.ts` per Next.js App Router conventions. Add `noindex, nofollow` to portal layout. Set up metadata template with Portuguese locale.

#### 3. Step-by-Step Implementation

**Step 5.1: Traffic Guardrails**
* **Files:**
  - `[NEW] storefront/src/app/robots.ts`
  - `[MODIFY] storefront/src/app/[countryCode]/portal/layout.tsx`
* **Action:** Create `robots()` function blocking `/portal/`, `/conta/`, `/api/`. Add `noindex, nofollow` to the portal layout metadata export.

**Step 5.2: Global Metadata Template**
* **File:** `storefront/src/app/layout.tsx`
* **Action:** Apply `{ title: { template: "%s | Rio Gaia", default: "Rio Gaia — Cerâmica Personalizada para Turismo" }, openGraph: { locale: "pt_PT" } }`. Add `alternates.canonical` configuration that strips URL search query params to prevent faceted navigation duplication.

**Step 5.3: Dynamic Sitemap**
* **File:** `[NEW] storefront/src/app/sitemap.ts`
* **Action:** Dynamically fetch product catalog to build XML sitemap of public `/produtos/*` slugs, marketing pages (`/sobre`, `/contacto`, `/casos-de-sucesso`), and collection/category pages. Exclude `/portal/` and `/conta/` paths.

**Step 5.4: Structured Data (Optional Enhancement)**
* **Files:** Product detail pages
* **Action:** Inject `<script type="application/ld+json">` with Schema.org `Product` nodes: `name`, `image`, `description`, `brand: { @type: 'Brand', name: 'Rio Gaia' }`, `offers: { priceCurrency: 'EUR' }`.

#### 4. QA & Acceptance Criteria
* [ ] `/robots.txt` resolves with active Disallow rules on `/portal/` and `/conta/`.
* [ ] `/sitemap.xml` resolves with only public catalog links.
* [ ] View-source on `/portal/conta` contains `<meta name="robots" content="noindex, nofollow" />`.
* [ ] Lighthouse SEO audit scores > 90.

#### 5. Rollback Plan
* **Action:** Delete `robots.ts` and `sitemap.ts` to restore default Next.js crawling behavior. Remove layout metadata overrides.

#### 6. Documentation Update
* **`docs/storefront.md`** — Document `robots.ts`, `sitemap.ts`, and the metadata template pattern.
* **`CLAUDE.md`** — Add `robots.ts`/`sitemap.ts` to the project structure section under `storefront/src/app/`.

---

## 6. Contact Form Backend Integration
**Priority:** 6 | **Est. Effort:** 2 Days | **Dependencies:** #3 (Email Templates for styled notification) | **Status:** Done

#### 1. Context & Objective
* **Problem**: The contact form at `/contacto` uses `setTimeout(1000)` as a stub — it shows "Mensagem enviada com sucesso!" without actually sending anything. Users believe their message was delivered.
* **Goal**: Wire the form to a real backend endpoint that sends an email notification to the Rio Gaia team and a confirmation to the sender.

#### 2. Architecture & Design
* **Current State**: `storefront/src/modules/contact/components/contact-form.tsx` has a `TODO: Implement actual form submission` with a fake 1-second delay. No backend route exists.
* **Proposed Solution**: Create a Medusa Store API route `POST /store/contact` with Zod validation. On submission, use the email notification module to send two emails: one to the Rio Gaia team with the message details, and one confirmation to the sender. Update the storefront form to call the new endpoint via a server action.

#### 3. Step-by-Step Implementation

**Step 6.1: Backend API Route**
* **Files:**
  - `[NEW] backend/src/api/store/contact/route.ts`
  - `[NEW] backend/src/api/store/contact/validators.ts`
  - `[MODIFY] backend/src/api/store/middlewares.ts` — register validation middleware
* **Action:** Create `POST /store/contact` accepting `{ name, email, phone, message }`. Validate with Zod (email format, max lengths, required fields). Sanitize free-text `message` field to prevent stored XSS.

**Step 6.2: Email Templates**
* **Files:**
  - `[NEW] backend/src/modules/email-notification/templates/contact-form-received.tsx` — internal notification to Rio Gaia team
  - `[NEW] backend/src/modules/email-notification/templates/contact-form-confirmation.tsx` — sender confirmation
* **Action:** Use the shared `<EmailLayout>` from Task #3. Add template cases to the service switch statement.

**Step 6.3: Storefront Integration**
* **File:** `storefront/src/modules/contact/components/contact-form.tsx`
* **Action:** Replace the `setTimeout` stub with a server action or direct fetch to `POST /store/contact`. Handle success/error states from the real API response.

#### 4. QA & Acceptance Criteria
* [ ] Submitting the contact form sends an email to the configured `SMTP_FROM` address with the message details.
* [ ] The sender receives a confirmation email.
* [ ] Invalid inputs (missing name, bad email format) return 400 with Portuguese error messages.
* [ ] XSS payloads in the message field are sanitized.

#### 5. Rollback Plan
* **Action:** Revert the contact form to the stub implementation. Remove the backend route. No schema changes to roll back.

#### 6. Documentation Update
* **`docs/api-reference.md`** — Add `POST /store/contact` endpoint documentation (request schema, response codes).
* **`docs/backend.md`** — Document the new contact route and email templates.

---

## 7. Company Cascade Delete Fix
**Priority:** 7 | **Est. Effort:** 0.5 Days | **Dependencies:** None | **Status:** Done

#### 1. Context & Objective
* **Problem**: `delete-companies.ts` has an explicit `// TODO: DELETE USERS FROM COMPANY` comment. When a company is deleted, its employee records are orphaned in the database — they remain associated with a non-existent company.
* **Goal**: Ensure that deleting a company also cleans up associated employees and their customer-group memberships.

#### 2. Architecture & Design
* **Current State**: `deleteCompaniesWorkflow` calls `deleteCompaniesStep` and returns — employees are left orphaned.
* **Proposed Solution**: Add steps to the workflow that query employees by company ID, remove them from the company customer group, and delete the employee records before deleting the company.

#### 3. Step-by-Step Implementation

**Step 7.1: Add Cleanup Steps**
* **File:** `backend/src/workflows/company/workflows/delete-companies.ts`
* **Action:** Before `deleteCompaniesStep`:
  1. Query all employees belonging to the company.
  2. Remove their associated customers from the company's customer group (using the company-customer_group link).
  3. Delete the employee records.
  4. Then proceed with company deletion.
* **Compensation:** Add compensation functions to each step so that if the workflow fails partway through, the partial deletions are rolled back.

#### 4. QA & Acceptance Criteria
* [ ] Deleting a company in the admin dashboard also removes all associated employees.
* [ ] Customer records are removed from the company's customer group.
* [ ] No orphaned employee records remain after deletion (verify via database query).
* [ ] Workflow rollback correctly restores employees if the company deletion step fails.

#### 5. Rollback Plan
* **Action:** Revert the workflow to its previous single-step implementation. The TODO comment was the prior state.

#### 6. Documentation Update
* **`docs/backend.md`** — Update the `delete-companies` workflow description to reflect the new cascade behavior (employee cleanup + customer group removal).

---

## 8. Enhanced Quote Request Form (Checkout-Like)
**Priority:** 8 | **Est. Effort:** 3-4 Days | **Dependencies:** #4 (Quote Emails — for notification of enriched quote data) | **Status:** Not Started

#### 1. Context & Objective
* **Problem**: Customers can only submit `{ cart_id }` when requesting a quote. No ability to specify delivery address, payment preferences, or internal notes.
* **Goal**: Expand the quote data model, API schema, and present a multi-step checkout-like form in the storefront.

#### 2. Architecture & Design
* **Current State**: `createQuote` in `storefront/src/lib/data/quotes.ts` posts only `{ cart_id }`. The Quote model is lean.
* **Proposed Solution**: Add nullable address/payment/notes fields to the Quote schema. Generate a migration. Build a multi-step storefront form reusing existing checkout components.

#### 3. Step-by-Step Implementation

**Step 8.1: Backend Schema & Types**
* **Files:** `backend/src/modules/quote/models/quote.ts`, module types
* **Action:** Add nullable strings for `delivery_address`, `billing_address`, `payment_method`, `custom_details`. Generate and run migration: `npx medusa db:generate quote` → `db:migrate`. Update query-config default fields.

**Step 8.2: Backend Validation**
* **Files:** `backend/src/api/store/quotes/validators.ts`, `create-request-for-quote.ts`
* **Action:** Expand the `CreateQuote` Zod schema to accept the new fields. Sanitize free-text `custom_details` to prevent stored XSS.

**Step 8.3: Storefront Form**
* **File:** `[NEW] storefront/src/modules/quotes/components/request-quote-form/index.tsx`
* **Action:** Build a multi-step form reusing existing checkout address components. Use `react-hook-form` with Zod resolver for frontend validation matching the backend schema.

**Step 8.4: Quote Details Display**
* **File:** `storefront/src/app/[countryCode]/portal/conta/orcamentos/detalhes/[id]/page.tsx`
* **Action:** Display the new metadata fields (delivery address, payment method, notes) in the quote detail view.

#### 4. QA & Acceptance Criteria
* [ ] Form renders with Delivery Address, Billing Address, Payment Method, and Custom Notes fields.
* [ ] Frontend validation matches backend Zod rules exactly.
* [ ] Submitted data persists and is visible in both admin dashboard and customer portal.
* [ ] Users can select existing profile addresses.

#### 5. Rollback Plan
* **Action:** Revert to the `{ cart_id }` prompt. Leave migrated columns in the database (do not run down-migrations to avoid data loss) but remove them from API retrieval layers.

#### 6. Documentation Update
* **`docs/api-reference.md`** — Update quote creation schema with new fields (`delivery_address`, `billing_address`, `payment_method`, `custom_details`).
* **`docs/backend.md`** — Note the new migration for quote schema changes.
* **`docs/storefront.md`** — Document the new multi-step quote request form component.

---

## 9. Security Hardening
**Priority:** 9 | **Est. Effort:** 3-4 Days | **Dependencies:** Steps 9.1-9.5 have no dependencies; Steps 9.6-9.7 depend on #6 (Contact Form) | **Status:** Phase 1 Done (2026-03-19); Step 9.6 Done (2026-03-21); Step 9.7 Not Started

> [!IMPORTANT]
> **Phased execution:** Steps 9.1-9.5 (secrets, headers, cookies, Docker, logging) are critical and execute at **Priority 1.5** — immediately after the brand sweep and before any staging/production deployment. Steps 9.6-9.7 (rate limiting, CAPTCHA) execute at **Priority 9** after Task #6 creates the contact endpoint.

#### 1. Context & Objective
* **Problem**: Multiple security gaps beyond rate limiting:
  - `medusa-config.ts` lines 15-16 and 55 use `|| "supersecret"` as fallback values for `JWT_SECRET`, `COOKIE_SECRET`, and `AUTH_CORS` — the server starts silently with hardcoded secrets if env vars are missing
  - Zero HTTP security headers on the storefront (no `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `HSTS`, etc.)
  - `_medusa_cache_id` cookie in `middleware.ts` line 104 is set without `httpOnly`, `secure`, or `sameSite` flags
  - Docker Compose uses unpinned `postgres` and `redis` images (no version tags) with hardcoded passwords
  - `next.config.js` has `logging.fetches.fullUrl: true` unconditionally, leaking internal fetch URLs in production logs
  - Public API endpoints lack rate limiting (auth, quotes, contact form)
* **Goal**: Eliminate hardcoded secrets, add HTTP security headers, harden cookies and Docker config, conditionalize debug logging, and implement rate limiting.

#### 2. Architecture & Design
* **Current State**: Auth and password validation are in place (`customer.ts:356-370`). The gaps are infrastructure-level: config defaults, HTTP headers, cookie flags, and request throttling.
* **Proposed Solution**: Layered approach — fail-fast config validation, Next.js security headers, cookie hardening, Docker best practices, conditional logging, and Redis-backed rate limiting.

#### 3. Step-by-Step Implementation

**Step 9.1: Eliminate Hardcoded Secret Fallbacks**
* **Files:**
  - `backend/medusa-config.ts` — lines 15-16, 55
  - `backend/.env.template` — lines 5-6
* **Action:** Replace `|| "supersecret"` with fail-fast pattern:
  ```typescript
  const JWT_SECRET = process.env.JWT_SECRET ?? (() => { throw new Error("JWT_SECRET is required") })()
  const COOKIE_SECRET = process.env.COOKIE_SECRET ?? (() => { throw new Error("COOKIE_SECRET is required") })()
  ```
  Update `.env.template` to include prominent warnings that these values must be changed.

**Step 9.2: Add Security Headers**
* **File:** `storefront/next.config.js`
* **Action:** Add a `headers()` function returning security headers for all routes:
  ```javascript
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
      ],
    }]
  }
  ```
  **Note:** CSP (Content-Security-Policy) is deferred until Stripe/PayPal embed requirements are fully audited to avoid breaking payment flows.

**Step 9.3: Harden Cache Cookie**
* **File:** `storefront/src/middleware.ts`
* **Action:** Update the `_medusa_cache_id` cookie (line 104) to include security flags:
  ```typescript
  response.cookies.set("_medusa_cache_id", cacheId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
  ```

**Step 9.4: Docker Compose Hardening**
* **File:** `compose.yml`
* **Action:**
  1. Pin image versions: `postgres:16-alpine`, `redis:7-alpine`
  2. Parameterize passwords via environment variables with dev-only defaults:
     ```yaml
     # ⚠️ WARNING: Change these values in production!
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-dev_password_change_me}
     ```
  3. Add a comment block at the top warning that defaults are for development only.

**Step 9.5: Conditionalize Fetch URL Logging**
* **File:** `storefront/next.config.js`
* **Action:** Make `logging.fetches.fullUrl` conditional on development mode:
  ```javascript
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
  ```

**Step 9.6: Rate Limiting Middleware**
* **Files:**
  - `[NEW] backend/src/api/middlewares/rate-limiter.ts`
  - `[MODIFY] backend/package.json` — add `express-rate-limit`, `rate-limit-redis`
  - `[MODIFY] backend/src/api/middlewares.ts` — register rate limiters
* **Action:** Create configurable rate limiters:
  - Auth endpoints (`/auth/customer/*`): 10 requests per 15 minutes per IP
  - Quote creation (`POST /store/quotes`): 5 requests per hour per IP
  - Contact form (`POST /store/contact`): 3 requests per hour per IP

**Step 9.7: Turnstile / reCAPTCHA (Optional)**
* **Action:** If rate limits prove insufficient against distributed bots, embed Cloudflare Turnstile in storefront login, register, and contact forms. Validate tokens backend-side.

#### 4. QA & Acceptance Criteria
* [ ] Server refuses to start when `JWT_SECRET` or `COOKIE_SECRET` env vars are missing (Step 9.1).
* [ ] `curl -I https://storefront.example.com` returns `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and other security headers (Step 9.2).
* [ ] `_medusa_cache_id` cookie has `HttpOnly`, `SameSite=Lax`, and `Secure` flags in production (Step 9.3).
* [ ] `docker compose config` shows pinned image versions and parameterized passwords (Step 9.4).
* [ ] Production build logs do not contain internal fetch URLs (Step 9.5).
* [ ] Rapid bursts (20+ requests/minute) against `POST /store/quotes` trigger `429 Too Many Requests` (Step 9.6).
* [ ] Normal user flows remain uninterrupted (Steps 9.3, 9.6).
* [ ] Rate limit headers (`X-RateLimit-Remaining`, `Retry-After`) are present in responses (Step 9.6).

#### 5. Rollback Plan
* **Steps 9.1-9.5:** Each step is independently revertible via single-file git revert. No schema or API changes involved.
* **Steps 9.6-9.7:** Remove the rate limiter middleware registration from `middlewares.ts`. The middleware file can remain but becomes inactive.

#### 6. Documentation Update
* **`docs/development.md`** — Update env var requirements (document fail-fast secrets pattern — `JWT_SECRET` and `COOKIE_SECRET` are now mandatory).
* **`CLAUDE.md`** — Update the Environment Variables section to note that `JWT_SECRET` and `COOKIE_SECRET` no longer have fallback defaults.
* **`docs/architecture.md`** — Add security notes (HTTP headers, cookie hardening, rate limiting infrastructure).

---

## 10. MedusaJS Version Upgrade (v2.8.4 → Latest Stable v2.x)
**Priority:** 10 (Lowest — Highest Risk) | **Est. Effort:** 3-5 Days | **Dependencies:** Run on a pristine branch after all other tasks. | **Status:** Done

#### 1. Context & Objective
* **Problem**: The backend runs MedusaJS v2.8.4, several minor versions behind the latest stable release. Continued divergence risks missing security patches and new features.
* **Goal**: Safely align all backend and frontend SDK dependencies to the latest stable v2.x while maintaining all custom B2B modules and workflows.

#### 2. Architecture & Design
* **Current State**: All `@medusajs/*` packages locked to `2.8.4`.
* **Proposed Solution**: Determine the actual latest stable version via `npx @medusajs/cli@latest`. Use incremental minor-bump strategy to isolate breaking changes. Run on an isolated branch.

#### 3. Step-by-Step Implementation

**Step 10.1: Preparation**
* **Action:** Back up database: `pg_dump -Fc riogaia_db > backup_v2.8.4.dump`. Create isolated branch `feature/medusa-upgrade`.

**Step 10.2: Incremental Upgrades**
* **Action:** For each minor version:
  1. `npx @medusajs/cli@latest upgrade`
  2. `npx medusa db:migrate`
  3. `npx medusa develop` — verify startup
  4. Fix TypeScript compilation errors
* **Action:** After final upgrade, run `npx medusa admin bundle` to verify custom admin components build against the new UI library.

**Step 10.3: Storefront SDK Alignment**
* **File:** `storefront/package.json`
* **Action:** Upgrade `@medusajs/js-sdk`, `@medusajs/ui`, `@medusajs/icons` to matching versions. Audit `yarn.lock` in both workspaces for mismatched transitive dependencies.

#### 4. QA & Acceptance Criteria
* [ ] Backend starts with zero TypeScript compilation errors.
* [ ] Admin panel at `/app` loads and custom B2B widget extensions work.
* [ ] All custom modules (company, quote, meilisearch, email-notification) function correctly.
* [ ] Storefront builds and connects to the upgraded backend.

#### 5. Rollback Plan
* **Action:** Abort the branch merge. Restore database from backup: `pg_restore -d riogaia_db backup_v2.8.4.dump -c -C`. Check out `main` to restore v2.8.4 packages.

#### 6. Documentation Update
* **`CLAUDE.md`** — Update MedusaJS version number throughout (replace `v2.8.4` with the new version).
* **`docs/development.md`** — Update version references.
* **All `docs/` files** — Search and replace any `v2.8.4` mentions with the new version.

---

## 11. Next.js Storefront Upgrade (15.5.7 → 16.2.0)
**Priority:** 11 | **Est. Effort:** 3-4 Days | **Dependencies:** Run on an isolated branch. Independent of MedusaJS upgrade (#10). | **Status:** Not Started

#### 1. Context & Objective
* **Problem**: The storefront runs Next.js 15.5.7 while 16.2.0 is the latest stable release. Beyond the framework version gap, several auxiliary dependencies are incorrect or outdated:
  - `eslint-config-next@15.0.1` is 5+ minor versions behind the Next.js runtime
  - `@types/react` and `@types/react-dom` are pinned to **release candidate** versions (`19.0.0-rc.1`) via both `devDependencies` and `resolutions` — not stable
  - `@types/node@17.0.21` is from 2022 — severely outdated for Node.js 22
  - Dead dependencies ship in the bundle: `webpack` (in dependencies, unused), `@babel/core` and `babel-loader` (in devDependencies, no Babel config exists)
  - `typescript.ignoreBuildErrors: true` in `next.config.js` hides real TypeScript errors
  - `prettier@^2.8.8` is 2 major versions behind (Prettier 3.x has been stable since mid-2023)
  - No `packageManager` field in `storefront/package.json` — backend has `"packageManager": "yarn@4.4.0"` but storefront omits it despite `.yarnrc.yml` referencing `yarn-4.12.0.cjs`
  - `images.remotePatterns` references 3 Medusa demo/testing S3 buckets (`medusa-public-images`, `medusa-server-testing`) that are not Rio Gaia's production image sources
  - `pg@^8.11.3` and `@types/pg@^8.11.0` are present in storefront dependencies but never imported in storefront source — dead dependencies
* **Goal**: Upgrade to Next.js 16.2.0, adapt to all breaking changes, clean up dead dependencies and RC type hacks, and modernize the ESLint configuration.

#### 2. Architecture & Design
* **Current State**: The codebase is in good shape for the upgrade — it already uses modern App Router patterns exclusively (no `pages/`), all `cookies()` calls are async, and all `params`/`searchParams` access uses `await props.params`. Only 1 file has a stale type annotation (`portal/produtos/[handle]/page.tsx` line 12).
* **Breaking changes requiring code modifications**:
  1. ~~`middleware.ts` → `proxy.ts` rename~~ — **SKIPPED: Medusa does not support the proxy approach** (see [Medusa Cloud docs](https://docs.medusajs.com/cloud/storefront#supported-storefront-frameworks): _"v16 is also supported if you're not using a proxy"_). `middleware.ts` is kept as-is.
  2. `next lint` command removed — must migrate to ESLint CLI with flat config
  3. `scroll-behavior: smooth` no longer overridden during SPA navigation — need `data-scroll-behavior="smooth"` on `<html>`
  4. `images.dangerouslyAllowLocalIP` needed for localhost dev image optimization
  5. 1 params type annotation needs `Promise<>` wrapper
* **What stays unchanged**: React 19.1.0 (already compatible), Tailwind CSS v3 (separate concern), `@medusajs/ui` (peer deps satisfied), Geist font package, all server actions, all data fetching patterns.

#### 3. Step-by-Step Implementation

**Step 11.0: Preparation**
* **Action:** Create isolated branch: `feature/nextjs-16-upgrade`. Record current `yarn build` output for regression comparison.

**Step 11.1: Upgrade Core Dependencies**
* **File:** `storefront/package.json`
* **Action:** Update dependencies:
  ```
  dependencies:
    "next": "^16.2.0"               (was "^15.3.6")

  devDependencies:
    "eslint": "^10.0.0"             (was "^8.57.0")
    "eslint-config-next": "16.2.0"  (was "15.0.1")
    "@types/react": "^19.2.0"       (was "npm:types-react@19.0.0-rc.1")
    "@types/react-dom": "^19.2.0"   (was "npm:types-react-dom@19.0.0-rc.1")
    "@types/node": "^22.0.0"        (was "17.0.21")
  ```

**Step 11.2: Clean Up Dead Dependencies & Type Hacks**
* **File:** `storefront/package.json`
* **Action:**
  1. Remove the `resolutions` block entirely (forced RC React types globally):
     ```json
     "resolutions": {
       "webpack": "^5",
       "@types/react": "npm:types-react@19.0.0-rc.1",
       "@types/react-dom": "npm:types-react-dom@19.0.0-rc.1"
     }
     ```
  2. Remove the `overrides` block (the `react-markdown` `@types/react` override is no longer needed with stable types):
     ```json
     "overrides": {
       "react-markdown": {
         "@types/react": "$@types/react"
       }
     }
     ```
  3. Remove dead dependencies:
     - `"webpack": "^5"` from `dependencies` — never imported, no webpack config
     - `"@babel/core": "^7.17.5"` from `devDependencies` — no Babel config
     - `"babel-loader": "^8.2.3"` from `devDependencies` — no Babel config
  4. Run `yarn install` to regenerate `yarn.lock`.

**Step 11.2a: Upgrade Prettier to v3**
* **File:** `storefront/package.json`
* **Action:**
  1. Update `"prettier": "^2.8.8"` → `"prettier": "^3.5.0"`
  2. Run `npx prettier --write .` to reformat (Prettier 3 changes trailing comma defaults)
  3. Verify lint still passes

**Step 11.2b: Add packageManager Field and Remove Dead pg Dependency**
* **File:** `storefront/package.json`
* **Action:**
  1. Add `"packageManager": "yarn@4.12.0"` (matching `.yarnrc.yml`)
  2. Remove `"pg": "^8.11.3"` from dependencies
  3. Remove `"@types/pg": "^8.11.0"` from devDependencies

**Step 11.2c: Clean Up Medusa Test Remote Patterns**
* **File:** `storefront/next.config.js`
* **Action:**
  1. Remove the 3 Medusa S3 test/demo entries from `images.remotePatterns`:
     - `medusa-public-images.s3.eu-west-1.amazonaws.com`
     - `medusa-server-testing.s3.amazonaws.com`
     - `medusa-server-testing.s3.us-east-1.amazonaws.com`
  2. Replace with Rio Gaia's actual production image CDN domain(s) once known. Keep `localhost` and `github.com`.

**Step 11.3: Verify middleware.ts Compatibility (DO NOT Rename)**
* **File:** `storefront/src/middleware.ts` — **keep as-is**
* **Medusa Constraint:** Official Medusa documentation states: _"Next.js v15. v16 is also supported if you're not using a proxy."_ The `proxy.ts` convention introduced in Next.js 16 is explicitly unsupported by Medusa. The storefront's middleware handles region detection, country code routing, and Medusa cache/cart cookie management — all critical Medusa integration points.
* **Action:**
  1. Do NOT rename `middleware.ts` to `proxy.ts`
  2. Do NOT rename the exported `middleware()` function to `proxy()`
  3. Verify that Next.js 16 still supports `middleware.ts` as a fallback (it does — `proxy.ts` is additive, not a forced migration)
  4. Test that region detection, country routing, and cart cookie handling still work after the Next.js 16 upgrade

**Step 11.4: ESLint Migration (v8 Legacy → v10 Flat Config)**
* **Action:** Run the official codemod first: `npx @next/codemod@canary next-lint-to-eslint-cli .`
* If the codemod doesn't fully handle it:
  1. Delete `storefront/.eslintrc.js`
  2. Create `storefront/eslint.config.mjs`:
     ```javascript
     import { FlatCompat } from "@eslint/eslintrc"

     const compat = new FlatCompat({
       baseDirectory: import.meta.dirname,
     })

     const eslintConfig = [
       ...compat.extends("next/core-web-vitals"),
     ]

     export default eslintConfig
     ```
  3. Update `package.json` lint script:
     ```json
     "lint": "eslint src/"
     ```

**Step 11.5: Fix scroll-behavior Override**
* **File:** `storefront/src/app/layout.tsx`
* **Action:** Add `data-scroll-behavior="smooth"` to `<html>` to preserve the previous behavior where Next.js overrides smooth scrolling during route transitions:
  ```tsx
  // Before (line 15):
  <html lang="pt" data-mode="light" className={GeistSans.variable}>
  // After:
  <html lang="pt" data-mode="light" data-scroll-behavior="smooth" className={GeistSans.variable}>
  ```

**Step 11.6: Fix params Type Annotation**
* **File:** `storefront/src/app/[countryCode]/portal/produtos/[handle]/page.tsx`
* **Action:** Wrap `params` in `Promise<>`:
  ```typescript
  // Before (line 11-13):
  type Props = {
    params: { countryCode: string; handle: string }
  }
  // After:
  type Props = {
    params: Promise<{ countryCode: string; handle: string }>
  }
  ```
  Function bodies already `await props.params` — no logic changes needed.

**Step 11.7: Update next.config.js**
* **File:** `storefront/next.config.js`
* **Action:** Add `images.dangerouslyAllowLocalIP: true` for localhost dev image optimization (blocked by default in Next.js 16):
  ```javascript
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [ /* existing patterns */ ],
  },
  ```

**Step 11.8: Address typescript.ignoreBuildErrors (Sub-task)**
* **File:** `storefront/next.config.js`
* **Action:**
  1. Temporarily remove `typescript: { ignoreBuildErrors: true }`
  2. Run `npx tsc --noEmit` to surface all errors
  3. If error count is manageable (< 20), fix them all. Expected sources:
     - Type changes from `@types/node` v17 → v22
     - Type changes from RC React types → stable React types
  4. If error count is large (> 20), keep `ignoreBuildErrors: true` and document the count as tech debt.

**Step 11.9: Verify and Test**
* Run `yarn install` → `yarn dev` → `yarn build` → `yarn lint`
* Manual testing critical paths:
  1. **Middleware**: Navigate to `/` — should redirect to `/pt/...`
  2. **Server Actions**: Add/update/remove cart items
  3. **Cache Revalidation**: Cart operations trigger `revalidateTag()` correctly
  4. **Image Rendering**: Product thumbnails load on catalog and detail pages
  5. **Metadata**: Check `<title>` on product pages, category pages
  6. **Auth Flow**: Login, logout, session expiry
  7. **generateStaticParams**: Build generates static product/category pages

#### 4. QA & Acceptance Criteria
* [ ] `yarn dev` starts without errors on `http://localhost:8000`
* [ ] `yarn build` completes successfully
* [ ] `yarn lint` runs with the new ESLint flat config
* [ ] Middleware redirects `/` to `/pt/` and sets `_medusa_cache_id` cookie
* [ ] Product catalog renders with correct images
* [ ] Cart add/update/remove works via server actions
* [ ] Login/logout flow works end-to-end
* [ ] `yarn.lock` contains no `types-react@19.0.0-rc.1` references
* [ ] `package.json` has no `resolutions` or `overrides` blocks
* [ ] `package.json` has no `webpack`, `@babel/core`, or `babel-loader`
* [ ] `storefront/src/middleware.ts` still exists and exports `middleware()` function (NOT renamed to `proxy.ts` — Medusa compatibility requirement)
* [ ] No `.eslintrc.js` exists (replaced by `eslint.config.mjs`)
* [ ] `<html>` tag includes `data-scroll-behavior="smooth"`
* [ ] `prettier --check .` passes with Prettier v3
* [ ] `storefront/package.json` includes `"packageManager": "yarn@4.12.0"`
* [ ] `storefront/package.json` has no `pg` or `@types/pg` entries
* [ ] `next.config.js` `images.remotePatterns` contains no `medusa-public-images` or `medusa-server-testing` hostnames

#### 5. Rollback Plan
* **Action:** This runs on an isolated branch (`feature/nextjs-16-upgrade`). If regressions occur:
  1. Abandon the branch — `main` is unaffected
  2. If already merged: `git revert -m 1 <merge-sha>`
  3. No database, schema, or backend changes — rollback is purely frontend
* **Partial rollback**: If only ESLint migration causes issues, keep `.eslintrc.js` + `eslint@8` and pin `eslint-config-next@15.5.13` (latest v15 supports ESLint 8)

#### 6. Documentation Update
* **`CLAUDE.md`** — Update Next.js version, project structure (ESLint config: `.eslintrc.js` → `eslint.config.mjs`).
* **`docs/storefront.md`** — Update config section with new Next.js version and ESLint flat config.
* **`docs/development.md`** — Update lint command from `next lint` to `eslint src/`.

---

## Implementation Order

> [!IMPORTANT]
> Execution order minimizes risk, front-loads quick wins, and respects dependency chains.

| Priority | Task | Depends On | Risk | Effort | Status |
|----------|------|------------|------|--------|--------|
| 1 | **Brand Consistency Sweep + Console Cleanup** (#1) | None | Low | 1 day | Done |
| 1.5 | **Security Hardening — Phase 1** (#9, steps 9.1-9.5) | None | Medium | 1.5-2 days | Done |
| 2 | **Proactive Token Validation + Session UX** (#2) | None | Low | 1 day | Done |
| 3 | **Brand-Aligned Email Templates** (#3) | None | Low | 1-2 days | Done |
| 4 | **Quote Lifecycle Email Notifications** (#4) | #3 | Medium | 2-3 days | Done |
| 5 | **SEO Metadata + i18n Cleanup** (#5) | #1 | Low | 1-2 days | Done |
| 6 | **Contact Form Backend Integration** (#6) | #3 | Low | 2 days | Done |
| 7 | **Company Cascade Delete Fix** (#7) | None | Low | 0.5 days | Done |
| 8 | **Enhanced Quote Request Form** (#8) | #4 | Medium | 3-4 days | Not Started |
| 9 | **Security Hardening — Phase 2** (#9, steps 9.6-9.7) | #6 | Medium | 1.5-2 days | Step 9.6 Done (2026-03-21) |
| 10 | **Next.js Storefront Upgrade** (#11) | None (isolated branch) | **High** | 3-4 days | Not Started |
| 11 | **MedusaJS Version Upgrade** (#10) | All others | **High** | 3-5 days | Done |

**Total estimated effort: 21.5-29 days**

> [!NOTE]
> **Future initiative (not in this cycle):** Storefront Test Suite — Zero storefront tests exist today. Critical flows (signup, checkout, quote request) are completely untested. This should be addressed in a future plan cycle.

---

## Completion Log

> Record of completed tasks with dates, commit/PR references, and any deviations from the original plan.

| Date | Task | Commit/PR | Deviations | Docs Updated |
|------|------|-----------|------------|--------------|
| 2026-03-19 | #1 Brand Sweep | — | Social links removed entirely (user chose removal over placeholders). Also removed MedusaCTA "Powered by" badge and replaced Medusa links section with "Sobre Nós" internal links. | `docs/storefront.md`, `PLAN.md` |
| 2026-03-19 | #9 Security Hardening — Phase 1 | — | Steps 9.1 (secret fail-fast) and 9.5 (conditional logging) were already implemented from prior work. Steps 9.2 (headers), 9.3 (cookie), 9.4 (Docker) applied as planned. Redis `ALLOW_EMPTY_PASSWORD` removed entirely instead of parameterizing. | `docs/development.md`, `PLAN.md` |
| 2026-03-19 | #2 Token Validation + Session UX | — | Implemented as planned. Portal layout always sends `?session_expired=true` (simplified approach — no distinction between "expired" and "never logged in"). | `docs/storefront.md`, `PLAN.md` |
| 2026-03-19 | #3 Brand-Aligned Email Templates | — | Implemented as planned. Created shared `email-styles.ts` + `email-layout.tsx`, refactored password-reset to Portuguese with `#0047AB` branding. Cleaned up excessive SMTP logging in service. No dark mode overrides (deferred). | `docs/backend.md`, `PLAN.md` |
| 2026-03-20 | #4 Quote Lifecycle Email Notifications | — | **Blocked.** All code implemented (5 workflows with `emitEventStep`, subscriber, 6 templates, cron job) but subscriber cannot fetch linked entities due to `query.graph()` bug in Medusa v2.8.4 — throws `Cannot read properties of undefined (reading 'kind')` inside subscriber handlers. Same API works in route handlers. Unblock after Task #10 (Medusa upgrade). | `docs/backend.md`, `PLAN.md` |
| 2026-03-20 | #5 SEO Metadata + i18n Cleanup | — | Implemented as planned. Skipped Step 5.4 (structured data) — product pages are behind auth (noindex), no SEO value. Sitemap is fully static (no Medusa API calls). Used em-dash (`—`) instead of hyphen for case study subtitles. Translated 3 English metadata strings to Portuguese (catalog title/description, category fallback, collection description). | `docs/storefront.md`, `CLAUDE.md`, `PLAN.md` |
| 2026-03-21 | #6 Contact Form Backend | — | Implemented as planned. `POST /store/contact` with Zod validation, two email templates (admin notification + sender confirmation), storefront `setTimeout` stub replaced with server action. | `PLAN.md` |
| 2026-03-21 | #7 Company Cascade Delete | — | Implemented as planned. Workflow now runs 4 cascade steps: remove from customer group → soft-delete customer accounts → soft-delete employees → soft-delete company. Compensation on all steps. TODO comment removed. | `PLAN.md` |
| 2026-03-21 | #10 MedusaJS Upgrade | — | Upgraded from v2.8.4 → v2.13.4. All `@medusajs/*` packages aligned across backend and storefront. Migrations run. | `CLAUDE.md`, `PLAN.md` |
| 2026-03-21 | #4 Quote Lifecycle Emails (unblocked) | — | Previously blocked by `query.graph()` bug in v2.8.4. All code was already implemented (6 templates, subscriber, cron job). Workflows pass enriched payloads in events, sidestepping the subscriber query issue. Unblocked by Task #10 upgrade. | `PLAN.md` |
| 2026-03-21 | #9 Security Hardening — Phase 2 (Step 9.6) | — | Rate limiting via `express-rate-limit` with in-memory store. Auth: 10 req/15min (login, register, reset-password share one limiter). Quotes: 5 req/hour. Contact: 3 req/hour. Skipped `rate-limit-redis` — in-memory sufficient for single-instance B2B. Step 9.7 (CAPTCHA) deferred. | `docs/backend.md`, `docs/api-reference.md`, `docs/architecture.md`, `CLAUDE.md`, `PLAN.md` |

---

## Known Technical Debt

> Items identified during audit that are not addressed by any task in this cycle. Cataloged for future reference.

| Location | Issue | Severity |
|----------|-------|----------|
| `storefront/src/modules/checkout/components/payment-button/index.tsx` | `TODO: Add this once gift cards are implemented` | Low |
| `storefront/src/lib/data/cart.ts` | `TODO: Pass a POJO instead of a form entity here` | Low |
| `storefront/src/modules/products/components/product-preview/price.tsx` | `TODO: Price needs to access price list type` | Low |
| `storefront/src/modules/products/components/thumbnail/index.tsx` | `TODO: Fix image typings` | Low |
| `storefront/src/lib/util/get-product-price.ts` | `TODO: Remove this util and use the AdminPrice type directly` | Low |
| `backend/src/api/store/companies/[id]/employees/[employeeId]/route.ts` | `TODO: fix this` (×2) — query.graph fields lack type safety | Medium |
| `backend/src/admin/components/common/table/data-table/data-table-root.tsx` | `TODO` — sticky header for admin table | Low |
| `backend/src/admin/routes/companies/components/company-form.tsx` | `TODO: Add logo upload` | Low |
| Backend React 18 vs Storefront React 19 | Backend devDependencies use `react@^18.2.0` for admin extensions; storefront uses `react@^19.1.0`. Expected for MedusaJS v2.13.4 admin SDK. | Info |
| `backend/src/subscribers/quote-notifications.ts` | `query.graph()` had issues in v2.8.4 subscriber handlers. Upgraded to v2.13.4 (Task #10). Workflows now pass enriched payloads in events, sidestepping subscriber query limitations. Verify subscriber behavior is fully operational in v2.13.4. | Medium |

> [!NOTE]
> The `delete-companies.ts` TODO is addressed by Task #7. The `contact-form.tsx` TODO is addressed by Task #6. The `package.json` description branding was moved to Task #1, Step 1.7.
