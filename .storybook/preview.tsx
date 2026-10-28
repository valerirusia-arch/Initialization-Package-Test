// .storybook/preview.tsx
//
// SHIPPED, NOT IMPROVISED — moved into .storybook/ at init (SETUP.md step 4).
//
// Every story renders under the real theme (ThemeProvider), plus two toolbar
// switches so a designer can check a token change the way users will see it:
//
//   Theme:   Light / Dark          — the same tokens under antd's dark algorithm.
//   Density: Default / Stress      — temporarily bumps font size, control height
//                                    and radius. Anything that clips, overlaps or
//                                    truncates under "Stress" has a fixed size
//                                    somewhere that will break on a real token change.
//
// Both are Storybook "globals", so they also work from the URL:
//   ?globals=theme:dark;density:stress   (scripts/smoke-showcase.mjs uses this).

import type { Preview } from "@storybook/react-vite";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { StoryCanvas as Canvas } from "./StoryCanvas";


/**
 * Deliberately exaggerated. Not a design decision — a stress test.
 *
 * RAISED from the kit's original 16/40/16. This project's global base is 16px
 * font / 44px controls (an accessibility decision — see DESIGN.md §4), so the
 * original stress values were SMALLER than the default and the check had
 * quietly stopped stressing anything. These are larger than the base again.
 * The only direction a guardrail may ever be changed is stricter.
 */
const STRESS_TOKENS = { fontSize: 18, controlHeight: 52, borderRadius: 20 };

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Light or dark algorithm",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Token stress test",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "default", title: "Default tokens" },
          { value: "stress", title: "Stress (bigger tokens)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", density: "default" },
  decorators: [
    (Story, { globals }) => {
      const dark = globals.theme === "dark";
      const stress = globals.density === "stress";
      return (
        // `key` remounts the provider when the toolbar changes, so initialDark applies.
        <ThemeProvider key={dark ? "dark" : "light"} initialDark={dark}>
          {stress ? (
            // A nested ConfigProvider inherits the outer theme and merges these tokens on top.
            <ConfigProvider theme={{ token: STRESS_TOKENS }}>
              <Canvas><Story /></Canvas>
            </ConfigProvider>
          ) : (
            <Canvas><Story /></Canvas>
          )}
        </ThemeProvider>
      );
    },
  ],
};
export default preview;
