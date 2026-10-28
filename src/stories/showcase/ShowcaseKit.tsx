// src/stories/showcase/ShowcaseKit.tsx
//
// Shared building blocks for every Showcase category. Nothing here is a demo of
// a component; it is the frame the demos sit in.
//
// ShowcaseFrame mounts antd's <App> so message / notification / modal (the
// static-method APIs) pick up the theme and context — see ShowcaseFeedback.

import type { ReactNode } from "react";
import { App, Divider, Flex, Space, Tag, Typography, version } from "antd";
import { frame } from "./ShowcaseKit.styles";

const { Text } = Typography;

/**
 * One antd category (or a part of one): a titled group of live components.
 * Default: components flow side by side and wrap. `block`: one per row, full
 * width — for things that need the whole row to be meaningful (Layout, Grid,
 * Splitter, Alert…), because <Space> shrinks its children to content width.
 */
export function Section({ title, block, children }: { title: string; block?: boolean; children: ReactNode }) {
  return (
    // data-showcase-* attributes are read by scripts/smoke-showcase.mjs, which
    // checks that every demo in every section is actually visible.
    <div data-showcase-section={title}>
      <Divider titlePlacement="start"><Text strong>{title}</Text></Divider>
      {block ? (
        <Flex vertical gap={12} data-showcase-content="">{children}</Flex>
      ) : (
        <Space wrap size="large" align="start" data-showcase-content="">{children}</Space>
      )}
    </div>
  );
}

/** A labelled single demo — the label says which state/variant you're looking at. */
export function Demo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Flex vertical gap={4} align="flex-start">
      <Text type="secondary">{label}</Text>
      {children}
    </Flex>
  );
}

/** Page frame for a story: themed <App>, centred column, vertical rhythm. */
export function ShowcaseFrame({ children }: { children: ReactNode }) {
  return (
    <App>
      <Flex vertical gap={16} style={frame}>{children}</Flex>
    </App>
  );
}

/** Top of the "all components" page: what this is, and which antd it ran against. */
export function ShowcaseHeader() {
  return (
    <div id="top">
      <Flex align="center" gap={12}>
        <Typography.Title level={3} style={{ margin: 0 }}>Theme showcase — all components</Typography.Title>
        <Tag color="processing">antd {version}</Tag>
      </Flex>
      <Typography.Paragraph type="secondary">
        Themed from <Text code>src/theme/tokens.ts</Text>. Change a token, reload, scan for anything
        that didn't update. Every antd component is rendered here — <Text code>npm run check:showcase</Text>{" "}
        fails if one is missing. Each category is also its own story in the sidebar.
      </Typography.Paragraph>
    </div>
  );
}
