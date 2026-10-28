// scripts/check-stories.mjs
//
// Every presentational component the designer builds must have a story, or it
// is invisible in Storybook — testers then see "some components, not all".
//
// Rule: a PascalCase component file in src/shared/ui/ or src/features/*/ui/
// (e.g. LoanCard.tsx) needs a sibling story (LoanCard.stories.tsx).
// Styles, stories, tests, index files and lowercase helpers are skipped.
//
// Runs in the pre-commit hook and in CI. Usage: node scripts/check-stories.mjs

import { existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const ROOTS = ["src/shared/ui"];
if (existsSync("src/features")) {
  for (const f of readdirSync("src/features")) {
    const ui = join("src/features", f, "ui");
    if (existsSync(ui) && statSync(ui).isDirectory()) ROOTS.push(ui);
  }
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const isComponentFile = (f) => {
  const name = basename(f);
  return (
    /^[A-Z][A-Za-z0-9]*\.tsx$/.test(name) &&
    !/\.(stories|styles|test|spec)\.tsx$/.test(name)
  );
};

const files = ROOTS.flatMap(walk).filter(isComponentFile);
const missing = files.filter((f) => !existsSync(join(dirname(f), basename(f, ".tsx") + ".stories.tsx")));

if (missing.length) {
  console.error(
    `\n✖ ${missing.length} component(s) have no story, so they won't appear in Storybook:\n` +
      missing.map((f) => `    ${f}  →  add ${basename(f, ".tsx")}.stories.tsx next to it`).join("\n") +
      "\n\n  One story per meaningful state (default, empty, loading, error, disabled…), with mock props.\n"
  );
  process.exit(1);
}
console.log(`✓ every UI component has a story (${files.length} checked)`);
