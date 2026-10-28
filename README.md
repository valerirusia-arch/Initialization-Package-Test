# OPA LMS — front end

A loan management system front end, built **in code, skipping the mockup stage**: the design
*is* the running app. React + TypeScript + [Ant Design](https://ant.design) 6, with Storybook
beside it and guardrails that keep presentation and logic apart.

> **Status:** the customer portal is built (46 screens on mock data). The internal
> back-office is specified but not implemented. No back end — every submit is a
> `console.log`, waiting for integration.

## Quick start

```bash
npm install && npm run dev
```

That brings up both servers — the app on **:5173** and Storybook on **:6006**. The DevBar at
the top of the app links straight into both, and its **Flow map** button lists every screen
in the product, grouped by flow and filterable by role.

## What is here

| | |
|---|---|
| **46 screens** | Sign-up and sign-in · the loan application wizard · the co-borrower invitation flow · loan and virtual card · payments and repayment schedule · profile |
| **23 components** | `src/shared/ui` (used everywhere) and `src/features/*/ui` (feature-specific), each with a Storybook story |
| **116 stories** | Every component state, checkable in light/dark and at stress token sizes |

## The four documents

Read them in this order — they are written to be loaded as AI agent instructions, and they
are the actual source of truth for this repo:

| File | What it answers |
|---|---|
| **[AGENTS.md](AGENTS.md)** | *How* we build. The Designer / Front-end role gate, antd-only, smart vs. dumb components, and the checks that enforce it. Mirrored to `CLAUDE.md` and `.cursorrules`. |
| **[PROJECT.md](PROJECT.md)** | *What* we are building. Roles, the full screen map with route paths, status vocabularies, repayment rules, and the hard constraints. |
| **[DESIGN.md](DESIGN.md)** | *How it should look and feel.* Who the user actually is, the palette and type, the two densities, layouts and component conventions. |
| **[SETUP.md](SETUP.md)** | How the project was scaffolded from an empty folder. |

## Architecture

```text
src/
  app/          Dev only — the router instance and routing logic. Generic: it builds
                the route tree from flows/routes.tsx, so adding a screen never
                touches this folder.
  flows/        Designer — navigable screens on mock data, plus routes.tsx
  shared/ui/    Designer — reusable presentational components
  features/
    <feature>/
      ui/         Designer — feature-specific presentation
      api/        Dev — TanStack Query hooks
      store/      Dev — Zustand
      models/     Dev — Zod schemas
      controllers/ Dev — smart components
  theme/        tokens.ts is the ONLY file allowed to contain a raw hex colour
  stories/      Theme Showcase + Flow Map
```

The seam: a screen in `flows/` receives everything through props and emits callbacks. During
integration a controller feeds it real data — **the screen file itself does not change**.

## Checks

```bash
npm run build            # tsc -b && vite build
npx eslint "src/**/*.{ts,tsx}"
npm run check:showcase   # every antd component is rendered in the Theme Showcase
npm run check:stories    # every UI component has a story
npm run test:showcase    # every demo visible in light/dark × default/stress (needs Storybook running)
```

ESLint enforces the rules rather than documenting them: no data fetching, state or routing
logic in presentation; no hand-rolled elements antd already provides; no hardcoded colours
outside `src/theme/tokens.ts`. Husky runs the lot before each commit, and
`.github/workflows/scope-guard.yml` runs it again in CI — including negative tests that break
each rule on purpose to prove the guard still fires.

`.workflow-mode` holds the current mode (`designer` or `dev`) and decides which folders a
commit may touch. It is a seatbelt, not a lock — see AGENTS.md §10.

## Stack

React 19 · TypeScript · Vite · Ant Design 6 · TanStack Router · TanStack Query · Zustand ·
Zod · Storybook 10 · ESLint 9

---

Built with [Claude Code](https://claude.com/claude-code).
