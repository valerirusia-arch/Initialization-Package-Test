// .storybook/StoryCanvas.tsx
//
// SHIPPED with the kit — moved into .storybook/ at init next to preview.tsx.
// Its own file because react-refresh/only-export-components forbids a component
// next to preview.tsx's default export.

import { useEffect, type ReactNode } from "react";
import { theme } from "antd";

/**
 * Paints the preview canvas with the theme's own background. Without it, dark
 * mode puts light text on Storybook's white canvas and looks broken even when
 * the tokens are fine.
 */
export function StoryCanvas({ children }: { children: ReactNode }) {
  const { token } = theme.useToken();
  useEffect(() => {
    document.body.style.background = token.colorBgContainer;
    document.body.style.color = token.colorText;
  }, [token.colorBgContainer, token.colorText]);
  return <>{children}</>;
}
