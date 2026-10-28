// src/features/application/ui/DocumentUpload.styles.ts

import type { CSSProperties } from "react";

export function getStyles() {
  return {
    select: { width: "100%", maxWidth: 360 } satisfies CSSProperties,
    list: { width: "100%" } satisfies CSSProperties,
    rowMain: { minWidth: 0 } satisfies CSSProperties,
    rowDivider: { margin: "8px 0" } satisfies CSSProperties,
  };
}
