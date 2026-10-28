import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Flex, Table, Typography } from "antd";
import {
  AuditOutlined,
  BarChartOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import StaffShell from "./StaffShell";
import StatusTag from "./StatusTag";
import Money from "./Money";
import DateText from "./DateText";

const nav = [
  { key: "applications", icon: <FileTextOutlined />, label: "Applications" },
  { key: "borrowers", icon: <TeamOutlined />, label: "Borrowers" },
  { key: "loans", icon: <AuditOutlined />, label: "Loans" },
  { key: "payments", icon: <DollarOutlined />, label: "Payments" },
  { key: "users", icon: <UserSwitchOutlined />, label: "Users" },
  { key: "reports", icon: <BarChartOutlined />, label: "Reports" },
];

const borrowers = [
  { key: "1", name: "María González", email: "maria.g@example.com", state: "MA", status: "Under review" as const, amount: 760 },
  { key: "2", name: "Alvaro García", email: "alvaro@example.com", state: "RI", status: "Approved" as const, amount: 760 },
  { key: "3", name: "René Mendes", email: "rene.m@example.com", state: "CT", status: "Pending action" as const, amount: 1170 },
  { key: "4", name: "Luiz Machado", email: "luiz@example.com", state: "MA", status: "Declined" as const, amount: 0 },
];

const meta: Meta<typeof StaffShell> = {
  title: "Shared/StaffShell",
  component: StaffShell,
  parameters: { layout: "fullscreen" },
  args: {
    nav,
    activeKey: "borrowers",
    userName: "J. Rivera",
    onSearch: () => {},
    onNotifications: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof StaffShell>;

/**
 * The default back-office screen: a dense table under the compact density.
 * The borrower list is capped at 8 columns (PROJECT.md) — anything more goes
 * into the detail view.
 */
export const BorrowerList: Story = {
  args: {
    title: "Borrowers",
    subtitle: "412 borrowers · 38 applications in review",
    extra: <Button>Export</Button>,
    children: (
      <Card styles={{ body: { padding: 0 } }}>
        <Table
          size="small"
          dataSource={borrowers}
          pagination={false}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Email", dataIndex: "email" },
            { title: "State", dataIndex: "state", width: 80 },
            {
              title: "Application",
              dataIndex: "status",
              render: (s: (typeof borrowers)[number]["status"]) => (
                <StatusTag kind="application" status={s} />
              ),
            },
            {
              title: "Requested",
              dataIndex: "amount",
              align: "right",
              render: (v: number) => <Money amount={v} hideCents />,
            },
            {
              title: "Submitted",
              dataIndex: "key",
              render: () => <DateText value="2026-10-14" />,
            },
          ]}
        />
      </Card>
    ),
  },
};

/**
 * The one screen that earns two columns: the application on the left, a sticky
 * decision panel on the right. The decision lives next to the work.
 */
export const ApplicationReview: Story = {
  args: {
    activeKey: "applications",
    title: "Application #10042 — María González",
    subtitle: "Submitted 14 Oct 2026 · N-400 · Massachusetts",
    extra: (
      <>
        <Button>Request information</Button>
        <Button danger>Decline</Button>
        <Button type="primary">Approve</Button>
      </>
    ),
    children: (
      <Flex gap={24} align="start" wrap>
        <Card title="Application" style={{ flex: "1 1 420px" }}>
          <Typography.Paragraph type="secondary">
            Borrower, co-borrower, documents, verifications and history live in
            tabs here.
          </Typography.Paragraph>
        </Card>
        <Card title="Verifications" style={{ flex: "0 1 320px", position: "sticky", top: 24 }}>
          <Flex vertical gap={12}>
            <Flex justify="space-between">
              <Typography.Text>Identity (InstantID)</Typography.Text>
              <StatusTag kind="verification" status="Passed" />
            </Flex>
            <Flex justify="space-between">
              <Typography.Text>OFAC screening</Typography.Text>
              <StatusTag kind="verification" status="Passed" />
            </Flex>
            <Flex justify="space-between">
              <Typography.Text>Credit check (Equifax)</Typography.Text>
              <StatusTag kind="verification" status="Manual review" />
            </Flex>
            <Flex justify="space-between">
              <Typography.Text>Income</Typography.Text>
              <StatusTag kind="verification" status="Pending" />
            </Flex>
          </Flex>
        </Card>
      </Flex>
    ),
  },
};

/** OPA Staff are read-only: the action area is ABSENT, not disabled. */
export const ReadOnlyStaff: Story = {
  args: {
    activeKey: "applications",
    title: "Application #10042 — María González",
    subtitle: "Read-only access",
    extra: undefined,
    children: (
      <Card>
        <Typography.Paragraph type="secondary">
          Same screen, no decision panel. A page full of greyed-out buttons
          teaches nothing and invites clicking.
        </Typography.Paragraph>
      </Card>
    ),
  },
};

export const CollapsedNav: Story = {
  args: {
    collapsed: true,
    title: "Loans",
    children: <Card>Collapsed sider for narrow screens.</Card>,
  },
};
