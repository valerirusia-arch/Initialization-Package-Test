// src/theme/ThemeProvider.tsx
//
// DESIGNER-OWNED. Wraps the app in antd's ConfigProvider so every component
// reads from src/theme/tokens.ts.
//
// Mounted in two places, both of which import it as a NAMED export:
//   - src/app/router.tsx        (the running app)
//   - .storybook/preview.tsx    (so stories render under the real theme)
// Keep `export function ThemeProvider` — a default-only export breaks both.
//
// This file exports a COMPONENT AND NOTHING ELSE. The context and its hook live
// in ./ThemeContext.ts because `react-refresh/only-export-components` errors on
// a module that exports both. Don't move them back in.
//
// SHIPPED, NOT IMPROVISED. Same reason as tokens.ts: everything visual hangs
// off this file, and the light/dark plumbing below is exactly the part an
// improvised version drops — at which point the DevBar's theme toggle simply
// doesn't render and nobody can tell whether that's intended.

// Webfonts are bundled locally, not fetched from Google: this app has screens
// where someone types an SSN and a card number, and a third-party font request
// on those pages is a privacy leak we don't need. Imported here because
// ThemeProvider is the one module both the app AND Storybook mount.
import "@fontsource-variable/inter";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";

import { ConfigProvider, theme } from "antd";
import { useMemo, useState, type ReactNode } from "react";
import { tokens } from "./tokens";
import { ThemeControlsContext, type ThemeControls } from "./ThemeContext";

export function ThemeProvider({
  children,
  initialDark = false,
}: {
  children: ReactNode;
  /**
   * Start in dark mode. Used by Storybook's theme toolbar (.storybook/preview.tsx)
   * so every story can be checked in both modes; the app leaves it off.
   */
  initialDark?: boolean;
}) {
  const [isDark, setIsDark] = useState(initialDark);

  const controls = useMemo<ThemeControls>(
    () => ({ isDark, toggleTheme: () => setIsDark((v) => !v) }),
    [isDark]
  );

  /**
   * Swap only the algorithm; every token in tokens.ts stays authoritative in
   * both modes. That's the point of the Theme Showcase — a token that only
   * survives one mode is a bug, and this is where you'd see it.
   */
  const activeTheme = useMemo(
    () => ({
      ...tokens,
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }),
    [isDark]
  );

  return (
    <ThemeControlsContext.Provider value={controls}>
      <ConfigProvider theme={activeTheme}>{children}</ConfigProvider>
    </ThemeControlsContext.Provider>
  );
}
