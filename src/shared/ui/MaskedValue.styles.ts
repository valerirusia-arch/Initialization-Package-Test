// src/shared/ui/MaskedValue.styles.ts
//
// Co-located style objects, typed CSSProperties (AGENTS.md §2). Static only —
// nothing here depends on a theme token, so there is no getStyles(token) factory.

import type { CSSProperties } from "react";

export const styles = {
  /**
   * Tabular figures so a masked value and a revealed one are the same width —
   * without it, the row jumps when someone clicks the eye.
   */
  value: {
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.02em",
  } satisfies CSSProperties,
};
