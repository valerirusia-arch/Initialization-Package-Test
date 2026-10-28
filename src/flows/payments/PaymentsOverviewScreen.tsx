// src/flows/payments/PaymentsOverviewScreen.tsx — /payments
//
// What is owed, when, and the button to pay it. Everything else on this screen
// is secondary to that one card.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Descriptions, Flex, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import NextPaymentCard from "../../features/payments/ui/NextPaymentCard";
import PaymentMethodCard from "../../features/payments/ui/PaymentMethodCard";
import Money from "../../shared/ui/Money";
import { usePortal } from "../usePortal";
import { LATE_FEE, LOAN, SAVED_CARD } from "../portalMocks";

type View = "upcoming" | "overdue" | "paid-off";

export default function PaymentsOverviewScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");
  const [view, setView] = useState<View>("upcoming");

  return (
    <CustomerShell {...portal} width="wide">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Payments
        </Typography.Title>

        <Flex gap={24} align="start" wrap>
          <Flex vertical gap={24} style={{ flex: "1 1 340px", minWidth: 0 }}>
            <NextPaymentCard
              amount={LOAN.monthlyPayment}
              dueDate={view === "overdue" ? "2027-03-01" : LOAN.nextPaymentDue}
              overdue={view === "overdue"}
              fee={view === "overdue" ? LATE_FEE.amount : undefined}
              feeReason={view === "overdue" ? LATE_FEE.reason : undefined}
              paidOff={view === "paid-off"}
              onPay={() => navigate({ to: "/payments/make" })}
              onPayExtra={() => navigate({ to: "/payments/extra" })}
            />

            <PaymentMethodCard
              brand={SAVED_CARD.brand}
              number={SAVED_CARD.number}
              expiry={SAVED_CARD.expiry}
              active={SAVED_CARD.active}
              onUpdate={() => navigate({ to: "/payments/methods/update" })}
            />
          </Flex>

          <Flex vertical gap={24} style={{ flex: "1 1 320px", minWidth: 0 }}>
            <Card title="Where you are">
              <Descriptions column={1} colon={false} size="small">
                <Descriptions.Item label="Still to repay">
                  <Money amount={view === "paid-off" ? 0 : LOAN.outstanding} />
                </Descriptions.Item>
                <Descriptions.Item label="Borrowed">
                  <Money amount={LOAN.amount} hideCents />
                </Descriptions.Item>
                <Descriptions.Item label="Rate">{LOAN.apr}% APR</Descriptions.Item>
                <Descriptions.Item label="Payments made">
                  {view === "paid-off" ? LOAN.termMonths : 2} of {LOAN.termMonths}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="More">
              <Flex vertical gap={8} align="start">
                <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/payments/schedule" })}>
                  My repayment schedule
                </Button>
                <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/payments/history" })}>
                  Everything I have paid
                </Button>
                <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/payments/fees" })}>
                  Late fees
                </Button>
                <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/payments/methods" })}>
                  My card
                </Button>
              </Flex>
            </Card>

            <Card size="small" title="Preview">
              <Segmented
                value={view}
                onChange={(v) => setView(v as View)}
                options={[
                  { label: "Up to date", value: "upcoming" },
                  { label: "Overdue", value: "overdue" },
                  { label: "Paid off", value: "paid-off" },
                ]}
              />
            </Card>
          </Flex>
        </Flex>
      </Flex>
    </CustomerShell>
  );
}
