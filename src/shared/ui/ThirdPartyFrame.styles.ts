// src/shared/ui/ThirdPartyFrame.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export function getStyles(token: GlobalToken, height: number) {
  return {
    description: { marginBottom: 0 } satisfies CSSProperties,

    lock: { color: token.colorSuccess } satisfies CSSProperties,

    /**
     * box-sizing matters: the embed is given a height by the provider, and
     * without it the padding pushes the frame past its own box — the exact
     * overflow the kit's smoke test looks for.
     */
    frame: {
      boxSizing: "border-box",
      minHeight: height,
      padding: 16,
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadiusLG,
      background: token.colorBgContainer,
    } satisfies CSSProperties,

    placeholder: { minHeight: height - 32 } satisfies CSSProperties,
  };
}
