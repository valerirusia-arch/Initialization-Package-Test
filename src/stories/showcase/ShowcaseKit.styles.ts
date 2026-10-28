// src/stories/showcase/ShowcaseKit.styles.ts
//
// Co-located style objects for the Showcase kit and the category files.
// Token-dependent ones come from getStyles(token); the rest are static.

import type { CSSProperties } from "react";
import type { GlobalToken } from "antd";

export const frame: CSSProperties = { maxWidth: 1040, margin: "0 auto", padding: 24 };
export const fullWidth: CSSProperties = { width: "100%" };
export const w160: CSSProperties = { width: 160 };
export const w200: CSSProperties = { width: 200 };
export const w220: CSSProperties = { width: 220 };
export const w240: CSSProperties = { width: 240 };
export const w260: CSSProperties = { width: 260 };
export const w320: CSSProperties = { width: 320 };
export const w480: CSSProperties = { width: 480 };
export const w560: CSSProperties = { width: 560 };
/**
 * Slots for always-open picker panels. A panel hangs from its (narrow) input but
 * is much wider, so it gets a reserved slot — sized for the stress tokens too —
 * or it spills over its neighbour.
 */
export const panelSlot: CSSProperties = { width: 380 };
export const panelSlotNarrow: CSSProperties = { width: 260 };
// ColorPicker's panel is centred under its 32px swatch, so the swatch is indented
// far enough for the panel to stay inside the slot.
export const panelSlotMedium: CSSProperties = { width: 340, paddingLeft: 140 };
export const scrollBox: CSSProperties = { height: 120, overflow: "auto" };
export const scrollFiller: CSSProperties = { height: 260 };
export const splitterBox: CSSProperties = { height: 140, width: "100%" };
export const layoutBox: CSSProperties = { height: 220, width: "100%", overflow: "hidden" };
export const masonryBox: CSSProperties = { width: "100%" };
export const centered: CSSProperties = { textAlign: "center" };

/** Everything here reads from the live theme, so a token change shows up. */
export function getStyles(token: GlobalToken) {
  const panel: CSSProperties = {
    // border-box: padding must not push a 100%-height panel past its container
    // (Splitter / Masonry used to overflow by exactly the padding).
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    minHeight: 48,
    padding: token.paddingSM,
    color: token.colorTextLightSolid,
    background: token.colorPrimary,
    borderRadius: token.borderRadius,
  };
  return {
    // Solid coloured block — used wherever a component needs "some content" and
    // plain white-on-grey would hide the very tokens we're trying to check.
    panel,
    // Header/Footer bars: a fixed-height strip, not a fill-the-parent block.
    bar: { ...panel, height: 48, minHeight: 0, paddingBlock: 0, borderRadius: 0 } as CSSProperties,
    panelAlt: { ...panel, background: token.colorPrimaryBg, color: token.colorPrimaryText } as CSSProperties,
    outlined: {
      border: `1px solid ${token.colorBorder}`,
      borderRadius: token.borderRadius,
    } as CSSProperties,
    carouselSlide: {
      ...panel,
      height: 100,
      lineHeight: "100px",
      textAlign: "center",
    } as CSSProperties,
    tint: { background: token.colorFillTertiary, borderRadius: token.borderRadius } as CSSProperties,
    colBlock: {
      padding: `${token.paddingXS}px 0`,
      textAlign: "center",
      color: token.colorTextLightSolid,
      background: token.colorPrimary,
      borderRadius: token.borderRadiusSM,
    } as CSSProperties,
    colBlockAlt: {
      padding: `${token.paddingXS}px 0`,
      textAlign: "center",
      color: token.colorPrimaryText,
      background: token.colorPrimaryBg,
      borderRadius: token.borderRadiusSM,
    } as CSSProperties,
  };
}
