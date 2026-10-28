// scripts/check-showcase-coverage.mjs
//
// Fails if the Theme Showcase does not render every antd component.
//
// WHY THIS EXISTS. The Showcase used to be one hand-written page, and nothing
// checked that it was complete — the only "done" check was "the story renders",
// which an incomplete page passes. antd also ships new components in minor
// releases (6.6 added Masonry, BorderBeam, Listy), so a hand-kept list drifts
// the moment someone runs `npm update`. This script closes that gap: it asks the
// INSTALLED antd what it exports and compares that with what the Showcase
// imports. No list to maintain — the only exceptions are in ALLOWED_GAPS below.
//
// "Covered" means: imported from "antd" in a file under src/stories/showcase/.
// ESLint's no-unused-vars (an error in this kit) guarantees an import is also
// rendered, so import == rendered.
//
// It ALSO refuses to let the Showcase shrink. An agent that meets a warning or a
// lint error is tempted to delete the demo that caused it — that is exactly how
// projects ended up showing "some components, not all". So the number of
// sections, demos and component elements in each file is compared with
// scripts/showcase-baseline.json: growing is fine, shrinking fails.
//
// Usage:
//   node scripts/check-showcase-coverage.mjs                    # the check
//   node scripts/check-showcase-coverage.mjs --update-baseline  # HUMAN decision only:
//        records the current counts as the new floor (e.g. after a deliberate
//        redesign of the Showcase). An agent must never run this to get green.
//
// SHOWCASE_DIR / SHOWCASE_BASELINE env vars exist for CI's negative tests.

import { createRequire } from "node:module";
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const SHOWCASE_DIR = process.env.SHOWCASE_DIR || "src/stories/showcase";
const BASELINE_FILE = process.env.SHOWCASE_BASELINE || "scripts/showcase-baseline.json";

/**
 * The ONLY components allowed to be absent, each with a reason. This is not a
 * pressure valve: a new antd component that is missing from the Showcase means
 * "render it", not "add it here". Legitimate entries are deprecated components
 * with a replacement already shown, or exports that are not visual components.
 */
const ALLOWED_GAPS = {
  BackTop: { replacement: "FloatButton", reason: "deprecated; FloatButton.BackTop is shown instead (ShowcaseGeneral)" },
  List: { replacement: "Listy", reason: "deprecated since antd 6.6; Listy is shown instead (ShowcaseDataDisplay)" },
};
// Every allowed gap MUST name a replacement that is itself rendered. Removing
// the replacement fails the check — "deprecated" is never a reason to show nothing.

const require = createRequire(join(process.cwd(), "package.json"));

let antd, antdVersion;
try {
  antd = require("antd");
  antdVersion = require("antd/package.json").version;
} catch {
  console.error("\n✖ coverage check could not run: `antd` is not installed (run npm install).\n");
  process.exit(1);
}

if (!existsSync(SHOWCASE_DIR)) {
  console.error(`\n✖ coverage check could not run: ${SHOWCASE_DIR}/ does not exist.\n`);
  process.exit(1);
}

// Every PascalCase export is a component (or a component namespace like Grid,
// Typography, ConfigProvider). Hooks, `theme`, `version`, etc. are lowercase.
const components = Object.keys(antd).filter((k) => /^[A-Z]/.test(k)).sort();

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : /\.tsx?$/.test(name) ? [full] : [];
  });
}

const imported = new Set();
for (const file of walk(SHOWCASE_DIR)) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["']antd["']/g)) {
    for (const part of m[1].split(",")) {
      const name = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0].trim();
      if (name) imported.add(name);
    }
  }
}

const missing = components.filter((c) => !imported.has(c) && !(c in ALLOWED_GAPS));
const gapWithoutReplacement = Object.entries(ALLOWED_GAPS)
  .filter(([c, g]) => components.includes(c) && !imported.has(c) && !imported.has(g.replacement))
  .map(([c, g]) => `${c} (its replacement ${g.replacement} is not rendered either)`);
const stale = Object.keys(ALLOWED_GAPS).filter((c) => !components.includes(c) || imported.has(c));
const allowed = Object.keys(ALLOWED_GAPS).filter((c) => components.includes(c) && !imported.has(c));

console.log(`antd ${antdVersion}: ${components.length} components, ${components.length - missing.length - allowed.length} shown, ${allowed.length} allowed gaps.`);

if (stale.length) {
  console.warn(
    "\n! ALLOWED_GAPS has entries that are no longer needed (removed from antd, or now shown):\n" +
      stale.map((c) => `    ${c}`).join("\n") +
      "\n  Remove them from scripts/check-showcase-coverage.mjs.\n"
  );
}

if (missing.length) {
  console.error(
    `\n✖ The Theme Showcase is missing ${missing.length} antd component(s):\n` +
      missing.map((c) => `    ${c}`).join("\n") +
      `\n\n  Render each one in the matching category file under ${SHOWCASE_DIR}/ ` +
      "(ShowcaseGeneral, Layout, Navigation, DataEntry, DataDisplay, Feedback, Other)\n" +
      "  and import it from \"antd\" there. Do NOT delete other demos to make room, and do NOT add\n" +
      "  a component to ALLOWED_GAPS just to go green — only deprecated or non-visual exports belong\n" +
      "  there, with a reason.\n"
  );
  process.exit(1);
}

if (gapWithoutReplacement.length) {
  console.error(
    "\n✖ A deprecated component is allowed to be absent only while its replacement is shown:\n" +
      gapWithoutReplacement.map((c) => `    ${c}`).join("\n") +
      "\n\n  Render the replacement. Deleting both is how a Showcase quietly loses components.\n"
  );
  process.exit(1);
}

console.log("✓ every antd component is rendered in the Theme Showcase");

// ---------------------------------------------------------------------------
// Shrink guard: the Showcase may grow, never shrink.
// ---------------------------------------------------------------------------
function countFile(src) {
  return {
    sections: (src.match(/<Section\b/g) || []).length,
    demos: (src.match(/<Demo\b/g) || []).length,
    // every JSX element whose name starts with a capital: antd components,
    // sub-components (Card.Meta), panels. A rough but stable size measure.
    elements: (src.match(/<[A-Z][\w.]*[\s/>]/g) || []).length,
  };
}
const current = {};
for (const file of walk(SHOWCASE_DIR).filter((f) => f.endsWith(".tsx"))) {
  current[basename(file)] = countFile(readFileSync(file, "utf8"));
}

if (process.argv.includes("--update-baseline")) {
  writeFileSync(BASELINE_FILE, JSON.stringify({ note: "Floor for scripts/check-showcase-coverage.mjs. Raise it, never lower it to get green.", antd: antdVersion, files: current }, null, 2) + "\n");
  console.log(`✓ baseline written to ${BASELINE_FILE}`);
  process.exit(0);
}

if (!existsSync(BASELINE_FILE)) {
  console.error(`\n✖ ${BASELINE_FILE} is missing. It ships with the kit — restore it, don't regenerate it to get green.\n`);
  process.exit(1);
}
const baseline = JSON.parse(readFileSync(BASELINE_FILE, "utf8")).files || {};
const shrunk = [];
for (const [file, floor] of Object.entries(baseline)) {
  const now = current[file];
  if (!now) {
    shrunk.push(`${file}: file is gone`);
    continue;
  }
  for (const k of Object.keys(floor)) {
    if (now[k] < floor[k]) shrunk.push(`${file}: ${k} ${floor[k]} → ${now[k]}`);
  }
}
if (shrunk.length) {
  console.error(
    "\n✖ The Theme Showcase got smaller than its baseline:\n" +
      shrunk.map((s) => `    ${s}`).join("\n") +
      "\n\n  Demos were deleted. Put them back — if one breaks on a new antd, update its API\n" +
      "  (the warning names the replacement prop), don't remove it. Only a human may lower the\n" +
      "  floor, with --update-baseline, as a reviewed change.\n"
  );
  process.exit(1);
}
console.log(`✓ the Showcase has not shrunk (${Object.keys(current).length} files checked against ${BASELINE_FILE})`);
