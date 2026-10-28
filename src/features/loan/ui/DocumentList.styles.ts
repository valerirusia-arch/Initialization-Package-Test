// src/features/loan/ui/DocumentList.styles.ts

import type { CSSProperties } from "react";

export function getStyles() {
  return {
    divider: { margin: "12px 0" } satisfies CSSProperties,
    main: { minWidth: 0, flex: "1 1 220px" } satisfies CSSProperties,
  };
}
