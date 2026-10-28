// src/shared/ui/DisplayTitle.styles.ts
//
// The display face and its floor size live here, in one object, so "never
// below 28px" is a number in the code rather than a rule in a document.

import type { CSSProperties } from "react";
import { fontFamilyDisplay } from "../../theme/tokens";

/** DESIGN.md §3: the display serif is never used below this size. */
const MIN_DISPLAY_SIZE = 28;

export function getStyles(level: 1 | 2, align: "start" | "center") {
  return {
    title: {
      fontFamily: fontFamilyDisplay,
      fontWeight: 700,
      fontSize: level === 1 ? 40 : MIN_DISPLAY_SIZE,
      lineHeight: 1.2,
      textAlign: align === "center" ? "center" : "start",
      marginBottom: 8,
    } satisfies CSSProperties,
  };
}
