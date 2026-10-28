// src/features/auth/ui/PasswordRules.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export function getStyles(token: GlobalToken) {
  return {
    passed: { color: token.colorSuccess } satisfies CSSProperties,
    pending: { color: token.colorTextQuaternary } satisfies CSSProperties,
  };
}
