// src/features/application/ui/ReviewSummary.styles.ts

import type { CSSProperties } from "react";

export function getStyles() {
  return {
    sectionTitle: { margin: 0 } satisfies CSSProperties,
    /**
     * Visually hidden, still announced. Five links all reading "Change" are
     * useless to a screen-reader user moving by links alone.
     */
    srOnly: {
      position: "absolute",
      width: 1,
      height: 1,
      margin: -1,
      padding: 0,
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      whiteSpace: "nowrap",
      border: 0,
    } satisfies CSSProperties,
  };
}
