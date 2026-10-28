// src/features/auth/ui/AuthCard.styles.ts

import type { CSSProperties } from "react";

export function getStyles() {
  return {
    wrap: { width: "100%" } satisfies CSSProperties,
    /** Narrower than the wizard: one question deserves a short line length. */
    card: { width: "100%", maxWidth: 480 } satisfies CSSProperties,
    footer: { marginTop: 16 } satisfies CSSProperties,
  };
}
