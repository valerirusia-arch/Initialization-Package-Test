# PROJECT.md — OPA LMS (Loan Management System)

> **Read this together with `AGENTS.md`.** `AGENTS.md` says *how* we build (role gate,
> antd-only, dumb components, flows vs. logic, the checks). This file says *what* we are
> building: the product, its roles, its screens, its vocabularies and its hard constraints.
> Source of truth: **"Final WBS & Estimates — OPA LMS (with referrals)"**.
> If a screen request contradicts something written here, say so before building it.

---

## 1. What the product is

A lending platform for OPA. A **Borrower** applies online for a loan tied to a **USCIS
application** (the USCIS service type defines the loan size). The system verifies identity,
screens against sanctions and internal no-lend lists, pulls a credit report, verifies income,
and either approves automatically, requires a **Co-borrower**, routes to a human
**Underwriter**, or declines. An approved loan is funded onto a **virtual prepaid card**,
and the borrower repays it monthly by debit card.

Two audiences, two shells:

| Shell | Users | Route prefix |
|---|---|---|
| **Customer portal** | Borrower, Co-borrower | `/` |
| **Internal back-office** | Admin, Underwriter, OPA Staff | `/staff` |

They do **not** share chrome. Different layout, different navigation, different density.
A shared `ui/` primitive may be used by both; a screen never is.

## 2. Roles

| Role | `meta.role` | What they do |
|---|---|---|
| Borrower | `borrower` | Registers, applies, signs, invites a co-borrower, gets the card, repays. |
| Co-borrower | `co-borrower` | Joins by invitation, completes the same application steps. Sponsors **up to 3** borrowers. |
| Admin | `admin` | Manages internal users, borrower accounts, acquisition data, DO NOT LOAN list. |
| Underwriter | `underwriter` | Reviews applications, approves/declines/overrides, adjusts the requested amount. |
| OPA Staff | `opa-staff` | **Read-only** on applications and loans. Cannot modify or decide. |
| System | `system` | Automated steps (verification, decisioning, notifications). Usually **no UI** — it surfaces only as a status, a banner or an email/SMS template. |

`meta.role` in `src/flows/routes.tsx` is a **design annotation**, not a guard — it only
groups and filters screens in the DevBar and the Flow Map. Real guards are Dev's, in `/app`.

## 3. Epics → `meta.flow`

Use these exact strings so the Flow Map groups cleanly:

`Auth` · `Users` · `Application` · `Decisioning` · `Loan` · `Payments` ·
`Notifications` · `Reporting` · `Acquisition` · `System`

Integrations (LexisNexis InstantID, Equifax, DocuSign, Twilio/SendGrid, Repay, USIO,
Microsoft Entra ID, Microsoft Fabric) are **back-end only** — they have no screens of their
own. They show up in the UI only as the states they produce (see §6).

## 4. Screen map

The target route tree. Build it incrementally — this is the plan, not a backlog to clear in
one go. Paths here are what goes into `src/flows/routes.tsx` (`:id` syntax, never `$id`).

### 4.1 Auth & profile — customer (`Auth`)

| Path | Screen | Notes |
|---|---|---|
| `/auth/register` | Registration wizard, **step 1 — Your details** | Name, DoB, country of origination (some countries excluded), email, phone (**US mask**). |
| `/auth/register/identity` | **Step 2 — Address & SSN** | SSN, US address with a **limited state list** (OPA lends only where it is licensed). Opens by saying why we ask. |
| `/auth/register/security` | **Step 3 — Password** | Password with a live rules checklist, plus communication preferences (SMS/email). |
| `/auth/register/terms` | **Step 4 — Terms + Privacy Policy** | Required **before** account creation. Two separate acknowledgements. No versioning in MVP. |
| `/auth/register/verify-email` | **Step 5 — Email OTP** | Carries a "wrong address?" way back to step 1. |
| `/auth/register/verify-phone` | **Step 6 — Phone OTP** | Last step; the primary action creates the account. |

> Every wizard step is **its own route**, not local state: the WBS requires moving back and
> forth and resuming after a technical failure, and a route is the only step you can return
> to. The shared rail lives in `src/features/auth/ui/RegistrationLayout.tsx`, its order in
> `registrationSteps.ts`.
| `/auth/login` | Login | Email + password, **Remember me**, lockout after repeated failures. |
| `/auth/account-locked` | Locked account notice | Never reveals whether the address exists. Offers a reset **and** a phone number on screen. |
| `/auth/forgot-password` | Request reset (email) | |
| `/auth/reset-password` | Set a new password from the emailed link | |
| `/auth/set-password` | First-time password set from an invite link | Used for internal users **and** co-borrowers. |
| `/profile` | View profile | Layout is **reused** for the internal "view profile" screen. |
| `/profile/edit` | Update contact info | Only **email, phone, mailing address**. Changing email or phone re-triggers verification. |
| `/profile/change-password` | Change password | |
| `/profile/notifications` | Notification preferences | Channel per notification type. |
| `/support` | Contact information | Static page, information only, **no interactive elements**. |

Language (**English / Spanish**) is a control in the app header, not a screen.

### 4.2 Loan application — customer (`Application`)

A wizard the borrower can **move back and forth** through after their account exists.
**One active application per borrower.**

| Path | Screen |
|---|---|
| `/application` | Wizard shell — step indicator + resume point |
| `/application/consents` | Credit authorization, e-disclosures, consents → DocuSign |
| `/application/income` | Annual income + income document upload (type + file) |
| `/application/details` | USCIS application (single select) + application type → loan size |
| `/application/co-borrower` | Invite a co-borrower (first name, last name, email) |
| `/application/card` | Debit card details — **Repay embedded form** |
| `/application/review` | Review and submit |
| `/application/submitted` | Confirmation + household info (income, size), veteran status, "how did you hear about OPA" |
| `/application/status` | Current status and application details |
| `/application/documents` | Application documents — **download only, no in-app preview** |
| `/application/additional-info` | Respond to an underwriter's request: note + document upload |
| `/application/withdraw` | Withdraw before the final decision |
| `/application/unable-to-proceed` | Identity / OFAC failure — "contact Customer Service", **no details disclosed** |
| `/application/technical-error` | Technical failure before account creation — try again later |

Co-borrower side:

| Path | Screen |
|---|---|
| `/invitation/:token` | Accept the invitation and register |
| `/co-application` | The same steps, scoped to the assigned application only |

Replacing a co-borrower (invite expired after **5 calendar days**, not accepted, or failed
underwriting) is an action on `/application/co-borrower`, repeatable until one qualifies.
Previous invitations become inactive.

### 4.3 Loan & card — customer (`Loan`)

| Path | Screen |
|---|---|
| `/loan` | Loan amount, remaining unused balance, APR, repayment terms and schedule |
| `/loan/sign` | Review and sign the loan agreement package (DocuSign) |
| `/loan/card` | Virtual payment card details — **borrower only, never the co-borrower** |
| `/loan/documents` | Loan documents, download only |
| `/loan/cancel` | Cancel an approved loan **before the card has been used** |

### 4.4 Payments — customer (`Payments`)

| Path | Screen |
|---|---|
| `/payments` | Overview: outstanding balance, next due, overdue flag |
| `/payments/schedule` | Due dates, amounts, paid / overdue markers |
| `/payments/history` | Completed, pending, failed, refunded, reversed |
| `/payments/make` | Make the scheduled payment |
| `/payments/extra` | Additional / catch-up / early payoff |
| `/payments/result/:id` | Payment result, with **retry** on failed or reversed |
| `/payments/methods` | Saved card: masked number, brand, expiry, active flag. **Each user sees only the cards they added.** |
| `/payments/methods/update` | Replace the card — full re-verification through Repay |
| `/payments/fees` | Applied late fees and overdue information |

### 4.5 Internal back-office (`Users`, `Decisioning`, `Loan`, `Payments`, `Reporting`)

| Path | Screen | Role |
|---|---|---|
| `/staff/login` | Internal sign-in (Microsoft Entra ID) | all internal |
| `/staff/users` | Admin/underwriter list + search by name/email | admin, opa-staff |
| `/staff/users/new` | Create internal user (name + email → set-password email) | admin |
| `/staff/users/:id` | Internal user detail: edit, resend set-password link, activate/deactivate | admin |
| `/staff/profile` | Own profile — name and email only | all internal |
| `/staff/borrowers` | Borrower / co-borrower list. **Up to 8 columns**: name, email, phone, address, state, application status… Search by name/email/phone; filter by state and application status. | admin, underwriter, opa-staff |
| `/staff/borrowers/:id` | Borrower detail — tabs: Profile · Co-borrower · Application · Loan · Documents · Payments · Acquisition | admin, underwriter, opa-staff |
| `/staff/borrowers/:id/edit` | Manually update borrower/co-borrower data | admin, underwriter |
| `/staff/do-not-loan` | DO NOT LOAN list — add, view, filter by the marker | admin, underwriter, opa-staff |
| `/staff/applications` | Underwriting queue (manual review). Any underwriter may take any application — **no assignment in this phase**. | underwriter, opa-staff |
| `/staff/applications/:id` | Full application: borrower + co-borrower data, status, USCIS service, documents, verification results, decision recommendation (**read-only**) | underwriter, opa-staff |
| `/staff/applications/:id/decision` | Approve · Decline (**reason required**) · Override (**reason required**) · Request additional information (note) · Update requested amount (**logged with old/new value, user, date, reason**) | underwriter |
| `/staff/loans/:id` | Loan information, funding status, documents | admin, underwriter, opa-staff |
| `/staff/loans/:id/edit` | Add documents and comments | admin, underwriter |
| `/staff/payments/:loanId` | Repayment schedule (incl. fees) and payment history | admin, underwriter, opa-staff |
| `/staff/reports` | Exports: credit report, monthly consumer credit reporting (Metro II), application data — **xlsx / csv**, with filters | admin, underwriter, opa-staff |
| `/staff/tasks` | System task notifications (manual review assigned, processing failures) | admin, underwriter |

### 4.6 Acquisition, referrals & campaigns (`Acquisition`, priority 2)

| Path | Screen |
|---|---|
| `/staff/acquisition/sources` | Acquisition sources CRUD — name, partner, code, status, active/inactive |
| `/staff/acquisition/partners` | Referral partners and partner groups CRUD (up to ~5 attributes) |
| `/staff/acquisition/campaigns` | Marketing campaigns CRUD — up to ~10 attributes, status, validity period |
| `/staff/acquisition/performance` | Lending performance by campaign / partner group / partner / source, with filters |

Acquisition data reaches a loan through **URL parameters / a referral code** at application
time, and is shown read-only on the borrower and loan detail screens.

### 4.7 Notifications (`Notifications`)

Email and SMS are delivered outside the app (Twilio / SendGrid), but they still need design:
**email and SMS templates are UI/UX work** in this WBS. Build them as presentational
components under `src/features/notifications/ui/` with their own stories — one story per
template:

application approved · application declined · additional information requested ·
documents ready to sign · co-borrower invitation · invitation expired ·
co-borrower failed underwriting · loan funded + card available · payment reminder ·
payment confirmation · payment failed · delinquency (late fee / default / acceleration) ·
unable to proceed (contact Customer Service) · internal task assigned · set password.

## 5. Vocabularies — use these exact labels

**Application status:** `Draft` · `In progress` · `Submitted` · `Under review` ·
`Pending action` · `Approved` · `Declined` · `Withdrawn`

**Co-borrower invitation:** `Pending` · `Accepted` · `Expired` · `Replaced`
(expires **5 calendar days** after it is sent)

**Payment status:** `Scheduled` · `Pending` · `Succeeded` · `Failed` · `Refunded` ·
`Reversed` · `Overdue`

**Loan status:** `Approved` · `Funded` · `Active` · `Cancelled` · `Paid off` ·
`Past due` · `Default` · `Accelerated`

**Verification result (internal views):** `Passed` · `Failed` · `Pending` · `Manual review`
— shown to internal users only. The borrower never sees why a check failed.

### Repayment rules (drive the schedule and fee UI)

- Repayment begins **within 45 days** after the loan is approved; payments are due on the
  **1st of each month**.
- A payment not received within **15 calendar days** of the due date gets a late fee on the
  **16th day**: **$5.00 or 5% of the unpaid installment, whichever is less**, once per
  missed payment.
- More than **90 days** past due → **default**; the full past-due balance must be paid
  within 30 days to avoid acceleration.
- More than **120 days** past due → **acceleration**; the full remaining balance, interest
  and fees are due within 30 days of the notice of default.
- **APR is 1%.**

## 6. Hard constraints — these shape the UI

1. **Bilingual: English / Spanish.** No string is baked into a fixed-width box. Spanish runs
   ~20–30% longer — check every label under the Storybook **Density: stress** switch.
2. **US only.** Phone fields use a US mask. State is a select from a **limited** list of
   supported states. Country of origination is a select with **excluded** countries removed.
3. **Debit cards only, US only.** Card entry is a **Repay embedded form** — a black box to
   us. In Design Mode, render a placeholder frame with the surrounding chrome and states
   (idle / loading / error), never a hand-built card form. Only a **token** is ever stored;
   the UI shows masked number, brand, expiry and the active flag.
4. **E-signature is DocuSign.** The borrower only signs there — no document editing, date is
   set automatically. Design the hand-off and the return states (signed / declined /
   expired / error).
5. **Documents are download-only.** No in-app preview anywhere.
6. **Virtual card is borrower-only.** The co-borrower has no access to card information, and
   neither party can see the other's saved repayment card.
7. **Identity data is not self-service.** Name, DoB and SSN cannot be edited by the user —
   only email, phone and mailing address. Changing email or phone re-runs verification.
8. **Never disclose verification or screening detail to an applicant.** A failed InstantID or
   OFAC check produces one message: contact Customer Service.
9. **Technical failures never reject an application.** Before account creation: "try again
   later". After account creation: the application keeps its state, OPA Staff are notified,
   and the borrower resumes from the point of interruption. Every long step needs a
   **resumable** state, not just a spinner.
10. **One active application per borrower**, and a borrower on the DO NOT LOAN list cannot
    start one.
11. **OPA Staff are read-only.** Build the internal screens so the action area can be absent
    entirely, not disabled-looking.
12. **Responsive.** Full support on the latest Chrome, Firefox and Safari; the happy path is
    also verified on Chrome for Android and Safari on iOS. The customer portal must work on
    a phone.
13. **Audit everywhere internal.** Decisions, overrides and amount changes record who, when,
    old value, new value and reason — the UI must collect the reason, not invent it later.

## 7. Conventions for this project

- **Flow folders** mirror §4: `src/flows/auth/`, `application/`, `loan/`, `payments/`,
  `staff/…`. Screen files are `PascalCaseScreen.tsx`.
- **Mock data** lives inline in the screen, or in a co-located `mocks.ts` inside the same
  flow folder. Never in `/features/*/models` — that's Dev's.
- **Shared primitives** that more than one flow needs (status tag, money, masked card,
  document row, step header) go in `src/shared/ui/` **with a story**.
- **Feature-specific presentation** goes in `src/features/<feature>/ui/`. Feature names:
  `auth`, `users`, `application`, `decisioning`, `loan`, `payments`, `notifications`,
  `reporting`, `acquisition`.
- **Every screen gets a `meta`** with `role`, `flow`, `label`, and `sampleParams` for any
  `:id` route so it is clickable from the DevBar and the Flow Map.
- **Money, dates and statuses** are rendered by shared primitives, not formatted ad hoc —
  Spanish locale and the 1st-of-month schedule both depend on it.
- Statuses use antd `Tag`; keep one mapping (status → colour) in a shared primitive so the
  same status never shows two colours.

## 8. Priorities (from the WBS)

**Priority 1 (MVP)** — everything in §4.1–§4.5 except the items marked below.

**Priority 2** — profile update (self-service contact details), manage borrower accounts,
replace co-borrower, approve/decline borrower notification, override automated decision,
add to DO NOT LOAN list (partly), and **the whole Acquisition epic (§4.6)**.

Front-end estimate in the WBS: **241–381 h** total, **186–291 h** for priority 1.
That is the budget this screen map has to fit — prefer composing antd over custom work.

## 9. Open questions to raise, not to invent

- Credit-score thresholds for auto-approve / co-borrower required / auto-decline are
  **"XXX"** in the WBS. Design the three outcomes; never show a number.
- Eligibility rules are hard-coded back-end and not configurable — there is **no rules UI**.
- USCIS application types and amounts are predefined in the database. Admin editing of the
  amount is a **separate, not-yet-specified story** — don't build that screen.
- No underwriter-to-application assignment in this phase — don't design a queue with owners.
- Microsoft Fabric is data exchange only; **analytics implementation is out of scope.**
