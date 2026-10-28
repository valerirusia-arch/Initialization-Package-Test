// scripts/smoke-showcase.mjs
//
// Opens every Theme Showcase story (and the Flow Map) in a real browser and
// fails if a designer would NOT be able to see something:
//
//   1. console errors / warnings  — antd prints deprecation warnings here, but
//                                   only in dev, which is why this runs against
//                                   `storybook dev`, not the static build.
//   2. empty, zero-size or overlapping demos — every demo inside a Showcase
//                                   section must have a visible box of its own.
//   3. clipped content            — a box whose content is taller/wider than the
//                                   box itself (fixed heights, fixed widths).
//   4. a collapsed horizontal Menu ("Nav one ···").
//   5. horizontal page overflow.
//
// It runs every story in 4 modes: light / dark × default tokens / stress tokens
// (the Theme and Density toolbars in .storybook/preview.tsx). The stress mode is
// what catches "looks fine until someone changes a token".
//
// WHY: `check:showcase` proves every component is ON the page. This proves it
// is VISIBLE on the page. The two together are the definition of "testers see
// every component".
//
// Usage:
//   npm run dev:storybook            # in another terminal (or `npm run dev`)
//   npm run test:showcase            # = node scripts/smoke-showcase.mjs
//   node scripts/smoke-showcase.mjs http://localhost:6006
//
// Needs Playwright's Chromium once per machine: `npx playwright install chromium`.

import { createRequire } from "node:module";
import { join } from "node:path";

const BASE = (process.argv[2] || process.env.STORYBOOK_URL || "http://localhost:6006").replace(/\/$/, "");
const MODES = [
  { name: "light", globals: "theme:light;density:default" },
  { name: "dark", globals: "theme:dark;density:default" },
  { name: "light+stress", globals: "theme:light;density:stress" },
  { name: "dark+stress", globals: "theme:dark;density:stress" },
];

/**
 * antd internals that overflow ON PURPOSE (half-stars, switch labels sliding,
 * carousel tracks, popup arrows, time columns that scroll…). Matching is by
 * class prefix on the element itself or any ancestor. Add here only after
 * checking the component looks right — never to silence a real clip.
 */
const INTENTIONAL_OVERFLOW = [
  "ant-rate-star",
  "ant-switch-inner",
  "ant-input-number-action",
  "ant-picker-time-panel-column",
  "ant-picker-range-arrow",
  "ant-tooltip-arrow",
  "ant-popover-arrow",
  "ant-dropdown-arrow",
  "ant-popconfirm-arrow",
  "ant-tour-arrow",
  "slick-list",
  "slick-track",
  "slick-dots",
  "ant-qrcode",
  "ant-upload-list-item-thumbnail",
  "ant-border-beam",
  "ant-typography-ellipsis",
  "ant-select-selection-overflow",
  "ant-select-content",
  "ant-skeleton",
  "ant-image-mask",
  "ant-watermark",
  "ant-segmented-thumb",
  "ant-tabs-nav-wrap",
  "ant-slider",
  "ant-steps-item-title",
  "ant-steps-item-content",
  "ant-form-show-help", // validation message fade-in animation, measured mid-motion
];

// Console noise that is not about the components.
const IGNORED_CONSOLE = [/Download the React DevTools/i, /\[HMR\]/, /\[vite\]/i];

const require = createRequire(join(process.cwd(), "package.json"));
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("\n✖ smoke test could not run: the `playwright` package is not installed (npm i -D playwright).\n");
  process.exit(1);
}

let index;
try {
  index = await (await fetch(`${BASE}/index.json`)).json();
} catch {
  console.error(
    `\n✖ smoke test could not run: no Storybook at ${BASE}.\n` +
      "  Start it first (`npm run dev:storybook`), or pass its URL as the first argument.\n"
  );
  process.exit(1);
}

const ids = Object.keys(index.entries).filter(
  (id) => id.startsWith("system-theme-showcase--") || id === "system-flow-map--all-flows"
);
if (!ids.some((id) => id.startsWith("system-theme-showcase--"))) {
  console.error("\n✖ no Theme Showcase stories found in Storybook's index.\n");
  process.exit(1);
}

let browser;
try {
  browser = await chromium.launch();
} catch (err) {
  console.error(
    "\n✖ smoke test could not run: Chromium is not installed for Playwright.\n" +
      "  Run once: npx playwright install chromium\n\n  " + String(err.message).split("\n")[0] + "\n"
  );
  process.exit(1);
}

const failures = [];
for (const id of ids) {
  for (const mode of MODES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const logs = [];
    page.on("console", (m) => {
      if (!["error", "warning"].includes(m.type())) return;
      const text = m.text().replace(/\s+/g, " ");
      if (!IGNORED_CONSOLE.some((re) => re.test(text))) logs.push(`console.${m.type()}: ${text.slice(0, 200)}`);
    });
    page.on("pageerror", (e) => logs.push(`page error: ${e.message.slice(0, 200)}`));

    await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story&globals=${mode.globals}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500); // fonts, carousel, measured popups

    const problems = await page.evaluate((intentional) => {
      const out = [];
      const root = document.querySelector("#storybook-root") || document.body;
      const isIntentional = (el) => {
        for (let n = el; n && n !== root; n = n.parentElement) {
          if (n.hasAttribute && n.hasAttribute("data-showcase-scroll")) return true;
          const cls = typeof n.className === "string" ? n.className : "";
          if (intentional.some((p) => cls.split(/\s+/).some((c) => c.startsWith(p)))) return true;
        }
        return false;
      };
      const label = (el) => {
        const sec = el.closest("[data-showcase-section]");
        const where = sec ? `[${sec.getAttribute("data-showcase-section")}] ` : "";
        const cls = (typeof el.className === "string" ? el.className : "").split(/\s+/).find((c) => c.startsWith("ant-")) || el.tagName.toLowerCase();
        return `${where}${cls} “${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40)}”`;
      };

      // 2. every demo in every section has a visible box
      for (const content of root.querySelectorAll("[data-showcase-content]")) {
        for (const child of content.children) {
          const r = child.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) out.push(`empty or zero-size demo: ${label(child)}`);
        }
      }

      // 2b. demos overlapping each other (a popup panel wider than its slot
      //     spilling over the next demo). Compare the full painted extent of
      //     every demo — its own box plus everything inside it.
      const extent = (el) => {
        // Walk the subtree, clipping each child to any ancestor that clips its
        // overflow — content scrolled or clipped out of view isn't painted, so
        // it can't overlap anything (carousel clones, time-picker columns…).
        const box = el.getBoundingClientRect();
        const e = { l: box.left, t: box.top, r: box.right, b: box.bottom };
        const visit = (node, clip) => {
          for (const d of node.children) {
            const cs = getComputedStyle(d);
            if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
            const dr = d.getBoundingClientRect();
            let c = clip;
            if (dr.width >= 1 && dr.height >= 1) {
              const l = Math.max(dr.left, c.l), t = Math.max(dr.top, c.t), r = Math.min(dr.right, c.r), b = Math.min(dr.bottom, c.b);
              if (r > l && b > t) { e.l = Math.min(e.l, l); e.t = Math.min(e.t, t); e.r = Math.max(e.r, r); e.b = Math.max(e.b, b); }
            }
            if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
              c = { l: Math.max(c.l, dr.left), t: Math.max(c.t, dr.top), r: Math.min(c.r, dr.right), b: Math.min(c.b, dr.bottom) };
            }
            visit(d, c);
          }
        };
        visit(el, { l: -1e9, t: -1e9, r: 1e9, b: 1e9 });
        return e;
      };
      for (const content of root.querySelectorAll("[data-showcase-content]")) {
        const kids = [...content.children].map((el) => ({ el, e: extent(el) }));
        for (let i = 0; i < kids.length; i++) {
          for (let j = i + 1; j < kids.length; j++) {
            const a = kids[i].e, b = kids[j].e;
            const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l);
            const oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
            if (ox > 4 && oy > 4) out.push(`demos overlap: ${label(kids[i].el)} ↔ ${label(kids[j].el)}`);
          }
        }
      }

      // 3. clipped content
      for (const el of root.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cs = getComputedStyle(el);
        const clipsY = cs.overflowY !== "visible" && el.scrollHeight - el.clientHeight > 2;
        const clipsX = cs.overflowX !== "visible" && el.scrollWidth - el.clientWidth > 2;
        if ((clipsY || clipsX) && !isIntentional(el)) {
          out.push(
            `clipped content (${clipsY ? `${el.scrollHeight}px of content in a ${el.clientHeight}px box` : `${el.scrollWidth}px of content in a ${el.clientWidth}px box`}): ${label(el)}`
          );
        }
      }

      // 4. collapsed horizontal menu
      for (const rest of root.querySelectorAll(".ant-menu-overflow-item-rest")) {
        const cs = getComputedStyle(rest);
        if (cs.opacity !== "0" && rest.getBoundingClientRect().height > 0) out.push(`horizontal Menu collapsed into “···”: ${label(rest)}`);
      }

      // 5. page wider than the viewport
      if (document.documentElement.scrollWidth > window.innerWidth + 2) {
        out.push(`page scrolls horizontally (${document.documentElement.scrollWidth}px wide)`);
      }
      return out;
    }, INTENTIONAL_OVERFLOW);

    for (const p of [...new Set([...logs, ...problems])]) failures.push(`${id} [${mode.name}] ${p}`);
    await page.close();
  }
}
await browser.close();

const checked = ids.length * MODES.length;
if (failures.length) {
  console.error(`\n✖ Theme Showcase smoke test: ${failures.length} problem(s) in ${checked} story×mode runs:\n`);
  for (const f of failures) console.error("  " + f);
  console.error(
    "\n  Fix the demo, not the test: remove the fixed size that clips, update the deprecated API\n" +
      "  the warning names, or give the component room. Do NOT delete the demo to get green.\n"
  );
  process.exit(1);
}
console.log(`✓ Theme Showcase smoke test: ${ids.length} stories × ${MODES.length} modes, nothing hidden, clipped or warning`);
