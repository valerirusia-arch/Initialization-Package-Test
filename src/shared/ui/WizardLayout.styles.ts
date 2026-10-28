// src/shared/ui/WizardLayout.styles.ts

import type { CSSProperties } from "react";

export function getStyles() {
  return {
    rail: { minWidth: 200, flex: "0 0 auto" } satisfies CSSProperties,
    mobileRail: { width: "100%" } satisfies CSSProperties,
    card: { flex: "1 1 320px", width: "100%" } satisfies CSSProperties,
    title: { marginTop: 0 } satisfies CSSProperties,
  };
}
