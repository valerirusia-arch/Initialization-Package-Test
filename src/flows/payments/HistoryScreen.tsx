// src/flows/payments/HistoryScreen.tsx — /payments/history
//
// Every transaction: completed, pending, failed, refunded and reversed (WBS).
// A failed payment carries its retry here, because the history screen is where
// people look after a card declines.

import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Flex, Table, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import StatusTag from "../../shared/ui/StatusTag";
import Money from "../../shared/ui/Money";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { PAYMENT_HISTORY } from "../portalMocks";

export default function HistoryScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");

  return (
    <CustomerShell {...portal} width="wide">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Payment history
        </Typography.Title>

        <Card styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={PAYMENT_HISTORY}
            pagination={false}
            scroll={{ x: "max-content" }}
            rowKey="key"
            columns={[
              {
                title: "Date",
                dataIndex: "date",
                render: (d: string) => <DateText value={d} format="long" />,
              },
              {
                title: "Amount",
                dataIndex: "amount",
                align: "right",
                render: (a: number) => <Money amount={a} />,
              },
              { title: "Card", dataIndex: "method" },
              {
                title: "Status",
                dataIndex: "status",
                render: (s: (typeof PAYMENT_HISTORY)[number]["status"]) => (
                  <StatusTag kind="payment" status={s} />
                ),
              },
              {
                title: "",
                dataIndex: "key",
                align: "right",
                render: (_: string, row) =>
                  row.status === "Failed" ? (
                    <Button size="small" onClick={() => navigate({ to: "/payments/make" })}>
                      Try again
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      type="text"
                      onClick={() => navigate({ to: `/payments/result/${row.key}` })}
                    >
                      Details
                    </Button>
                  ),
              },
            ]}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
