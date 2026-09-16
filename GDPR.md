# GDPR Compliance Audit — Rio Gaia

> **Last updated:** 2026-04-18
> **Applicable regulation:** RGPD (EU 2016/679) + Portuguese Law 58/2019
> **Supervisory authority:** CNPD (Comissão Nacional de Proteção de Dados)
> **Responsible person:** _(to be designated — see [Responsible Person](#responsible-person))_

---

## What's Already in Place

| # | Item | Status | Location |
|---|------|--------|----------|
| 1 | Privacy Policy page (`/politica-privacidade`) | Done | `storefront/src/app/[countryCode]/politica-privacidade/page.tsx` |
| 2 | Terms & Conditions page (`/termos-e-condicoes`) | Done | `storefront/src/app/[countryCode]/termos-e-condicoes/page.tsx` |
| 3 | Cookie consent banner | Partial | `storefront/src/modules/common/components/CookieConsent.tsx` |
| 4 | Terms acceptance checkbox on registration | Done | `storefront/src/modules/account/components/register/index.tsx` |
| 5 | Terms + privacy policy reference at checkout | Partial | `storefront/src/modules/checkout/components/review/index.tsx` |
| 6 | Essential-only cookies (`httpOnly`, `secure`, `sameSite`) | Done | `storefront/src/lib/data/cookies.ts` |
| 7 | Rate limiting on sensitive endpoints | Done | `backend/src/api/middlewares/rate-limiter.ts` |

---

## Critical Issues

### 1. Vercel Analytics loads unconditionally

**Severity:** Critical
**RGPD articles:** Art. 6 (lawfulness), Art. 7 (conditions for consent)
**Problem:** The `<Analytics />` component loads in `layout.tsx` regardless of cookie consent state. Server-side `track()` calls also fire unconditionally. Under GDPR, analytics that process personal data (IP addresses) require prior consent.

**Affected files:**
- `storefront/src/app/layout.tsx` — `<Analytics />` component (line 31)
- `storefront/src/lib/data/quotes.ts` — `track("quote_created")`, `track("quote_accepted")`, `track("quote_message_created")`
- `storefront/src/lib/data/customer.ts` — `track("customer_logged_in")`, `track("customer_logged_out")`
- `storefront/src/lib/data/cart.ts` — `track("order_completed")`
- `storefront/src/lib/data/companies.ts` — `track("company_created")`, `track("employee_created")`
- `storefront/src/lib/data/cart-event-bus.ts` — `track("add_to_cart")`

**Fix:**
1. **Client-side:** Gate `<Analytics />` behind consent. Create a wrapper component that reads the consent cookie and only renders `<Analytics />` when analytics consent is `"accepted"`.
2. **Server-side:** Create a `hasAnalyticsConsent()` utility in `storefront/src/lib/util/` that reads the consent cookie via `cookies()` from `next/headers`. Wrap every `track()` call with this check. Note: server-side `track()` from `@vercel/analytics/server` transmits the server's IP — verify whether this still constitutes personal data processing or consider moving to client-only tracking.

**Scope:** Frontend (wrapper component + utility) — **S/M**
**Verification:** Open browser DevTools → Network tab. Before consent, no requests to Vercel analytics endpoints. After accepting, requests appear. After rejecting, no requests.

---

### 2. No "Reject" button on cookie banner

**Severity:** Critical
**RGPD articles:** Art. 7(3) (withdrawal as easy as giving consent), Recital 42
**Problem:** The cookie banner only has "Aceitar" and an "X" (dismiss) button. GDPR requires rejecting non-essential cookies to be as easy as accepting them. The "X" saves `"dismissed"` to localStorage which is semantically ambiguous — it doesn't constitute rejection and the banner won't reappear, so the user never truly consents or rejects.

**Affected file:** `storefront/src/modules/common/components/CookieConsent.tsx`

**Fix:** Replace the "X" dismiss with a proper "Rejeitar" button. Both "Aceitar" and "Rejeitar" should be equally prominent buttons. Store the choice as `"accepted"` or `"rejected"` and gate all non-essential tracking accordingly.

**Scope:** Frontend — **S**
**Verification:** Cookie banner shows two equally-sized buttons. Clicking "Rejeitar" stores `"rejected"`, hides the banner, and no analytics loads.

---

### 3. No consent audit trail

**Severity:** Critical
**RGPD articles:** Art. 7(1) ("the controller shall be able to demonstrate that the data subject has consented")
**Problem:** Consent is treated as a UI element only. The registration form has `acceptTerms` as a client-side boolean that is never persisted to the backend. Cookie consent is stored in localStorage (client-side, erasable). If CNPD requests proof that a specific customer consented to data processing, there is no record.

**Affected areas:**
- `storefront/src/modules/account/components/register/index.tsx` — `acceptTerms` state never sent to backend
- `storefront/src/modules/common/components/CookieConsent.tsx` — consent stored in localStorage only
- `storefront/src/modules/contact/components/contact-form.tsx` — no consent recorded at all

**Fix:**
1. Add a `consent_accepted_at` timestamp field to the customer creation workflow. Persist the datetime when the user accepted terms + privacy policy at registration.
2. For cookie consent, send a server-side event logging the choice (accepted/rejected, timestamp, categories) — this can be a lightweight API route or included in the next authenticated request.
3. For the contact form, store the consent timestamp alongside the form submission data.

**Scope:** Frontend + Backend — **M**
**Verification:** Query the database for a customer record → `consent_accepted_at` is populated. Cookie consent events appear in server logs or a consent table.

---

### 4. No granular cookie preferences

**Severity:** High
**RGPD articles:** Art. 6, CNPD/CNIL guidance on cookie consent
**Problem:** Users can't choose which cookie categories to allow. Best practice (and increasingly required by CNPD guidance) is to offer at least: Essential (always on) and Analytics (opt-in).

**Affected file:** `storefront/src/modules/common/components/CookieConsent.tsx`

**Fix:** Add a "Gerir Preferências" option that expands to show cookie categories with toggles.

**Scope:** Frontend — **S/M**
**Verification:** Clicking "Gerir Preferências" shows toggles. Essential is locked on. Analytics defaults to off. Saving preferences stores granular choices.

---

### 5. No cookie re-consent mechanism

**Severity:** High
**RGPD articles:** Art. 7(3) ("The data subject shall have the right to withdraw his or her consent at any time.")
**Problem:** Once the banner is dismissed or accepted, there is no way for the user to revisit their choice. GDPR requires consent to be withdrawable at any time, as easily as it was given.

**Affected areas:**
- `storefront/src/modules/common/components/CookieConsent.tsx` — no re-open mechanism
- Footer component — no "Cookie Settings" link

**Fix:**
1. Add a persistent "Definições de Cookies" link in the site footer.
2. Clicking it reopens the cookie preference dialog.
3. Users can change their choices and save.

**Scope:** Frontend — **S**
**Verification:** Footer link visible on all pages. Clicking it opens the preference dialog with current selections. Changing and saving updates behavior immediately.

---

### 6. Broken privacy policy link in cookie banner

**Severity:** High
**Problem:** The cookie banner links to `/politica-de-privacidade` but the actual page route is `/politica-privacidade`. Users clicking the link get a 404.

**Affected file:** `storefront/src/modules/common/components/CookieConsent.tsx` (line 50)

**Fix:** Change `href="/politica-de-privacidade"` to `href="/politica-privacidade"`.

**Scope:** Frontend — **XS**
**Verification:** Click the privacy policy link in the cookie banner → page loads correctly.

---

### 7. No self-service account deletion

**Severity:** High
**RGPD articles:** Art. 17 (Right to erasure)
**Problem:** The privacy policy promises "Apagamento (direito a ser esquecido)" but users have no way to delete their account from the storefront. Only backend admin routes can delete customers.

**Affected area:** `storefront/src/app/[countryCode]/portal/conta/perfil/page.tsx`

**Fix:** Add an "Eliminar Conta" button on the profile page that triggers account deletion (with confirmation dialog). The backend workflow must:
1. Delete the Employee record and its Customer association.
2. If the user is the sole employee/admin of a Company, handle company cleanup.
3. **Anonymize** order and quote history rather than deleting — replace personal fields (name, email, phone) with placeholder values (e.g., "Utilizador Removido") while preserving financial records for the 10-year Portuguese tax retention period.
4. Revoke the JWT and clear all client-side cookies.

**Scope:** Frontend + Backend (workflow, API route) — **L**
**Verification:** Delete account → JWT cleared, redirect to homepage. Database shows anonymized order records. Login with old credentials fails.

---

### 8. No data export / portability

**Severity:** High
**RGPD articles:** Art. 20 (Right to data portability)
**Problem:** The privacy policy promises "Portabilidade dos dados" but there's no mechanism for users to download their personal data.

**Affected area:** `storefront/src/app/[countryCode]/portal/conta/perfil/page.tsx`

**Fix:** Add an "Exportar os Meus Dados" button on the profile page that generates a JSON download containing:
- Profile (name, email, phone)
- Company information
- Addresses
- Order history (items, totals, dates)
- Quote history (items, messages, status)

**Scope:** Frontend + Backend (API route) — **M**
**Verification:** Click export → JSON file downloads. Open file → contains all expected data categories. No data from other customers is included.

---

### 9. Contact form has no data processing consent

**Severity:** High
**RGPD articles:** Art. 6(1)(a) (consent), Art. 13 (information to be provided)
**Problem:** The contact form collects name, email, phone, and message but has no checkbox or notice informing the user about how their data will be processed, or asking for consent.

**Affected file:** `storefront/src/modules/contact/components/contact-form.tsx`

**Fix:** Add a required consent checkbox: _"Li e aceito a [Política de Privacidade]. Os dados fornecidos serão utilizados exclusivamente para responder ao seu pedido de contacto."_

**Scope:** Frontend — **S**
**Verification:** Form cannot be submitted without checking the consent box. Consent timestamp is persisted.

---

### 10. Checkout review text is in English with wrong company name

**Severity:** Medium
**Problem:** The checkout review displays: _"By Completing this order, I agree to Medusa's Terms of Sale and Privacy Policy"_ — wrong language (should be Portuguese), wrong company name (says "Medusa's"), and it's just passive text, not an explicit consent action.

**Affected file:** `storefront/src/modules/checkout/components/review/index.tsx` (lines 27-43)

**Fix:** Translate to Portuguese, reference "Rio Gaia" instead of "Medusa", and add an explicit checkbox: _"Li e aceito os [Termos e Condições] e a [Política de Privacidade] da Rio Gaia."_

**Scope:** Frontend — **S**
**Verification:** Checkout review shows Portuguese text with "Rio Gaia". Checkbox must be checked before placing order.

---

### 11. Registration form missing privacy policy consent

**Severity:** Medium
**RGPD articles:** Art. 6(1)(a) (consent must be specific)
**Problem:** The registration form has a terms acceptance checkbox but doesn't reference the privacy policy. Users don't explicitly consent to data processing under the privacy policy at registration time.

**Affected file:** `storefront/src/modules/account/components/register/index.tsx` (lines 371-393)

**Fix:** Expand the checkbox label to include both: _"Li e aceito os [termos e condições] e a [Política de Privacidade]."_

**Scope:** Frontend — **XS**
**Verification:** Registration checkbox text includes both links. Both links navigate to the correct pages.

---

### 12. Email templates lack required information

**Severity:** Medium
**RGPD articles:** Art. 13 (transparency), Art. 14 (information obligation)
**Problem:** Email templates in `backend/src/modules/email-notification/templates/` don't include:
- Company identity and contact details
- Link to the privacy policy
- Context about data retention for contact form follow-ups

**Affected files:**
- `backend/src/modules/email-notification/templates/contact-form-confirmation.tsx`
- `backend/src/modules/email-notification/templates/contact-form-notification.tsx`
- `backend/src/modules/email-notification/templates/quote-*.tsx`
- `backend/src/modules/email-notification/templates/password-reset.tsx`

**Fix:** Add a standard footer to all email templates including: company name and address, link to privacy policy, and contact email for data requests.

**Scope:** Backend — **S**
**Verification:** Trigger each email type → footer appears with company info and privacy policy link.

---

### 13. Automated decision-making not disclosed

**Severity:** Low
**RGPD articles:** Art. 22 (automated individual decision-making), Art. 13(2)(f)
**Problem:** The spending limits system (employees have spending limits set by company admins, checkout blocks orders exceeding the limit) constitutes automated decision-making that "significantly affects" the data subject. The privacy policy does not disclose the existence of this automated logic.

**Affected area:** Privacy policy page, spending limit enforcement in checkout

**Fix:** Add a section to the privacy policy explaining that spending limit enforcement is automated, how it works, and how to contest a decision (contact company admin or Rio Gaia support).

**Scope:** Content — **XS**
**Verification:** Privacy policy includes a section on automated decision-making mentioning spending limits.

---

## Cookies Inventory

| Cookie | Purpose | Category | `httpOnly` | `secure` | `sameSite` | Max Age |
|--------|---------|----------|------------|----------|------------|---------|
| `_medusa_jwt` | Authentication token | Essential | Yes | Yes (prod) | strict | 7 days |
| `_medusa_cart_id` | Cart session | Essential | Yes | Yes (prod) | strict | 7 days |
| `_medusa_cache_id` | Cache invalidation | Essential | Yes | Yes (prod) | lax | 1 day |
| Vercel Analytics | Usage analytics | Analytics | No | — | — | Session |
| `rio-gaia-cookie-consent` | Consent preference (localStorage) | Essential | N/A | N/A | N/A | Indefinite |

---

## Third-Party Data Processors

| Service | Data Shared | Purpose | DPA Required | Transfer Mechanism |
|---------|-------------|---------|--------------|-------------------|
| Vercel | IP address, page views, events | Analytics & hosting | Yes | SCCs (US-based) |
| Stripe | Payment details, billing address | Payment processing | Yes | SCCs (US-based) |
| PayPal | Payment details, email | Payment processing | Yes | SCCs (US-based) |
| Meilisearch | Product data, search queries* | Search | No (self-hosted) | N/A (EU) |
| SMTP provider | Email addresses, names | Transactional emails | Yes | _(depends on provider)_ |

\* **Note on Meilisearch:** While product data itself is not personal data, search queries can constitute personal data if logged with user identifiers. Verify whether Meilisearch logs queries and, if so, configure retention or disable query logging.

### Cross-Border Data Transfers (Art. 44-49)

Vercel, Stripe, and PayPal are US-based companies. After the Schrems II ruling, transferring personal data outside the EU/EEA requires one of:
- An **adequacy decision** (the EU-US Data Privacy Framework covers some US companies)
- **Standard Contractual Clauses (SCCs)** included in the DPA
- **Binding Corporate Rules** (rare for SaaS vendors)

**Action required:** Verify that DPAs with each US-based processor include SCCs or confirm the processor is certified under the EU-US Data Privacy Framework. Document the legal basis for each transfer.

---

## Data Retention Schedule

| Data Category | Retention Period | Legal Basis | Deletion Method |
|---------------|-----------------|-------------|-----------------|
| Customer profile (name, email, phone) | Until account deletion or inactivity policy | Contract (Art. 6(1)(b)) | Anonymize on deletion |
| Company data (name, VAT, address) | Until account deletion | Contract | Anonymize on deletion |
| Order/invoice records | **10 years** from transaction date | Portuguese tax law (Art. 52 CIVA) | Anonymize personal fields; retain financial data |
| Quote records | 2 years after completion/rejection | Legitimate interest | Delete or anonymize |
| Contact form submissions | 6 months after resolution | Consent (Art. 6(1)(a)) | Delete email thread + backend record |
| Analytics data (Vercel) | Per Vercel's retention policy | Consent | Request deletion via Vercel DPA |
| Authentication tokens (JWT) | 7 days (automatic expiry) | Contract | Cookie expires automatically |
| Cart data | 7 days (automatic expiry) | Contract | Cookie expires automatically |
| Server/access logs | 90 days | Legitimate interest (security) | Automatic rotation |

**Action required:** Implement automated cleanup for contact form submissions and expired quote records. Document the inactivity period that triggers account cleanup (e.g., 24 months of no login).

---

## Records of Processing Activities — ROPA (Art. 30)

| Processing Activity | Lawful Basis | Data Categories | Data Subjects | Retention | Recipients |
|---------------------|-------------|-----------------|---------------|-----------|------------|
| Customer registration | Contract (Art. 6(1)(b)) | Name, email, phone, password hash | B2B customers | Until deletion | Internal |
| Company management | Contract | Company name, VAT, address, employee list | B2B companies | Until deletion | Internal |
| Order processing | Contract | Order items, totals, addresses, payment ref | B2B customers | 10 years (tax) | Stripe/PayPal |
| Quote workflow | Contract + Legitimate interest | Quote items, messages, pricing | B2B customers | 2 years | Internal |
| Contact form | Consent | Name, email, phone, message | Website visitors | 6 months | SMTP provider |
| Analytics (Vercel) | Consent | IP address, page views, events | All visitors | Per Vercel policy | Vercel |
| Transactional emails | Contract | Email address, name, order/quote details | B2B customers | Per email provider | SMTP provider |
| Password reset | Contract | Email address, reset token | B2B customers | Token: 1 hour | SMTP provider |
| Product search | Legitimate interest | Search queries (if logged) | All portal users | _(verify Meilisearch config)_ | Self-hosted |

---

## Breach Notification Procedure (Art. 33-34)

### Discovery & Assessment
1. Any team member who discovers or suspects a data breach must notify the responsible person immediately.
2. Assess the breach: what data was affected, how many data subjects, what is the likely impact.

### Notification to CNPD (Art. 33)
- **Deadline:** Within **72 hours** of becoming aware of the breach.
- **Portal:** [CNPD online notification form](https://www.cnpd.pt)
- **Content:** Nature of breach, categories and approximate number of data subjects, likely consequences, measures taken or proposed.
- If full details are not available within 72 hours, provide information in phases without further delay.

### Notification to Data Subjects (Art. 34)
- Required when the breach is "likely to result in a high risk to the rights and freedoms of natural persons."
- Examples: leaked passwords, exposed payment data, exposed personal contact information.
- Must describe the breach in clear, plain language (Portuguese) and advise on protective measures.

### Documentation
- All breaches (even those not reported to CNPD) must be documented: facts, effects, remedial action taken.
- Maintain a breach register.

### Responsible Person
- **Name:** _(to be designated)_
- **Email:** _(to be designated — e.g., privacidade@riogaia.com)_
- **Role:** Handles all GDPR-related queries, data subject requests, and breach notifications.

> **Note:** Companies with fewer than 250 employees are not required to appoint a formal DPO under RGPD, but must still designate someone responsible for data protection compliance.

---

## Implementation Priority

### Priority 1 — Critical (blocks compliance)

| Task | Scope | Size |
|------|-------|------|
| Gate Vercel Analytics behind consent (client + server) | Frontend | S/M |
| Rework cookie banner: add "Rejeitar" button | Frontend | S |
| Implement consent audit trail (registration, cookies, contact form) | Frontend + Backend | M |
| Fix broken privacy policy link in cookie banner | Frontend | XS |

### Priority 2 — High (RGPD rights & consent)

| Task | Scope | Size |
|------|-------|------|
| Add account deletion to profile page (with anonymization) | Frontend + Backend | L |
| Add data export to profile page | Frontend + Backend | M |
| Add data processing consent to contact form | Frontend | S |
| Add granular cookie preferences ("Gerir Preferências") | Frontend | S/M |
| Add cookie re-consent link in footer | Frontend | S |

### Priority 3 — Medium (correctness & transparency)

| Task | Scope | Size |
|------|-------|------|
| Translate and fix checkout review (Portuguese, "Rio Gaia", checkbox) | Frontend | S |
| Add privacy policy reference to registration checkbox | Frontend | XS |
| Add company info + privacy link footer to all email templates | Backend | S |
| Disclose automated spending limit logic in privacy policy | Content | XS |

### Priority 4 — Procedural (documentation & compliance infrastructure)

| Task | Scope | Size |
|------|-------|------|
| Verify DPAs with Vercel, Stripe, PayPal, SMTP provider (include SCCs) | Legal/Admin | — |
| Designate responsible person for data protection | Admin | — |
| Verify Meilisearch query logging configuration | Backend/Ops | XS |
| Define and document inactivity-based account cleanup policy | Admin | S |
| Implement automated cleanup for expired contact form data and quotes | Backend | M |

---

## Legal Notes

- **B2B does not exempt from GDPR.** Employee data (name, email, phone) within companies is still personal data under RGPD.
- **Silence is not consent.** A dismissed cookie banner that doesn't block analytics is non-compliant. If the user hasn't explicitly consented, non-essential processing must not happen.
- **Consent must be provable.** Under Art. 7(1), the controller must be able to demonstrate that consent was given. A client-side checkbox with no server-side record is insufficient.
- **Data retention for invoices.** Portuguese tax law (Art. 52 CIVA) requires invoice data retention for 10 years. Account deletion must anonymize personal data but preserve financial records.
- **Account deletion = anonymization, not hard delete.** The dual obligation (right to erasure vs. tax retention) requires a "soft delete + anonymization" pattern: replace PII with placeholders while preserving invoice line items, totals, and tax references.
- **Cross-border transfers require legal basis.** Since the Schrems II ruling, transferring personal data to US-based processors (Vercel, Stripe, PayPal) requires SCCs or EU-US Data Privacy Framework certification.
- **CNPD alignment.** The Portuguese CNPD generally follows the French CNIL's stricter GDPR interpretations, especially regarding analytics and cookie consent.
- **Server-side tracking is not exempt.** Server-side `track()` calls in Next.js server actions still process personal data (user behavior linked to session/IP). Consent checks must extend to server-side code, not just the client-side `<Analytics />` component.
- **Search queries can be personal data.** If Meilisearch logs queries with user identifiers, those logs constitute personal data processing and must be covered by the retention policy.
