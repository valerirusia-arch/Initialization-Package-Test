// src/flows/payments/FeesScreen.tsx — /payments/fees
//
// Late fees and what happens if an account keeps slipping. The whole WBS rule
// is laid out here — 15 days, the 16th-day fee, 90 days to default, 120 days
// to acceleration — because a borrower who is behind needs to know where the
// line is, and a surprise is both worse for them and worse for OPA.
//
// Written as consequences and dates, not as legal clauses.

import { Card, Divider, Flex, Table, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import Money from "../../shared/ui/Money";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { LATE_FEE } from "../portalMocks";

const STAGES = [
  {
    key: "1",
    when: "15 days late",
    what: "Nothing yet — there is no fee inside the first 15 days.",
  },
  {
    key: "2",
    when: "On the 16th day",
    what: "A late fee is added: 5% of the payment, or $5.00, whichever is less. Only one fee per missed payment.",
  },
  {
    key: "3",
    when: "More than 90 days late",
    what: "The account is in default. The full past-due amount must be paid within 30 days.",
  },
  {
    key: "4",
    when: "More than 120 days late",
    what: "The whole remaining loan becomes due within 30 days of a notice of default. The rate stays at 1%.",
  },
];

export default function FeesScreen() {
  const portal = usePortal("payments");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Late fees
        </Typography.Title>

        <Card title="What you have been charged">
          <Flex vertical gap={4}>
            <Money amount={LATE_FEE.amount} size="large" type="danger" />
            <Typography.Text type="secondary">
              Added on <DateText value={LATE_FEE.chargedOn} format="long" /> —{" "}
              {LATE_FEE.reason}
            </Typography.Text>
          </Flex>
          <Divider />
          <Typography.Text type="secondary">
            This is the only fee on your account. Paying what is overdue stops
            anything further being added.
          </Typography.Text>
        </Card>

        <Card title="How late fees work" styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={STAGES}
            pagination={false}
            showHeader={false}
            size="middle"
            rowKey="key"
            columns={[
              {
                dataIndex: "when",
                width: 200,
                render: (w: string) => <Typography.Text strong>{w}</Typography.Text>,
              },
              { dataIndex: "what" },
            ]}
          />
        </Card>

        <Card>
          <Typography.Text type="secondary">
            If you are struggling, call us on 617-404-9797 before a payment is
            missed. We would much rather work something out with you.
          </Typography.Text>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
