// src/shared/ui/StaffShell.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export function getStyles(token: GlobalToken) {
  return {
    layout: { minHeight: "100vh" } satisfies CSSProperties,

    sider: {
      background: token.colorBgContainer,
      borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
    } satisfies CSSProperties,

    brand: {
      height: 56,
      paddingInline: 16,
      fontWeight: 700,
      color: token.colorPrimary,
      whiteSpace: "nowrap",
      overflow: "hidden",
    } satisfies CSSProperties,

    header: {
      height: 56,
      paddingInline: 16,
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    } satisfies CSSProperties,

    pageBar: {
      paddingInline: 24,
      paddingBlock: 16,
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    } satisfies CSSProperties,

    content: {
      padding: 24,
      /** Wide, but not edge-to-edge on an ultrawide monitor. */
      maxWidth: 1440,
      width: "100%",
    } satisfies CSSProperties,
  };
}
