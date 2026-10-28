// src/flows/payments/PaymentResultScreen.tsx — /payments/result/:id
//
// The outcome of one transaction. The WBS lists five: succeeded, pending,
// failed, refunded and reversed — and requires that a failed or reversed
// payment can be retried.
//
// Refunded and reversed are the two most confusing words on the site, so each
// gets a sentence explaining what actually happened to the money rather than
// just a coloured tag.

import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button, Card, Descriptions, Flex, Result, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import StatusTag from "../../shared/ui/StatusTag";
import Money from "../../shared/ui/Money";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { LOAN, SAVED_CARD } from "../portalMocks";

type Outcome = "Succeeded" | "Pending" | "Failed" | "Refunded" | "Reversed";

const EXPLANATION: Record<Outcome, { status: "success" | "info" | "error" | "warning"; title: string; text: string }> = {
  Succeeded: {
    status: "success",
    title: "Your payment went through",
    text: "The money has left your card and your balance is updated. You will see it on your statement within a few days.",
  },
  Pending: {
    status: "info",
    title: "Your payment is on its way",
    text: "Your bank is still processing it. This usually takes a few hours. You do not need to do anything, and you will not be charged twice.",
  },
  Failed: {
    status: "error",
    title: "Your payment did not go through",
    text: "Nothing was taken from your card. This is most often not enough money in the account, or a card that has expired.",
  },
  Refunded: {
    status: "info",
    title: "This payment was refunded",
    text: "We sent the money back to your card. It can take up to ten days to appear, and the amount has been added back to what you owe.",
  },
  Reversed: {
    status: "warning",
    title: "This payment was reversed",
    text: "Your bank took the money back after it had gone through — usually because the account did not have enough in it. The amount has been added back to what you owe.",
  },
};

export default function PaymentResultScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");
  const params = useParams({ strict: false }) as { id?: string };
  const [outcome, setOutcome] = useState<Outcome>("Succeeded");

  const copy = EXPLANATION[outcome];
  const canRetry = outcome === "Failed" || outcome === "Reversed";

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Card>
          <Result
            status={copy.status}
            title={copy.title}
            subTitle={copy.text}
            extra={
              <Flex gap={12} justify="center" wrap>
                {canRetry && (
                  <Button type="primary" onClick={() => navigate({ to: "/payments/make" })}>
                    Try the payment again
                  </Button>
                )}
                <Button onClick={() => navigate({ to: "/payments" })}>Back to payments</Button>
              </Flex>
            }
          />
        </Card>

        <Card title="This payment">
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="Reference">
              {params.id ?? "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Money amount={LOAN.monthlyPayment} />
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              <DateText value="2027-03-02" format="long" />
            </Descriptions.Item>
            <Descriptions.Item label="Card">
              {SAVED_CARD.brand} ending 4242
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusTag kind="payment" status={outcome} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {canRetry && (
          <Card>
            <Typography.Text type="secondary">
              If it fails again, try a different card, or call us on 617-404-9797
              — we would rather sort it out than let a fee build up.
            </Typography.Text>
          </Card>
        )}

        <Card size="small" title="Preview every outcome">
          <Segmented
            value={outcome}
            onChange={(v) => setOutcome(v as Outcome)}
            options={["Succeeded", "Pending", "Failed", "Refunded", "Reversed"]}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
