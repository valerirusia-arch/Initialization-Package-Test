# SETUP.md – Project initialization (run once, in an empty folder)

This is the bootstrap runbook. A designer drops the guardrail files into an empty folder and tells an AI agent to run this. The agent scaffolds an empty-but-armed React + Ant Design project, incorporating Domain-Driven Design constraints, then stops.

**No product UI is created** — just one readiness screen that confirms the setup and lists what was done.

## For the designer
1. Create an empty folder and drop these files into its root:
   `AGENTS.md`, `SETUP.md`, `check-scope.mjs`, `scope-guard.yml`, `.workflow-mode`,
   `eslint.presentation.js`, `router.tsx`, `routes.tsx`, `flatten.ts`, `DevBar.tsx`,
   `DevBar.styles.ts`, `ReadyView.tsx`, `ReadyView.styles.ts`, `tokens.ts`,
   `ThemeProvider.tsx`, `ThemeContext.ts`, `ThemeShowcase.stories.tsx`,
   `FlowMap.stories.tsx`, `check-showcase-coverage.mjs`, `showcase-baseline.json`,
   `check-stories.mjs`, `smoke-showcase.mjs`, `preview.tsx`, `StoryCanvas.tsx`,
   and the whole `showcase/` folder (the Theme Showcase demos — one file per antd category).
2. Open the folder in Claude Code (or Cursor/Copilot) and send **one** message:
   > Read `SETUP.md` and initialize the project. Do exactly the steps in it, nothing else. Don't build any product UI — end on the readiness screen.
3. Wait. When it finishes, **both servers are running** — the app on `http://localhost:5173` and Storybook on `http://localhost:6006` — and your browser shows **"We're ready to start"** with the checklist. From then on, just describe screens and flows — they get built in Ant Design under `/src/flows`, clickable and navigable on mock data (Design Mode, per `AGENTS.md`).

## For the agent — execute in order

Scaffold **in the current folder** (the guardrail files already here are the policy; wire them in, don't overwrite them). Read `AGENTS.md` first.

> **Three things in this runbook are non-negotiable, because getting them wrong breaks the whole premise:**
> - **Step 7** — the router bridge must be **generic from the start**. Do NOT hardcode an index route. If you do, the designer's first flow forces an `/app` edit, which means a dev-mode commit for work that is purely design. The bridge file is dropped in for you; use it as-is.
> - **Step 9** — the current template ships **oxlint**, not eslint, so you **create** `eslint.config.js` with the standard react-ts baseline (typescript-eslint + react-hooks + react-refresh) and **append** the presentation fragment to it. Those baseline rules must be present, or `--max-warnings=0` is a green check over an empty config. (Step 3 removes oxlint so there's a single linter, not two.)
> - **Step 6** — `ReadyView` goes in `/src/flows`, **not** `/src/app`. The designer's first prompt deletes it, and Design Mode cannot touch `/app`.
>
> **And one rule for the whole run: never make a check pass by removing what it checks.** If a
> Showcase demo throws a warning, a type error or a lint error, fix that demo's API — do not delete
> or trim it, do not add it to `ALLOWED_GAPS`, do not run `--update-baseline`, do not edit a script
> under `scripts/`. A Showcase with fewer components than it shipped with is the exact bug this kit
> exists to prevent ("testers see some components, not all"). If you can't fix it, stop and report.

1. **Scaffold Vite + React + TS.** The folder already has the dropped
   kit files in it, so `npm create vite@latest .` will see a non-empty
   directory, prompt, and — non-interactively — print *"Operation cancelled"*
   and write nothing. **Use the temp-dir route; it is the normal path, not a
   fallback:**
   ```bash
   npm create vite@latest ../_vite-tmp -- --template react-ts
   cp -r ../_vite-tmp/src ../_vite-tmp/public ../_vite-tmp/index.html \
         ../_vite-tmp/vite.config.ts ../_vite-tmp/tsconfig*.json \
         ../_vite-tmp/package.json ../_vite-tmp/.gitignore \
         ../_vite-tmp/.oxlintrc.json .
   rm -rf ../_vite-tmp && npm install
   ```
   Keep the dropped guardrail files untouched.
   > **The current react-ts template ships `oxlint`, not ESLint** — an `.oxlintrc.json` plus a `"lint": "oxlint"` script, and **no `eslint.config.js`**. This kit is ESLint-based (its guardrails *are* ESLint rules), so step 3 removes oxlint and installs the ESLint baseline, and step 9 *creates* `eslint.config.js`. The goal is **one linter**, not two side by side.
   Then **`git init`** if the folder isn't a repo yet — both Husky (step 10) and `check-scope.mjs` (step 11) need one, and they'll fail without it.

2. **Install core dependencies:**
   `npm i antd@^6 @ant-design/icons@^6 zustand @tanstack/react-query @tanstack/react-router zod`.
   **Pinned to the major, not to a version.** Every project gets the latest antd 6.x
   (new components and fixes still arrive), but never a new major by surprise — a
   new major changes APIs under the Showcase and every tester ends up on a different
   one. Moving to v7 is a deliberate kit update, not something `npm i` decides.
   After installing, check what you actually got (`npm ls antd`) and report it on
   the readiness screen.
   - Keep **`antd` and `@ant-design/icons` on the same major** — mismatched majors
     cause build errors (e.g. icons@6 is not compatible with antd@5).
   - **antd v6 requires React 18+** and does **not** need
     `@ant-design/v5-patch-for-react-19` — don't install it; remove it if present.
   - If the installed major is **newer than v6**, don't assume these notes still
     hold: check antd's migration guide for that major, and expect the Theme
     Showcase to surface any removed APIs immediately (that's its job).

3. **Install dev tooling:** `npm i -D husky lint-staged concurrently eslint-plugin-react`.
   - `concurrently` — step 11 runs the app and Storybook together.
   - `eslint-plugin-react` — step 9's `react/forbid-elements` needs it. This is what
     makes "antd-only" an actual rule instead of a note in a README.

   **Consolidate to one linter — remove oxlint, add the ESLint baseline.** The
   scaffold shipped oxlint; the guardrails are ESLint rules, so keeping both is
   just dead config side by side. Do this here:
   - Delete `.oxlintrc.json`, remove `oxlint` from `devDependencies`, and drop the
     `"lint": "oxlint"` script from `package.json` (step 10 wires the real lint scripts).
   - Install the ESLint baseline the template no longer provides — the same stack the
     old react-ts template used to ship, which step 9 builds on:
     `npm i -D eslint@9 @eslint/js@9 typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals`.

   > **The `@9` pins are load-bearing — do not drop them to get "the latest".**
   > `eslint-plugin-react` (installed just above, for `react/forbid-elements`)
   > peers at `eslint@^3 || … || ^9.7`. Unpinned, npm resolves `eslint@10`, and
   > the install dies with `ERESOLVE could not resolve` before a single file is
   > written. `typescript-eslint` already accepts ESLint 10, so the react plugin
   > is the sole constraint — when it ships v10 support, both pins can go.
   > Do **not** work around this with `--force` or `--legacy-peer-deps`; you'd be
   > running the guardrail plugin against a major it doesn't support.
   - **Leave `typescript` alone.** The template pins `~6.0.2`, and
     `typescript-eslint` peers `>=4.8.4 <6.1.0`. An opportunistic
     `npm i -D typescript@latest` resolves to 7.x and every later install
     ERESOLVEs.

4. **Install Storybook:** `npx storybook@latest init --no-dev --yes --disable-telemetry`
   (step 11 launches it properly).
   > **`--no-dev`, not `--no-start`.** Storybook 10 renamed the flag; the old one
   > exits with `error: unknown option '--no-start'` and installs nothing.
   >
   > **Storybook 10 detects TanStack Router and installs
   > `@storybook/tanstack-react`,** not `@storybook/react-vite` — the generated
   > `.storybook/main.ts` and `preview.tsx` both reference it. That's fine: leave
   > `main.ts` alone. `@storybook/react-vite` still resolves (it's a dependency of
   > the tanstack framework), so the two dropped story files and the preview
   > decorator keep working. If a future major stops shipping it transitively,
   > change the type-only imports in `preview.tsx`, `ThemeShowcase.stories.tsx`
   > and `FlowMap.stories.tsx` to `@storybook/tanstack-react` — **all three, or
   > none.**
   Then **move the shipped `preview.tsx` and `StoryCanvas.tsx` into `.storybook/`**,
   replacing the `preview.tsx` Storybook generated (don't merge, don't rewrite). It
   renders every story under the real theme (`ThemeProvider`) and adds two toolbar
   switches: **Theme** (light / dark) and **Density** (default / stress — bigger font,
   control height and radius, to expose fixed sizes that clip). Both also work from the
   URL (`&globals=theme:dark;density:stress`), which the smoke test in step 11 uses.
   Delete Storybook's generated example stories (`src/stories/*` **and**
   `src/stories/assets/`) — but keep the folder; the dropped stories move in at
   step 5.
   Check that the `playwright` package is in devDependencies (Storybook's vitest addon
   usually adds it; if not, `npm i -D playwright`) and run `npx playwright install chromium`
   once — step 11's smoke test drives a real browser. If the browser download is blocked
   on this machine, say so in the report; CI installs it on its own.

5. **Create the DDD folder structure** under `/src` and file the dropped files into it:
   ```text
   /app
     router.tsx   (Dev: router instance + the bridge that consumes /flows.
                   ReadyView is NOT here — see step 6.)
   /flows
     routes.tsx   (Designer: declarative route tree. ReadyView pre-registered at "/".)
     /_ready
       ReadyView.tsx         (Designer-owned: the init status screen. Deleted on first real flow.)
       ReadyView.styles.ts   (its co-located style objects)
     /_devbar
       DevBar.tsx            (dev-only nav bar, reads routes.tsx)
       DevBar.styles.ts      (its co-located style objects)
       flatten.ts            (shared tree-flattening; DevBar + Flow Map both use it)
     (Designer: navigable user-flows on mock data live here — route-group folders)
   /features
     (empty — smart controllers and business logic live here later)
   /shared
     /ui (empty — shared dumb presentation lives here later)
   /theme
     tokens.ts           (shipped: the theme object. ONLY file allowed raw hex.)
     ThemeProvider.tsx   (shipped: ConfigProvider wrapper. Component only.)
     ThemeContext.ts     (shipped: light/dark context + useThemeControls hook.
                          Separate file because react-refresh/only-export-
                          components bans a component + a function in one file.)
   /stories
     ThemeShowcase.stories.tsx, FlowMap.stories.tsx
     /showcase           (the Theme Showcase demos, one file per antd category.
                          Every antd component must be rendered somewhere in
                          here — `npm run check:showcase` enforces it.)
   ```
   Moves — **do not rewrite these files, just move them**:
   - `routes.tsx` → `src/flows/routes.tsx`
   - `ReadyView.tsx`, `ReadyView.styles.ts` → `src/flows/_ready/`
   - `DevBar.tsx`, `DevBar.styles.ts` → `src/flows/_devbar/`
   - `flatten.ts` → `src/flows/_devbar/flatten.ts`
   - `router.tsx` → `src/app/router.tsx`
   - `tokens.ts`, `ThemeProvider.tsx`, `ThemeContext.ts` → `src/theme/`
   - `ThemeShowcase.stories.tsx`, `FlowMap.stories.tsx` → `src/stories/`
   - the `showcase/` folder → `src/stories/showcase/` (move the folder as a whole)

   > **The theme files are SHIPPED — move them, do not write them.** Earlier
   > versions of this kit described `tokens.ts` and `ThemeProvider.tsx` in prose
   > and let you generate them. They are imported by `/app/router.tsx` and
   > `.storybook/preview.tsx`, so an improvised version is the single
   > highest-leverage thing that can go quietly wrong during init — typically by
   > dropping the light/dark plumbing, after which the DevBar's theme toggle
   > just doesn't appear and nothing says why. `ThemeProvider` also exports
   > `useThemeControls`, which step 7 uses.

6. **The readiness screen is already placed and already wired.** `ReadyView.tsx` moved to `src/flows/_ready/` in step 5, and `src/flows/routes.tsx` already registers it as the `/` route. Nothing else to do — the router in step 7 picks it up generically, like any other flow.
   - Update its `"Ant Design + @ant-design/icons"` checklist entry to include the version actually installed (e.g. `"Ant Design 6.5.1 + @ant-design/icons"`), so the designer can see at a glance which major this project is on. That's the only edit.
   - **It lives in `/flows` deliberately.** `/app` is dev-owned and off-limits in Design Mode; if ReadyView lived there, the designer's first act — replacing it — would trip the scope guard on day one.

7. **Wire the app to the router bridge.** `src/app/router.tsx` was dropped in at step 5 and is **already generic** — it recursively converts `flows/routes.tsx` into TanStack routes, translates `:id` → `$id`, and mounts `ThemeProvider` → `DevBar` → `<Outlet/>` at the root. **Do not simplify it to a hardcoded index route.** That one shortcut is what forces a dev-mode `/app` commit the moment the designer adds their first screen.

   Your job here is only to connect it:
   - Delete the Vite demo markup, logos, `App.css`, and `index.css` defaults. `App.tsx` can go entirely.
   - Rewrite `src/main.tsx`:
     ```tsx
     import { StrictMode } from "react";
     import { createRoot } from "react-dom/client";
     import { RouterProvider } from "@tanstack/react-router";
     import { router } from "./app/router";

     createRoot(document.getElementById("root")!).render(
       <StrictMode>
         <RouterProvider router={router} />
       </StrictMode>
     );
     ```
   - **Optional — enable the DevBar's theme toggle.** `ThemeProvider` owns the
     light/dark state; `useThemeControls()` in `src/theme/ThemeContext.ts`
     exposes it. The DevBar's theme button only renders when `onToggleTheme` is
     passed, so it's off until you wire it. Add a wrapper **in a new file** —
     e.g. `src/flows/_devbar/DevBarWithTheme.tsx`:
     ```tsx
     import { useThemeControls } from "../../theme/ThemeContext";
     import DevBar from "./DevBar";

     export default function DevBarWithTheme() {
       const { isDark, toggleTheme } = useThemeControls();
       return <DevBar isDark={isDark} onToggleTheme={toggleTheme} />;
     }
     ```
     then swap `<DevBar />` for `<DevBarWithTheme />` in `router.tsx`. It must
     be a **child** of `<ThemeProvider>` to see the context, and it must be its
     own file — declaring it inside `router.tsx` puts a component next to that
     file's `router` export and trips `react-refresh/only-export-components`.

   This is the router **shell**, not routing logic: no loaders, no guards, no data. Dev extends it during integration. Mounting the DevBar here is the one-time step that touches dev-owned `/app`, done now so designers never need to.

8. **File the guardrails into place:**
   - move `check-scope.mjs` → `scripts/check-scope.mjs`
   - move `check-showcase-coverage.mjs`, `showcase-baseline.json`, `check-stories.mjs`
     and `smoke-showcase.mjs` → `scripts/`
   - move `scope-guard.yml` → `.github/workflows/scope-guard.yml`
   - leave `AGENTS.md`, `.workflow-mode` and `eslint.presentation.js` at root.
   - symlink or copy `AGENTS.md` to `.cursorrules` and `CLAUDE.md`.

9. **Create the ESLint config — baseline first, then APPEND the fragment.** The current template ships **no** `eslint.config.js` (it uses oxlint, removed in step 3), so write one with the standard react-ts baseline — `js.configs.recommended`, `typescript-eslint`, `react-hooks`, `react-refresh` — and add the dropped `eslint.presentation.js` fragment (antd-only, tokens-not-hex, no-logic-in-presentation) at the **end**:
   ```js
   // eslint.config.js
   import js from "@eslint/js";
   import globals from "globals";
   import reactHooks from "eslint-plugin-react-hooks";
   import reactRefresh from "eslint-plugin-react-refresh";
   import tseslint from "typescript-eslint";
   import { globalIgnores } from "eslint/config";
   import { presentationRules } from "./eslint.presentation.js";

   export default tseslint.config([
     globalIgnores(["dist", "storybook-static"]),
     {
       files: ["**/*.{ts,tsx}"],
       extends: [
         js.configs.recommended,
         tseslint.configs.recommended,
         reactHooks.configs.flat["recommended-latest"],  // .flat is REQUIRED — see note below
         reactRefresh.configs.vite,
       ],
       languageOptions: { ecmaVersion: 2020, globals: globals.browser },
     },
     ...presentationRules,   // last, so its bans win any conflict
   ]);
   ```
   Order matters: `presentationRules` last. This is the same baseline the old
   react-ts template used to ship — you're recreating it, then extending it, so
   nothing else about the kit changes.

   > **`reactHooks.configs.flat["recommended-latest"]`, not
   > `reactHooks.configs["recommended-latest"]`.** `eslint-plugin-react-hooks`
   > still exports a legacy eslintrc object at the non-`.flat` path, with
   > `plugins` as an array of strings. Flat config rejects that shape and ESLint
   > refuses to start at all — you get *"A config object has a `plugins` key
   > defined as an array of strings"* and zero files linted. Not a warning, a
   > hard stop, so it takes the whole init down with it.
   **Sanity check before moving on:** `npx eslint --print-config src/flows/routes.tsx`
   must list `react-hooks/rules-of-hooks` **and** `react/forbid-elements`. If either
   is missing, the baseline didn't take — go back.

10. **Wire package.json for scripts, Husky & lint-staged:**
    - Replace the `dev` script so **both servers come up together** — Storybook isn't optional, the DevBar links straight into it:
      ```json
      "scripts": {
        "dev": "concurrently -k -n app,storybook -c cyan,magenta \"npm:dev:app\" \"npm:dev:storybook\"",
        "dev:app": "vite",
        "dev:storybook": "storybook dev -p 6006 --no-open",
        "check:showcase": "node scripts/check-showcase-coverage.mjs",
        "check:stories": "node scripts/check-stories.mjs",
        "test:showcase": "node scripts/smoke-showcase.mjs",
        "prepare": "husky"
      }
      ```
      (`-k` kills both when one dies, so Ctrl-C actually stops everything.)
    - Add to package.json: `"lint-staged": { "src/{shared/ui,features/*/ui,flows,theme,stories}/**/*.{ts,tsx}": ["eslint --max-warnings=0"] }`
    - run `npm run prepare` (or `npx husky init`)
    - create `.husky/pre-commit` containing:
      ```bash
      npx lint-staged
      node scripts/check-scope.mjs
      node scripts/check-showcase-coverage.mjs
      node scripts/check-stories.mjs
      ```

11. **Verify, then launch:**
    - `npx tsc -b --noEmit` passes.
      > **`-b` is mandatory. `npx tsc --noEmit` type-checks NOTHING here.** The
      > Vite react-ts template's root `tsconfig.json` is a solution file —
      > `"files": []` plus `references` to `tsconfig.app.json` and
      > `tsconfig.node.json`. Without `-b`, tsc reads the root config, finds an
      > empty file list, and exits 0 having compiled zero files. Verified: with
      > `const bad: number = "definitely a string"` in `src/main.tsx`,
      > `npx tsc --noEmit` exits **0** and `npx tsc -b --noEmit` exits **2** with
      > the TS2322. This is why `npm run build` is `tsc -b && vite build` — the
      > build was always right; only the verify step was wrong.
    - `npx eslint "src/**/*.{ts,tsx}"` passes with zero warnings.
      (`@typescript-eslint/no-unused-vars` is an **error** in this baseline. If you
      added a component to an import list in a `src/stories/showcase/` file without
      rendering it, this is where init stops.)
    - `node scripts/check-scope.mjs` passes (mode is `designer`; no forbidden paths touched yet).
    - `npm run check:showcase` passes — **every component antd exports is rendered in
      the Theme Showcase** (it asks the *installed* antd, so it stays correct as antd
      ships new components). If it fails, the installed antd is newer than the kit:
      render each listed component in the matching `src/stories/showcase/Showcase*.tsx`
      file. **Do not delete demos to make room, do not trim the Showcase to fix a
      lint/type error, and do not add a component to `ALLOWED_GAPS` just to get green** —
      only a deprecated component (with its replacement shown) or a non-visual export
      belongs there, with a reason. This is the check that guarantees designers see
      *all* components, so it must pass for real. It also fails if the Showcase got
      **smaller** than `scripts/showcase-baseline.json` — that means a demo was deleted.
    - `npm run check:stories` passes (nothing to check yet — it guards the designer's
      future components in `shared/ui` and `features/*/ui`).
    - `npm run build` succeeds, and the DevBar is **absent from the production
      bundle**: `grep -r "Jump to screen" dist/` returns nothing. The dev-only
      split is a claim until something checks it.
    - `npx storybook build` succeeds. Confirm the generated story IDs in
      `storybook-static/index.json` include `system-flow-map--all-flows` — that
      exact string is hardcoded in the DevBar.
    - `npm run dev` — **leave it running.** Confirm **both** are actually up before reporting:
      - app responds at `http://localhost:5173` and renders the readiness screen
      - Storybook responds at `http://localhost:6006`
      - the **Theme Showcase → All Components** story renders, and the sidebar lists the
        seven category stories under it (General, Layout, Navigation, Data Entry, Data
        Display, Feedback, Other) — check `storybook-static/index.json` has 8 entries
        under `system-theme-showcase--`
      - the **Flow Map** story renders at `/?path=/story/system-flow-map--all-flows` — this is the exact URL the DevBar's "Flow map" button opens. If it 404s, the story's `title`/export name drifted; fix it, don't ship a dead button.
      - with Storybook still running, `npm run test:showcase` passes. It opens every
        Showcase story in light, dark, and both again with stress tokens, and fails on any
        console warning (antd deprecations only show in dev), any demo with no visible
        box, any clipped content, a collapsed horizontal Menu, or a page that scrolls
        sideways. **Fix the demo the message names — never delete it.**
    - Click the DevBar's **Storybook** and **Flow map** buttons once. Both must land on a real page.

## Definition of done
- App compiles, `tsc -b --noEmit` and `eslint` are clean, and **both** dev servers are running (5173 + 6006).
- `npm run build` and `npx storybook build` both succeed, and `dist/` contains no DevBar strings.
- Browser shows **only** the readiness screen ("We're ready to start" + checklist).
- Storybook shows the **Theme Showcase** (an "All Components" page plus one story per category) and the **Flow Map**, and both DevBar buttons reach them.
- **`npm run check:showcase` passes: every antd component is rendered in the Theme Showcase** — nothing was deleted or allow-listed to get there, and the Showcase is not smaller than its baseline.
- **`npm run test:showcase` passes: every demo is visible** in light, dark and stress modes, with a clean console (or the report says Chromium couldn't be installed here).
- Storybook's toolbar shows the **Theme** and **Density** switches.
- `antd` and `@ant-design/icons` are on `^6` in package.json.
- `eslint --print-config` proves react-hooks and react/forbid-elements are both live.
- **One linter:** the scaffold's oxlint is gone — no `.oxlintrc.json`, no `oxlint` dep or `oxlint` script — and `eslint.config.js` is the single source of lint rules.
- `src/app/router.tsx` builds its tree from `flows/routes.tsx` generically — grep it for hardcoded screen paths; there should be none.
- No product components, forms, or features exist yet.
- `.workflow-mode` is `designer`; guardrails (ESLint, pre-commit, CI) are armed against modifying `api/`, `controllers/`, `store/`, `models/`, `app/`, and the guards themselves (`scripts/`, `.github/`, `.husky/`, the ESLint config).
- Report the checklist of what was installed/created and **both** URLs, then stop and wait for the designer's first screen prompt.
