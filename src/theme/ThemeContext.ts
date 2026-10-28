// src/theme/ThemeContext.ts
//
// DESIGNER-OWNED. The light/dark context and its hook, kept in a file of their
// own so that ThemeProvider.tsx exports a component and nothing else.
//
// WHY THIS FILE EXISTS — it is not gratuitous. The kit's ESLint baseline runs
// `react-refresh/only-export-components`, which errors when one module exports
// both a component and a plain function. `ThemeProvider` needs to expose
// `useThemeControls`, so the two cannot share a file. The alternative was an
// eslint-disable comment; a suppression in the theme layer is a bad precedent
// when the whole kit's premise is that the rules are real.
//
// No JSX here on purpose — it's a `.ts`, not a `.tsx`.

import { createContext, useContext } from "react";

export type ThemeControls = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeControlsContext = createContext<ThemeControls>({
  isDark: false,
  toggleTheme: () => {},
});

/**
 * Read the light/dark state anywhere inside <ThemeProvider>.
 *
 * Used to feed `isDark` / `onToggleTheme` into <DevBar />. The DevBar hides its
 * theme button entirely when `onToggleTheme` is absent, so wiring this up is
 * what makes the toggle appear — see SETUP.md step 7.
 */
export function useThemeControls() {
  return useContext(ThemeControlsContext);
}
