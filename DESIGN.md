# DESIGN.md — OPA LMS design language

> Third file in the set. `AGENTS.md` = **how** we build. `PROJECT.md` = **what** we build.
> This one = **how it should look and feel**, and why. Read it before any screen work.
> Everything here is implemented in `src/theme/tokens.ts` and the shared primitives in
> `src/shared/ui/` — this document explains the decisions those files encode.

---

## 1. Who we are designing for

OPA is **One Percent for America**, a lending programme affiliated with BlueHub Capital. It
lends at **1% APR** so immigrants can pay **USCIS application fees** — the money between a
person and their citizenship. The public site's own line is: *"While the pathway to
citizenship can be long and complex, paying for it shouldn't be."*

That sentence is the design brief.

**The borrower** is often a green-card holder, Dreamer or TPS holder, applying for N-400 or
N-600. Frequently a non-native English speaker — the public site ships a full Spanish
version, and so must this one. Likely on a **phone**. Likely entering an SSN, an income
figure and a debit card into a website they have known for ten minutes, at a moment when
their immigration status is at stake.

Research backs what that implies. RAND finds limited English proficiency is one of the three
main barriers to immigrant use of financial services, bound up with **trust in institutions**.
The CFPB finds consumers with limited English are **more vulnerable to fraud and deceptive
schemes**, which makes plain, accurate disclosure a safety feature, not a nicety — and that
you cannot rely on a tooltip to carry an explanation.

**The underwriter and OPA staff** are the opposite user: all day, every day, many
applications, on a desktop, wanting density, keyboard speed and the decision context in one
place.

One product, two completely different ergonomics. That is the central design decision
(§4).

## 2. Principles

1. **Calm over clever.** Money plus immigration status equals anxiety. No urgency theatre, no
   artificial scarcity, no celebratory confetti over a loan. Real deadlines (a co-borrower
   invitation expiring in 5 days, a payment due on the 1st) are stated plainly and once.
2. **Plain language, always visible.** Write the explanation on the screen, not behind an
   icon. If a term must exist ("co-borrower", "APR", "acceleration"), define it inline the
   first time it appears.
3. **One decision per screen.** The application is a wizard because a single long form is
   where an anxious applicant abandons. Ask for one thing, confirm it, move on.
4. **Always say where you are and what happens next.** Every step shows its position; every
   waiting state says who is waiting and roughly how long; every screen ends with the next
   action.
5. **No dead ends.** A failure screen that only says "we cannot proceed" is a design bug.
   Identity or sanctions failure → "please call Customer Service" **with the number on the
   screen**. Technical failure → "your progress is saved, try again later".
6. **Dignity in a decline.** No red stamps, no "REJECTED". A decline is a plain statement, the
   reason we are allowed to give, and what the person can do next. Never make someone feel
   judged by a colour.
7. **Bilingual by construction.** No text inside images. No fixed-width labels. Spanish runs
   20–30% longer than English — every component must survive it, and the Storybook
   **Density: stress** switch is where you prove it.
8. **Privacy is visual.** SSNs, card numbers and documents are masked by default and revealed
   deliberately. A borrower never sees their co-borrower's card; a co-borrower never sees the
   virtual card at all.

## 3. Visual identity

Taken from OPA's own public site (measured from the live pages, not invented), then adjusted
for contrast and for the fact that this is a long-session product, not a landing page.

### Colour

| Role | Hex | Notes |
|---|---|---|
| **Primary — OPA teal** | `#146580` | The brand blue of the OPA mark. **6.5:1 on white** — passes AA for body text, not just for UI. |
| Primary hover / active | `#125A71` | From the site's own hover state. |
| Primary soft | `#4D889C` | Disabled, muted icons, chart secondaries. |
| **Accent — copper** | `#B85C23` | The site's warm secondary. Used **sparingly**: one hero CTA, progress fill, milestone marks. Never for status. |
| Accent on light text | `#A4501C` | Darker variant when copper carries text. |
| Ink — headings | `#262423` | Warm near-black, not pure black. |
| Ink — body | `#4D4847` | The site's body grey. |
| Border | `#D9D4D1` | Warm, so it sits with the ink rather than fighting it. |
| Page background | `#FAF8F6` | Warm off-white. Clinical white reads as a form; this reads as paper. |
| Surface | `#FFFFFF` | Cards sit on the warm page. |

Status colours are **deliberately not antd's defaults**. antd's `#52c41a` green and `#ff4d4f`
red are bright, app-like and loud — wrong register for someone reading whether their loan was
approved.

| Status | Hex | Why |
|---|---|---|
| Success | `#2F7D5A` | Calm forest green. Approved, paid, verified. |
| Warning | `#9A6700` | Amber, legible on white. Action needed, invitation expiring. |
| Error | `#B42318` | Deep red, not alarm red. Failed payment, declined. |
| Info | `#146580` | The primary. Pending, under review, informational. |

**Copper is not a status colour.** It is close enough to the warning amber that using it for
state would make two different meanings look alike. Copper means *brand*, amber means
*attention*.

### Type

The public site uses **Gotham** (UI) and **Noe Display** (headlines) — both commercial. The
substitutes here are chosen for the job, not only for resemblance:

- **Inter** (`@fontsource-variable/inter`) for everything functional. It is the best widely
  available face for small sizes, dense tables and forms, and it carries the full Latin
  Extended range Spanish needs. Bundled locally — no call to Google on a page where someone
  types an SSN.
- **Playfair Display** (`@fontsource/playfair-display`) as the display face, standing in for
  Noe. **Restricted to large customer-facing headings** (≥28px) on milestone screens —
  welcome, submitted, approved, funded. It carries the civic, hopeful register of the brand.
  It is never used in the back-office, never in a table, never below 28px, and never for
  anything a user must act on quickly.

Exposed as `fontFamilyDisplay` from `tokens.ts` and applied through the shared
`DisplayTitle` primitive, so the restriction is a component, not a convention nobody reads.

### Shape and depth

- **Radius 8** for controls, **12** for cards. Soft enough to feel contemporary, not so round
  it reads as a toy.
- **Shadows are structural, not decorative.** A card on the page background needs no shadow;
  a layer that genuinely floats (Modal, Drawer, Dropdown, the mobile sticky action bar) gets
  one. If you cannot say what the shadow separates, remove it.
- Dividers over boxes. Prefer a `Divider` and whitespace to nesting another bordered box.

## 4. Two densities, one theme

The single most important structural decision:

| | Customer portal | Internal back-office |
|---|---|---|
| Base font | **16px** | 14px |
| Control height | **44px** | 32px |
| Max content width | 720px (wizard) / 1080px (dashboard) | 1440px |
| Table size | n/a — cards and lists | `size="small"`, sticky header |
| Touch targets | ≥44px (WCAG 2.5.5) | mouse and keyboard |

16px inputs also stop iOS Safari zooming on focus — a real bug for a phone-first audience,
not a stylistic preference.

Implementation: `tokens.ts` ships the **generous** values as the global theme, because the
customer portal is both the majority of screens and the trust-critical ones. The staff shell
wraps its subtree in a nested `ConfigProvider` using the exported `compactTokens`. That is
antd's own mechanism, it lives in one place, and it means a designer never has to remember
which density a screen is in — the shell decides.

> **Note on the Storybook stress switch.** Because the global base is now 16/44, the kit's
> original stress tokens (16/40/16) would have been *smaller* than the default and the check
> would have stopped testing anything. `.storybook/preview.tsx` stress values were therefore
> raised to **20/52/20**. The check was strengthened, not weakened — which is the only
> direction a guardrail may ever be changed.

## 5. Layouts

### 5.1 Customer shell

```
┌──────────────────────────────────────────────┐
│  OPA mark      Loan · Payments · Help   EN|ES  ▾account │   ← 64px bar, sticky
├──────────────────────────────────────────────┤
│                                              │
│            content, max 720 / 1080           │   ← warm page bg
│                                              │
├──────────────────────────────────────────────┤
│  [ Continue ]                                │   ← mobile only: sticky action bar
└──────────────────────────────────────────────┘
```

- Single column. Never two columns of form fields on the customer side.
- The **language switch is in the top bar on every screen**, not buried in settings. A person
  who cannot read the settings link cannot reach the language setting.
- The primary action is **one button, bottom right** on desktop and a **sticky full-width
  bar** on mobile. Secondary actions are text buttons, never a second filled button.
- Support contact is reachable from every screen — it is the designated escape hatch of
  principle 5.

### 5.2 Application wizard

- Desktop: a **vertical step rail** on the left (antd `Steps direction="vertical"`) showing
  all steps, which are done, which is current. Content card on the right.
- Mobile: horizontal `Steps` collapsed to "Step 3 of 7 — Income", plus a progress bar.
- Steps are **resumable and reversible** (the WBS requires moving back and forth). Each step
  saves on leave; the rail is navigable backwards.
- Long automated steps (identity, credit, income) get a **named waiting state**: what is
  being checked, that it is normal, and that progress is saved — not a bare spinner.

### 5.3 Back-office shell

```
┌────┬──────────────────────────────────────────┐
│    │ search            notifications  ▾user   │
│ S  ├──────────────────────────────────────────┤
│ i  │  Breadcrumb / page title      [actions]  │
│ d  │                                          │
│ e  │  content, max 1440                       │
│ r  │                                          │
└────┴──────────────────────────────────────────┘
```

- Collapsible left `Sider`, grouped by the epics in `PROJECT.md`: Applications · Borrowers ·
  Loans · Payments · Users · Acquisition · Reports.
- **Lists are tables**, with sticky header, server-shaped pagination, a filter row, and search
  on name / email / phone. The borrower list shows **at most 8 columns** (WBS) — anything
  else goes in the detail view.
- **The underwriter's application screen is the one screen that earns a two-column layout:**
  left = the application in tabs (Borrower · Co-borrower · Documents · Verifications ·
  History), right = a **sticky decision panel** holding the verification results, the
  recommendation (read-only) and the actions. Research on lending back-offices is consistent
  on this: put the decision and its deadlines next to the work, not on another screen.
- **Read-only is absent, not disabled.** OPA Staff see the same screen with the decision panel
  gone — a page full of greyed-out buttons teaches nothing and invites clicking.
- Every decision action opens a modal that **requires its reason** before it will submit.
  Decline reason, override reason and amount-change reason are mandatory per the WBS, and the
  audit trail is only as good as that field.

## 6. Component conventions

- **Status is one component.** `StatusTag` maps every vocabulary in `PROJECT.md` §5 to a
  colour and a label. One mapping, one place — so `Approved` is never two different greens.
- **Money is one component.** `Money` formats USD and respects the active locale. No ad-hoc
  `toFixed(2)` anywhere.
- **Dates are one component.** Due dates land on the 1st; schedules are month-based. Format
  centrally so the Spanish build does not read as English with translated labels around it.
- **Masking is a component.** `MaskedValue` covers SSN, card number and account identifiers,
  with a deliberate reveal.
- **Forms:** `layout="vertical"` everywhere. Labels above fields — required for long Spanish
  labels and for narrow screens. Help text sits under the field, visible, not in a tooltip.
  Errors are sentences, not codes.
- **Empty states always carry the next action.** antd `Empty` with a button, never a bare
  "No data".
- **Loading:** `Skeleton` for content that will arrive, `Spin` only for an action in flight.
  Tables use antd's own `loading` prop.
- **Uploads** (income documents) show type, size limit and accepted formats **before** the
  picker, and list what was uploaded with a remove action.
- **Third-party frames** (Repay card entry, DocuSign) are rendered as a bordered surface with
  our own heading, our own explanation of what is about to happen, and explicit idle /
  loading / error / returned states around the frame. In Design Mode the frame itself is a
  placeholder — never hand-build a card form.

## 7. Accessibility floor

- **WCAG 2.1 AA.** Every pairing in §3 was chosen to clear 4.5:1 for text and 3:1 for UI.
- Touch targets ≥44px on the customer side.
- Colour never carries meaning alone — every status tag has a word in it.
- Visible focus ring on every interactive element; the wizard must be completable by keyboard.
- Forms are label-bound (antd `Form.Item` does this; hand-rolled inputs are banned anyway).
- Verified in Storybook with the a11y addon, and in light **and** dark at stress density.

## 8. Dark mode

Supported because the kit ships it and the back-office is a long-session tool. The teal seed
is dark, so antd's `darkAlgorithm` lightens the derived palette automatically; the warm page
background and warm ink are what keep dark mode from going blue-grey and clinical. Check
every new screen in dark at stress density before calling it done — that combination is where
fixed sizes and hardcoded colours surface.

## 9. What not to do

- Do not introduce a second accent colour. The palette is teal + copper + four statuses.
- Do not use copper for state, or green/red for anything that is not state.
- Do not put Playfair below 28px, or anywhere in the back-office.
- Do not nest cards inside cards. Use a divider.
- Do not explain anything in a tooltip alone.
- Do not add a chart to the customer portal. A repayment schedule is a table with a clear
  next-payment row; borrowers need a number, not a donut.
- Do not celebrate. The loan is a serious financial obligation, and the user's citizenship is
  not ours to cheer about.

---

### Sources behind the choices above

Brand values measured from OPA's live site; programme facts and tone from BlueHub Capital's
announcements and ImpactAlpha's profile; audience research from RAND's *Barriers to Immigrant
Use of Financial Services* and the CFPB's work on consumers with limited English proficiency;
back-office layout conventions from current loan-origination practice; token mechanics from
Ant Design's own theme documentation.
