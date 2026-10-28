// src/shared/ui/CustomerShell.tsx
//
// The borrower / co-borrower chrome. DESIGN.md §5.1.
//
// Dumb on purpose: it takes nav items and emits `onNavigate(key)` rather than
// rendering router <Link>s itself. That keeps it renderable in Storybook (a
// Link outside a RouterProvider throws) and leaves navigation to the flow
// screen, which is where AGENTS.md puts it.
//
// Three things here are design decisions, not layout accidents:
//   1. The language switch is in the top bar on EVERY screen. Someone who
//      can't read the settings link can't reach the language setting.
//   2. One primary action, in a sticky bar. Secondary actions are text
//      buttons — never a second filled button.
//   3. Support is reachable from every screen. It is the designated escape
//      hatch for identity/sanctions failures, which must never dead-end.

import type { ReactNode } from "react";
import { Button, Dropdown, Flex, Grid, Layout, Menu, Segmented, Typography, theme } from "antd";
import { CustomerServiceOutlined, UserOutlined } from "@ant-design/icons";
import { getStyles } from "./CustomerShell.styles";

export type CustomerNavItem = { key: string; label: string };

export type CustomerShellProps = {
  children: ReactNode;
  /** Top-bar navigation. Keep it to three or four items. */
  nav?: CustomerNavItem[];
  activeKey?: string;
  onNavigate?: (key: string) => void;

  locale?: "en" | "es";
  onLocaleChange?: (locale: "en" | "es") => void;

  /** Absent while signed out — the shell is used by the auth screens too. */
  userName?: string;
  onAccount?: (action: "profile" | "logout") => void;

  /** The single primary action. Rendered as the sticky bottom bar. */
  primaryAction?: { label: string; onClick?: () => void; loading?: boolean; disabled?: boolean };
  /** Optional text button beside it. Never a second filled button. */
  secondaryAction?: { label: string; onClick?: () => void };

  onSupport?: () => void;
  /** 720px for the wizard and forms, 1080px for dashboards. */
  width?: "narrow" | "wide";
};

export default function CustomerShell({
  children,
  nav = [],
  activeKey,
  onNavigate,
  locale = "en",
  onLocaleChange,
  userName,
  onAccount,
  primaryAction,
  secondaryAction,
  onSupport,
  width = "narrow",
}: CustomerShellProps) {
  const { token } = theme.useToken();
  const styles = getStyles(token, width);
  /**
   * On a phone the primary action is a full-width bar in the thumb zone; on a
   * desktop it sits bottom-right. antd's own breakpoint hook, so there is no
   * media query and no CSS file involved.
   */
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;

  return (
    <Layout style={styles.layout}>
      <Layout.Header style={styles.header}>
        <Flex align="center" justify="space-between" gap={16} style={styles.headerInner}>
          <Flex align="center" gap={24} style={styles.navArea}>
            <Typography.Text style={styles.brand}>OPA</Typography.Text>
            {nav.length > 0 && (
              <Menu
                mode="horizontal"
                selectedKeys={activeKey ? [activeKey] : []}
                items={nav}
                onClick={({ key }) => onNavigate?.(key)}
                style={styles.navMenu}
              />
            )}
          </Flex>

          <Flex align="center" gap={8} style={styles.headerActions}>
            {onLocaleChange && (
              <Segmented
                size="small"
                value={locale}
                onChange={(v) => onLocaleChange(v as "en" | "es")}
                options={[
                  { label: "EN", value: "en" },
                  { label: "ES", value: "es" },
                ]}
              />
            )}
            {userName && (
              <Dropdown
                menu={{
                  items: [
                    { key: "profile", label: "Profile" },
                    { type: "divider" },
                    { key: "logout", label: "Sign out" },
                  ],
                  onClick: ({ key }) => onAccount?.(key as "profile" | "logout"),
                }}
              >
                {/* On a phone the name is the first thing to go: the icon
                    still opens the same menu, and the bar stops fighting the
                    language switch for room. */}
                <Button type="text" icon={<UserOutlined />} aria-label={userName}>
                  {isMobile ? null : userName}
                </Button>
              </Dropdown>
            )}
          </Flex>
        </Flex>
      </Layout.Header>

      <Layout.Content style={styles.content}>
        {children}
        {/* Inside the content flow, not after it: as a sibling of Content it
            ended up at the bottom of the viewport, underneath the fixed action
            bar — an escape hatch nobody could see. */}
        {onSupport && (
          <Flex justify="center" style={styles.support}>
            <Button type="link" icon={<CustomerServiceOutlined />} onClick={onSupport}>
              Need help? Contact Customer Service
            </Button>
          </Flex>
        )}
      </Layout.Content>

      {primaryAction && (
        <div style={styles.actionBar}>
          <Flex
            align="center"
            justify={isMobile ? "stretch" : "end"}
            gap={12}
            style={styles.actionBarInner}
          >
            {secondaryAction && (
              <Button type="text" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            <Button
              type="primary"
              size="large"
              block={isMobile}
              loading={primaryAction.loading}
              disabled={primaryAction.disabled}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          </Flex>
        </div>
      )}
    </Layout>
  );
}
