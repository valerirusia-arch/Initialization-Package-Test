// src/theme/tokens.ts
//
// DESIGNER-OWNED. The single source of visual truth for the whole app.
//
// This is the ONLY file in the project allowed to contain raw hex. The
// `tokens-not-hardcoded-colors` rule in eslint.presentation.js exempts this
// exact path and nothing else — the same literal in any other presentation file
// is an error. That's the mechanism behind "theme through tokens, not
// overrides": there is precisely one place a colour can be born.
//
// The values below are the OPA design language. The reasoning lives in
// DESIGN.md — read that before changing anything here, because most of these
// numbers are decisions about an audience, not preferences.

import { theme, type ThemeConfig } from "antd";

/* ------------------------------------------------------------------ *
 * Palette — measured from OPA's public site, adjusted for contrast.
 * ------------------------------------------------------------------ */

/** OPA teal. The brand mark's blue. 6.5:1 on white — passes AA for body text. */
const TEAL = "#146580";
const TEAL_HOVER = "#125A71";
const TEAL_SOFT = "#4D889C";

/** Warm copper. BRAND accent only — never a status. See DESIGN.md §3. */
export const COPPER = "#B85C23";
/** Darker copper for when the accent has to carry text on white. */
export const COPPER_TEXT = "#A4501C";

const INK_HEADING = "#262423";
const INK_BODY = "#4D4847";
const BORDER = "#D9D4D1";

/** Warm off-white. Clinical white reads as a form; this reads as paper. */
const PAGE_BG = "#FAF8F6";
const SURFACE = "#FFFFFF";

/**
 * Status colours, deliberately NOT antd's defaults. antd's #52c41a / #ff4d4f
 * are bright and app-like — the wrong register for someone reading whether
 * their loan was approved. These are calmer and all clear AA on white.
 */
const SUCCESS = "#2F7D5A";
const WARNING = "#9A6700";
const ERROR = "#B42318";

/* ------------------------------------------------------------------ *
 * Type
 * ------------------------------------------------------------------ */

/** Inter: best-in-class at small sizes, full Latin Extended for Spanish. */
const FONT_UI =
  '"Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

/**
 * Playfair Display, standing in for the brand's Noe Display.
 * RESTRICTED to large customer-facing headings (>= 28px) on milestone screens.
 * Never in the back-office, never in a table, never below 28px — the
 * `DisplayTitle` primitive in src/shared/ui enforces that so it isn't a
 * convention nobody reads.
 */
export const fontFamilyDisplay = '"Playfair Display", Georgia, serif';

/* ------------------------------------------------------------------ *
 * Global theme — the GENEROUS density (customer portal).
 *
 * The customer portal is both the majority of screens and the
 * trust-critical ones, so it is the default. The back-office opts into
 * `compactTokens` below via a nested ConfigProvider in its shell.
 * ------------------------------------------------------------------ */

export const tokens: ThemeConfig = {
  token: {
    colorPrimary: TEAL,
    colorPrimaryHover: TEAL_HOVER,
    colorPrimaryActive: TEAL_HOVER,
    colorPrimaryBorder: TEAL_SOFT,
    colorLink: TEAL,
    colorLinkHover: TEAL_SOFT,
    colorInfo: TEAL,
    colorSuccess: SUCCESS,
    colorWarning: WARNING,
    colorError: ERROR,

    colorTextHeading: INK_HEADING,
    colorText: INK_BODY,
    colorBorder: BORDER,
    colorBorderSecondary: BORDER,
    colorBgLayout: PAGE_BG,
    colorBgContainer: SURFACE,

    fontFamily: FONT_UI,

    /**
     * 16px base and 44px controls are accessibility decisions, not taste:
     * a phone-first audience with limited English, and iOS Safari zooms any
     * input whose font-size is below 16px. WCAG 2.5.5 wants >= 44px targets.
     */
    fontSize: 16,
    controlHeight: 44,

    borderRadius: 8,
    lineHeight: 1.6,
    wireframe: false,
  },

  components: {
    /** Cards are the main surface; slightly rounder than controls. */
    Card: { borderRadiusLG: 12 },
    /** Layout follows the warm page background rather than antd's grey. */
    Layout: { bodyBg: PAGE_BG, headerBg: SURFACE, siderBg: SURFACE },
    /** Vertical labels everywhere means the label needs breathing room. */
    Form: { labelColor: INK_HEADING, verticalLabelPadding: "0 0 6px" },
    /** Status tags carry a word as well as a colour — keep them readable. */
    Tag: { borderRadiusSM: 6 },
  },

  algorithm: theme.defaultAlgorithm,
};

/**
 * The COMPACT density, for the internal back-office only.
 *
 * Applied by the staff shell through a nested <ConfigProvider>, which inherits
 * everything above and merges these on top — so the palette stays identical and
 * only the ergonomics change. See DESIGN.md §4.
 */
export const compactTokens = {
  fontSize: 14,
  controlHeight: 32,
  borderRadius: 6,
  lineHeight: 1.5,
} as const;

export default tokens;
