// src/shared/ui/StaffShell.tsx
//
// The Admin / Underwriter / OPA Staff chrome. DESIGN.md §5.3.
//
// This is where the second density lives: the shell wraps its subtree in a
// nested <ConfigProvider> carrying `compactTokens`. The nested provider
// INHERITS the global theme and merges only ergonomics on top — identical
// palette, denser controls. That is why a designer never has to remember which
// density a screen is in: the shell decides.
//
// Dumb, like CustomerShell: nav items in, `onNavigate(key)` out.

import type { ReactNode } from "react";
import {
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Input,
  Layout,
  Menu,
  Typography,
  theme,
} from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import type { ItemType } from "antd/es/menu/interface";
import { compactTokens } from "../../theme/tokens";
import { getStyles } from "./StaffShell.styles";

export type StaffShellProps = {
  children: ReactNode;
  /** Grouped by the epics in PROJECT.md §3. */
  nav: ItemType[];
  activeKey?: string;
  onNavigate?: (key: string) => void;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;

  /** Page title bar. `extra` holds the page's actions. */
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;

  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  userName?: string;
  onAccount?: (action: "profile" | "logout") => void;
  onNotifications?: () => void;
};

export default function StaffShell({
  children,
  nav,
  activeKey,
  onNavigate,
  collapsed,
  onCollapse,
  title,
  subtitle,
  extra,
  onSearch,
  searchPlaceholder = "Search by name, email or phone",
  userName,
  onAccount,
  onNotifications,
}: StaffShellProps) {
  const { token } = theme.useToken();
  const styles = getStyles(token);

  return (
    <ConfigProvider theme={{ token: compactTokens }}>
      <Layout style={styles.layout}>
        <Layout.Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          width={224}
          style={styles.sider}
        >
          <Flex align="center" style={styles.brand}>
            {collapsed ? "OPA" : "OPA · Back office"}
          </Flex>
          <Menu
            mode="inline"
            items={nav}
            selectedKeys={activeKey ? [activeKey] : []}
            onClick={({ key }) => onNavigate?.(key)}
            style={{ borderInlineEnd: "none" }}
          />
        </Layout.Sider>

        <Layout>
          <Layout.Header style={styles.header}>
            <Flex align="center" justify="space-between" gap={16} style={{ height: "100%" }}>
              {onSearch ? (
                <Input.Search
                  allowClear
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                  style={{ maxWidth: 420 }}
                />
              ) : (
                <span />
              )}
              <Flex align="center" gap={4}>
                {onNotifications && (
                  <Button type="text" icon={<BellOutlined />} onClick={onNotifications} />
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
                    <Button type="text" icon={<UserOutlined />}>
                      {userName}
                    </Button>
                  </Dropdown>
                )}
              </Flex>
            </Flex>
          </Layout.Header>

          {(title || extra) && (
            <Flex align="center" justify="space-between" gap={16} style={styles.pageBar}>
              <Flex vertical gap={2} style={{ minWidth: 0 }}>
                {title && (
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {title}
                  </Typography.Title>
                )}
                {subtitle && <Typography.Text type="secondary">{subtitle}</Typography.Text>}
              </Flex>
              {/* Read-only roles get NO action area at all — not a disabled one. */}
              {extra && <Flex gap={8}>{extra}</Flex>}
            </Flex>
          )}

          <Layout.Content style={styles.content}>{children}</Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
