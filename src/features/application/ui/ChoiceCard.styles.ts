// src/features/application/ui/ChoiceCard.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export function getStyles(token: GlobalToken, checked: boolean, disabled: boolean) {
  return {
    card: {
      boxSizing: "border-box",
      width: "100%",
      padding: 16,
      borderRadius: token.borderRadiusLG,
      // Two borders' worth of difference, not a colour wash: the selected state
      // has to survive dark mode and a colour-blind reader.
      border: `${checked ? 2 : 1}px solid ${
        checked ? token.colorPrimary : token.colorBorder
      }`,
      background: checked ? token.colorPrimaryBg : token.colorBgContainer,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      transition: `border-color ${token.motionDurationMid}, background ${token.motionDurationMid}`,
    } satisfies CSSProperties,

    main: { flex: "1 1 220px", minWidth: 0 } satisfies CSSProperties,
    amount: { flex: "0 0 auto" } satisfies CSSProperties,
  };
}
