// src/stories/ThemeShowcase.stories.tsx
//
// The Theme Showcase: every antd component, grouped by antd's own categories.
// Because antd is themed from ConfigProvider tokens, this is where a designer
// verifies that a token change (primary colour, radius, spacing, font) landed
// EVERYWHERE. Change /src/theme/tokens.ts, reload, scan.
//
// Two ways to look at it:
//   - "All Components" — one scrollable page (system-theme-showcase--all-components).
//   - one story per category — pick it from the sidebar, or search for a
//     component name: the story names list the components they contain.
//
// The demos live in src/stories/showcase/. COMPLETENESS IS ENFORCED, not hoped
// for: `npm run check:showcase` (scripts/check-showcase-coverage.mjs) compares
// antd's exports with what these files import and fails the commit / CI if a
// component is missing. When antd ships a new component, render it in the right
// category file — don't delete things, and don't add it to ALLOWED_GAPS unless
// it is deprecated or non-visual.
//
// Targets Ant Design v6 (current line). Requires the ThemeProvider decorator in
// .storybook/preview (see SETUP.md) so this reflects the real theme.

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShowcaseFrame, ShowcaseHeader } from "./showcase/ShowcaseKit";
import { ShowcaseGeneral } from "./showcase/ShowcaseGeneral";
import { ShowcaseLayout } from "./showcase/ShowcaseLayout";
import { ShowcaseNavigation } from "./showcase/ShowcaseNavigation";
import { ShowcaseDataEntry } from "./showcase/ShowcaseDataEntry";
import { ShowcaseDataDisplay } from "./showcase/ShowcaseDataDisplay";
import { ShowcaseFeedback } from "./showcase/ShowcaseFeedback";
import { ShowcaseOther } from "./showcase/ShowcaseOther";

const meta = {
  // Title is load-bearing for the story IDs the docs mention — don't rename.
  title: "System/Theme Showcase",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;

type Story = StoryObj<typeof meta>;

export const AllComponents: Story = {
  name: "All Components",
  render: () => (
    <ShowcaseFrame>
      <ShowcaseHeader />
      <ShowcaseGeneral />
      <ShowcaseLayout />
      <ShowcaseNavigation />
      <ShowcaseDataEntry />
      <ShowcaseDataDisplay />
      <ShowcaseFeedback />
      <ShowcaseOther />
    </ShowcaseFrame>
  ),
};

export const General: Story = {
  name: "General: Button, Typography, FloatButton",
  render: () => <ShowcaseFrame><ShowcaseGeneral /></ShowcaseFrame>,
};

export const Layout: Story = {
  name: "Layout: Layout, Grid, Flex, Space, Divider, Splitter, Masonry, Affix",
  render: () => <ShowcaseFrame><ShowcaseLayout /></ShowcaseFrame>,
};

export const Navigation: Story = {
  name: "Navigation: Anchor, Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs",
  render: () => <ShowcaseFrame><ShowcaseNavigation /></ShowcaseFrame>,
};

export const DataEntry: Story = {
  name: "Data Entry: Input, Select, DatePicker, Form, Checkbox, Radio, Switch, Upload, Transfer, …",
  render: () => <ShowcaseFrame><ShowcaseDataEntry /></ShowcaseFrame>,
};

export const DataDisplay: Story = {
  name: "Data Display: Table, Card, Tag, Avatar, Badge, Tree, Timeline, Calendar, Carousel, Image, …",
  render: () => <ShowcaseFrame><ShowcaseDataDisplay /></ShowcaseFrame>,
};

export const Feedback: Story = {
  name: "Feedback: Alert, Modal, Drawer, Message, Notification, Popconfirm, Result, Skeleton, Spin, Tour",
  render: () => <ShowcaseFrame><ShowcaseFeedback /></ShowcaseFrame>,
};

export const Other: Story = {
  name: "Other: ConfigProvider, Watermark, BorderBeam",
  render: () => <ShowcaseFrame><ShowcaseOther /></ShowcaseFrame>,
};
