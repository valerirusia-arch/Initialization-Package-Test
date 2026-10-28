// src/flows/_devbar/DevBar.tsx
//
// Designer's dev-only nav bar (think: WordPress admin bar).
//
// Renders ONLY in development. `import.meta.env.DEV` is statically replaced at
// build time, so the prod branch collapses to `return null` and DevBarPanel —
// along with everything it imports — is tree-shaken out of production bundles.
//
// Note the two-component split: the DEV check has to sit in a component with NO
// hooks, otherwise it's a conditional early-return above useState/useToken and
// react-hooks flags it (correctly).
//
// It reads src/flows/routes.tsx (plain data — no loaders/guards) and builds a
// jump-to-any-screen switcher. Nothing here fetches, stores, or guards.

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Button, Flex, Segmented, Select, Space, Tag, Tooltip, theme } from "antd";
import {
  AppstoreOutlined, BgColorsOutlined, BookOutlined, EyeInvisibleOutlined,
  NodeIndexOutlined, ThunderboltOutlined,
} from "@ant-design/icons";
import { flattenRoutes, groupByFlow, resolvePath } from "./flatten";
import {
  getStyles, hiddenToggle, barInner, tagFlush, selectStyle, spacer,
} from "./DevBar.styles";

// Where Storybook runs locally (see the `dev` script in package.json).
const STORYBOOK_URL = "http://localhost:6006";
const FLOWMAP_URL = `${STORYBOOK_URL}/?path=/story/system-flow-map--all-flows`;

type Props = {
  /** Optional: wire to ThemeProvider so designers can check tokens in both modes. */
  isDark?: boolean;
  onToggleTheme?: () => void;
};

/** Dev gate only. No hooks in here — that's the whole point of the split. */
export function DevBar(props: Props) {
  if (!import.meta.env.DEV) return null;
  return <DevBarPanel {...props} />;
}

function DevBarPanel({ isDark, onToggleTheme }: Props) {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [role, setRole] = useState<string>("all");
  const [hidden, setHidden] = useState(false);

  const all = useMemo(() => flattenRoutes(), []);
  const roles = useMemo(
    () => ["all", ...Array.from(new Set(all.map((r) => r.role)))],
    [all]
  );

  const options = useMemo(() => {
    const visible = role === "all" ? all : all.filter((r) => r.role === role);
    return groupByFlow(visible).map(([flow, items]) => ({
      label: flow,
      options: items.map((r) => ({ label: `${r.label}  ·  ${r.path}`, value: r.path })),
    }));
  }, [all, role]);

  if (hidden) {
    return (
      <Button
        size="small"
        icon={<ThunderboltOutlined />}
        onClick={() => setHidden(false)}
        style={hiddenToggle}
      >
        Dev
      </Button>
    );
  }

  return (
    <>
      <div style={styles.bar}>
        <Flex align="center" justify="space-between" style={barInner} gap={12}>
          <Space size="small" align="center">
            <Tag color="processing" style={tagFlush}>DEV</Tag>
            <Segmented
              size="small"
              value={role}
              onChange={(v) => setRole(String(v))}
              options={roles.map((r) => ({ label: r, value: r }))}
            />
            <Select
              size="small"
              showSearch
              style={selectStyle}
              placeholder="Jump to screen…"
              value={undefined}
              options={options}
              notFoundContent="No screens yet — add one to src/flows/routes.tsx"
              filterOption={(input, opt) =>
                String(opt?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              onChange={(path: string) => {
                const match = all.find((r) => r.path === path);
                // Dynamic route tree => `to` is not literal-typed. Intentional.
                navigate({ to: resolvePath(path, match?.samples) });
              }}
              suffixIcon={<AppstoreOutlined />}
            />
            <Tag style={styles.pathTag}>{pathname}</Tag>
          </Space>

          <Space size="small">
            <Tooltip title="Flow map — how all screens connect">
              <Button size="small" icon={<NodeIndexOutlined />} href={FLOWMAP_URL} target="_blank">
                Flow map
              </Button>
            </Tooltip>
            <Tooltip title="Storybook — components & every screen state">
              <Button size="small" icon={<BookOutlined />} href={STORYBOOK_URL} target="_blank">
                Storybook
              </Button>
            </Tooltip>
            {onToggleTheme && (
              <Tooltip title={`Switch to ${isDark ? "light" : "dark"} theme`}>
                <Button size="small" icon={<BgColorsOutlined />} onClick={onToggleTheme} />
              </Tooltip>
            )}
            <Tooltip title="Hide bar">
              <Button size="small" icon={<EyeInvisibleOutlined />} onClick={() => setHidden(true)} />
            </Tooltip>
          </Space>
        </Flex>
      </div>
      {/* Spacer so the bar never covers the app's own header. */}
      <div style={spacer} />
    </>
  );
}

export default DevBar;
