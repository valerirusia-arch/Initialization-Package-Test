// src/flows/_devbar/DevBarWithTheme.tsx
//
// Wires the DevBar's light/dark toggle to ThemeProvider's context.
// Its own file on purpose: declaring it inside router.tsx would put a component
// next to that file's `router` export and trip react-refresh/only-export-components.

import { useThemeControls } from "../../theme/ThemeContext";
import DevBar from "./DevBar";

export default function DevBarWithTheme() {
  const { isDark, toggleTheme } = useThemeControls();
  return <DevBar isDark={isDark} onToggleTheme={toggleTheme} />;
}
