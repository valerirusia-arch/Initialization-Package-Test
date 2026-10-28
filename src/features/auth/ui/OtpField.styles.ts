// src/features/auth/ui/OtpField.styles.ts

import type { CSSProperties } from "react";

export function getStyles() {
  return {
    /** No fixed width: six boxes at stress tokens must still fit a phone. */
    otp: { width: "100%" } satisfies CSSProperties,
    /** A link button inside a sentence should not carry the link's own padding. */
    resend: { padding: 0, height: "auto" } satisfies CSSProperties,
  };
}
