# antd init pack — v3 (on top of v2 "antd-init-pack-fixed")

v2 made the Theme Showcase **complete** (every antd export, 8 stories, coverage check).
v3 makes sure it **stays** complete after an agent touches it, and that everything on
it is **visible** — in light, dark and with bigger tokens.

## What changed

| Problem seen in v2 (verified on a clean init, antd 6.6.8) | v3 fix |
|---|---|
| Overlays (Modal, Drawer, Tooltip, Popover, Popconfirm, Tour, message, notification, Dropdown, Select/Cascader/TreeSelect/AutoComplete, Date/Range/Time/Color pickers) only visible after a click | Rendered **open** with antd's static panels (as antd's Theme Editor does); the click demos stay too |
| Transfer: "5 items", ~3 visible (fixed height 160) | No fixed height |
| Listy: 3 of 5 rows visible (height 140) | Non-virtual demo shows all rows; a separate virtual demo scrolls on purpose |
| Splitter / Masonry panels overflow by their padding | `box-sizing: border-box` on demo panels |
| FlowMap logs `Alert message is deprecated`; ReadyView uses deprecated `List` | `title`; plain Flex rows |
| No way to see dark mode in Storybook | Toolbar **Theme** (light/dark) + **Density** (default/stress) in a shipped `.storybook/preview.tsx` |
| Check only looked at imports: deleting a demo (keeping one import) stayed green | **Shrink guard**: per-file section/demo/element counts vs `scripts/showcase-baseline.json` |
| `List` allowed to be absent regardless | A deprecated component may be absent only while its **replacement** is rendered |
| Nothing checked that components are visible | `npm run test:showcase` — Playwright, every Showcase story × light/dark × default/stress: console warnings, zero-size demos, overlapping demos, clipped content, collapsed Menu, sideways scroll |
| Project components could have no story | `npm run check:stories` (pre-commit + CI) |
| antd unpinned → testers on different versions | `antd@^6 @ant-design/icons@^6` |
| Agent could edit the checks to get green | Designer-mode commits may not touch `scripts/`, `.github/`, `.husky/`, ESLint config |

Docs: SETUP.md (pin, preview, new scripts, verify steps, "never pass a check by removing what it checks"),
AGENTS.md (rules + enforcement table + required prompt), scope-guard.yml (stories check,
Showcase negative test, smoke test with `storybook dev`).

## Verified on a fresh init
`tsc -b` ✓ · eslint 0 warnings ✓ · check:showcase ✓ (72 exports, 70 shown, 2 deprecated with replacements) ·
check:stories ✓ · build ✓ (no DevBar in dist) · storybook build ✓ (9 stories) ·
test:showcase ✓ (9 stories × 4 modes) · negative tests: deleting one demo, removing Listy,
a component without a story, a fixed-height Transfer, a narrow Menu and a deprecated
Alert prop are all caught.

## Known limits
- The open overlay panels use antd's `_InternalPanelDoNotUseOrYouWillBeFired` API. It is
  what antd's own Theme Editor uses, but may change in a future major — the coverage
  check, tsc and the smoke test will flag it if it does.
- `test:showcase` needs a running Storybook and Chromium (`npx playwright install chromium`).
  CI installs both; locally it's one command.
- Mentions has no static panel (its list opens only after typing "@"); the interactive one covers it.
