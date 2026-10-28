// eslint.presentation.js
//
// The Design-in-Code guardrails, as a flat-config FRAGMENT.
//
// This file is APPENDED to the eslint.config.js that SETUP creates — it never
// replaces it. Heads up: the current Vite react-ts template ships oxlint (an
// .oxlintrc.json), NOT eslint, so SETUP removes oxlint and installs the eslint
// baseline (typescript-eslint + react-hooks + react-refresh) this fragment sits
// on top of. Those baseline rules must survive: react-hooks is what catches
// conditional-hook bugs, and `--max-warnings=0` against a config with no real
// rules is a green check that means nothing.
//
// Wiring (see SETUP.md step 9):
//   import { presentationRules } from "./eslint.presentation.js";
//   export default defineConfig([ ...existing, ...presentationRules ]);
//
// Requires: npm i -D eslint-plugin-react
// Requires ESLint 9 — eslint-plugin-react peers at <=9.x, so SETUP pins it.
//
// ONE RULE, ONE PLACE: flat config replaces rule options rather than merging
// them, so every `no-restricted-imports` ban in this kit lives in the single
// RESTRICTED_IMPORTS object below. A second entry for the same glob would
// silently delete the first.

import react from "eslint-plugin-react";

/** Everything a designer owns. Kept in one place — also mirrored in lint-staged. */
const PRESENTATION = [
  "src/shared/ui/**/*.{ts,tsx}",
  "src/features/*/ui/**/*.{ts,tsx}",
  "src/flows/**/*.{ts,tsx}",
  "src/theme/**/*.{ts,tsx}",
  "src/stories/**/*.{ts,tsx}",
];

/**
 * antd already ships all of these. Hand-rolling them is the exact thing this
 * kit exists to prevent, so it's an error, not a code-review conversation.
 *
 * `div` and `span` are deliberately NOT here — they're the layout escape hatch
 * (position: fixed wrappers, spacers). Prefer antd `Flex` / `Space`; reach for
 * a bare div only when there's genuinely nothing to compose.
 */
const HAND_ROLLED = [
  { element: "button", message: "Use antd <Button>." },
  { element: "input", message: "Use antd <Input> / <InputNumber> / <Checkbox> / <Radio>." },
  { element: "select", message: "Use antd <Select>." },
  { element: "textarea", message: "Use antd <Input.TextArea>." },
  { element: "form", message: "Use antd <Form>." },
  { element: "label", message: "Use antd <Form.Item label=...>." },
  { element: "table", message: "Use antd <Table>." },
  { element: "thead", message: "Use antd <Table>." },
  { element: "tbody", message: "Use antd <Table>." },
  { element: "tfoot", message: "Use antd <Table>." },
  { element: "tr", message: "Use antd <Table>." },
  { element: "td", message: "Use antd <Table>." },
  { element: "th", message: "Use antd <Table>." },
  { element: "ul", message: "Use antd <List>." },
  { element: "ol", message: "Use antd <List>." },
  { element: "li", message: "Use antd <List.Item>." },
  { element: "dl", message: "Use antd <Descriptions>." },
  { element: "h1", message: "Use antd <Typography.Title level={1}>." },
  { element: "h2", message: "Use antd <Typography.Title level={2}>." },
  { element: "h3", message: "Use antd <Typography.Title level={3}>." },
  { element: "h4", message: "Use antd <Typography.Title level={4}>." },
  { element: "h5", message: "Use antd <Typography.Title level={5}>." },
  { element: "h6", message: "Use antd <Typography.Title level={5}>." },
  { element: "p", message: "Use antd <Typography.Paragraph>." },
  { element: "a", message: "Use antd <Typography.Link> / <Button href>, or router <Link> for in-app nav." },
  { element: "img", message: "Use antd <Image> / <Avatar>." },
  { element: "hr", message: "Use antd <Divider>." },
  { element: "progress", message: "Use antd <Progress>." },
  { element: "dialog", message: "Use antd <Modal> / <Drawer>." },
];

/**
 * EVERY import ban in this kit, in ONE rule entry.
 *
 * This is not a style choice — it's a correctness requirement. ESLint flat
 * config does not merge rule options: when two config objects match the same
 * file and both set `no-restricted-imports`, the LAST one silently replaces the
 * first. The original version of this file split these bans across two blocks
 * over the same PRESENTATION glob, so the antd-only payload erased the
 * no-logic payload and a flow screen could import axios / zustand /
 * @tanstack/react-query with zero errors.
 *
 * If you add a ban, add it HERE. Never add a second `no-restricted-imports`
 * entry for the PRESENTATION glob anywhere in this file.
 */
const RESTRICTED_IMPORTS = {
  paths: [
    // --- no logic in presentation: data arrives via Props, actions via Callbacks
    { name: "axios", message: "No data fetching in presentation. Use Props." },
    { name: "@tanstack/react-query", message: "No React Query in presentation. Use Props." },
    { name: "zustand", message: "No global state in presentation." },
    { name: "zustand/react", message: "No global state in presentation." },
    { name: "zod", message: "Models are dev-owned. A UI component owns its own Props interface." },
    // Navigation is allowed (Link / useNavigate / useParams). Routing LOGIC is not.
    {
      name: "@tanstack/react-router",
      importNames: ["redirect", "useLoaderData", "createRoute", "createRootRoute", "createRouter", "createFileRoute"],
      message: "Navigation only: Link / useNavigate / useParams. Loaders, guards and route wiring live in /app.",
    },
    // --- antd-only: one component library, one styling system
    { name: "styled-components", message: "antd-only: theme via ConfigProvider tokens (/src/theme), not CSS-in-JS." },
    { name: "@emotion/react", message: "antd-only: theme via ConfigProvider tokens (/src/theme)." },
    { name: "@emotion/styled", message: "antd-only: theme via ConfigProvider tokens (/src/theme)." },
    { name: "@stitches/react", message: "antd-only: theme via ConfigProvider tokens (/src/theme)." },
  ],
  // gitignore-style: `**/` so it catches deep + aliased imports, not just siblings.
  patterns: [
    {
      group: [
        "**/api", "**/api/**",
        "**/store", "**/store/**",
        "**/controllers", "**/controllers/**",
        "**/models", "**/models/**",
        "**/app", "**/app/**",
      ],
      message: "UI/flows cannot import from smart layers. Data comes in via Props.",
    },
    { group: ["*.module.css", "*.module.scss", "*.module.less"], message: "antd-only: no CSS modules. Use theme tokens + antd's own style props." },
    { group: ["bootstrap", "bootstrap/**", "@mui/**", "@chakra-ui/**", "react-bootstrap"], message: "antd-only: one component library. Compose from Ant Design." },
  ],
};

export const presentationRules = [
  // ---------------------------------------------------------------------------
  // 1. No logic in presentation + one component library.
  //    Both live here because they share a rule name — see RESTRICTED_IMPORTS.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/no-logic-in-presentation",
    files: PRESENTATION,
    rules: {
      "no-restricted-imports": ["error", RESTRICTED_IMPORTS],
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "No fetch() in presentation." },
        { name: "XMLHttpRequest", message: "No network calls in presentation." },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // 2. antd-only, element half. Import bans for this block are in
  //    RESTRICTED_IMPORTS above — do NOT re-declare no-restricted-imports here.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/antd-only",
    files: PRESENTATION,
    plugins: { react },
    rules: {
      "react/forbid-elements": ["error", { forbid: HAND_ROLLED }],
    },
  },

  // ---------------------------------------------------------------------------
  // 3. Tokens, not hex. tokens.ts is the one place raw colors are allowed.
  // ---------------------------------------------------------------------------
  {
    name: "design-in-code/tokens-not-hardcoded-colors",
    files: PRESENTATION,
    ignores: ["src/theme/tokens.ts"],
    rules: {
      "no-restricted-syntax": ["error", {
        selector: "Literal[value=/^#(?:[0-9a-fA-F]{3,4}){1,2}$/]",
        message: "No hardcoded colors. Read from theme.useToken(), or add it to /src/theme/tokens.ts.",
      }],
    },
  },
];

export default presentationRules;
