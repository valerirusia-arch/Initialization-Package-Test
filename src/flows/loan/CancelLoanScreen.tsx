// src/flows/loan/CancelLoanScreen.tsx — /loan/cancel
//
// Cancelling an approved loan. The WBS allows it only BEFORE the virtual card
// has been used, so the screen has two states and the blocked one is the
// important one: it explains why, and sends people to the thing they can
// actually do instead (repay early, with no penalty at 1%).

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Checkbox, Flex, Result, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import Money from "../../shared/ui/Money";
import { usePortal } from "../usePortal";
import { LOAN } from "../portalMocks";

export default function CancelLoanScreen() {
  const navigate = useNavigate();
  const portal = usePortal("loan");
  const [cardUsed, setCardUsed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <CustomerShell {...portal} width="narrow">
        <Card>
          <Result
            status="info"
            title="Your loan is cancelled"
            subTitle="The card has been switched off and you owe nothing. You can apply again whenever you are ready."
            extra={
              <Button type="primary" onClick={() => navigate({ to: "/application" })}>
                Back to the start
              </Button>
            }
          />
        </Card>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Cancel your loan
        </Typography.Title>

        {cardUsed ? (
          <>
            <Alert
              type="warning"
              showIcon
              title="This loan cannot be cancelled now"
              description="Your card has already been used to pay USCIS, so the money has left us. The loan stands and the repayment schedule applies."
            />
            <Card>
              <Flex vertical gap={12} align="start">
                <Typography.Text>
                  You can still repay it early at any time. At 1% APR there is no
                  penalty for paying it off sooner — you simply stop paying
                  interest.
                </Typography.Text>
                <Button type="primary" onClick={() => navigate({ to: "/payments/extra" })}>
                  Repay early instead
                </Button>
              </Flex>
            </Card>
          </>
        ) : (
          <>
            <Alert
              type="info"
              showIcon
              title="You can still cancel"
              description="Your card has not been used yet, so nothing has been paid out."
            />
            <Card>
              <Flex vertical gap={16}>
                <Typography.Text>
                  Cancelling switches off your card for{" "}
                  <Money amount={LOAN.unusedBalance} hideCents />, ends the loan and
                  cancels the repayment schedule. You will owe nothing.
                </Typography.Text>
                <Typography.Text type="secondary">
                  Your co-borrower will be told, and both of you keep copies of
                  the documents you signed.
                </Typography.Text>

                <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
                  I understand that my loan and my card will be cancelled
                </Checkbox>

                <Flex gap={12} wrap>
                  <Button
                    danger
                    type="primary"
                    disabled={!confirmed}
                    onClick={() => {
                      console.log("cancel loan");
                      setDone(true);
                    }}
                  >
                    Cancel my loan
                  </Button>
                  <Button type="text" onClick={() => navigate({ to: "/loan" })}>
                    Keep my loan
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </>
        )}

        <Card size="small" title="Preview">
          <Segmented
            value={cardUsed ? "used" : "unused"}
            onChange={(v) => setCardUsed(v === "used")}
            options={[
              { label: "Card not used yet", value: "unused" },
              { label: "Card already used", value: "used" },
            ]}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
