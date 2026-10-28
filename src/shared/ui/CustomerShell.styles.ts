// src/shared/ui/CustomerShell.styles.ts

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export function getStyles(token: GlobalToken, width: "narrow" | "wide") {
  return {
    layout: {
      minHeight: "100vh",
      background: token.colorBgLayout,
    } satisfies CSSProperties,

    header: {
      position: "sticky",
      top: 0,
      zIndex: 10,
      height: 64,
      paddingInline: 16,
      background: token.colorBgContainer,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
    } satisfies CSSProperties,

    headerInner: {
      height: "100%",
      maxWidth: 1080,
      marginInline: "auto",
      width: "100%",
    } satisfies CSSProperties,

    brand: {
      fontWeight: 700,
      fontSize: 18,
      color: token.colorPrimary,
      whiteSpace: "nowrap",
      /**
       * Without this the brand sits in a shrinkable flex box, drops below its
       * own content width on a narrow screen and overflows UNDER the language
       * switch. The nav menu beside it is what should give way, not the logo.
       */
      flex: "0 0 auto",
    } satisfies CSSProperties,

    /** The nav is the only part of the bar allowed to shrink. */
    navArea: { flex: "1 1 auto", minWidth: 0 } satisfies CSSProperties,

    navMenu: {
      flex: 1,
      minWidth: 0,
      borderBottom: "none",
      background: "transparent",
    } satisfies CSSProperties,

    /** Language switch and account menu always keep their full width. */
    headerActions: { flex: "0 0 auto" } satisfies CSSProperties,

    content: {
      /** Single column. Never two columns of form fields on the customer side. */
      maxWidth: width === "narrow" ? 720 : 1080,
      marginInline: "auto",
      width: "100%",
      paddingInline: 16,
      paddingBlock: 24,
      /** Room for the sticky mobile action bar so it never covers the last field. */
      paddingBottom: 96,
    } satisfies CSSProperties,

    /**
     * The primary action as a full-width bar. On a phone this is the thumb
     * zone; on a desktop it reads as a committed footer rather than a button
     * lost at the end of a long form.
     */
    actionBar: {
      position: "fixed",
      insetInline: 0,
      bottom: 0,
      zIndex: 20,
      padding: 12,
      background: token.colorBgContainer,
      borderTop: `1px solid ${token.colorBorderSecondary}`,
      boxShadow: token.boxShadowTertiary,
    } satisfies CSSProperties,

    actionBarInner: {
      maxWidth: width === "narrow" ? 720 : 1080,
      marginInline: "auto",
      width: "100%",
    } satisfies CSSProperties,

    support: {
      width: "100%",
      paddingTop: 16,
    } satisfies CSSProperties,
  };
}
