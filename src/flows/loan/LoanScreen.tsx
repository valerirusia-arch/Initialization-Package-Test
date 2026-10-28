// src/flows/loan/LoanScreen.tsx — /loan
//
// The loan itself: amount, what is left on the card, APR, terms and schedule
// (WBS). Visible to the borrower AND the co-borrower — except the virtual
// card, which the co-borrower may never see.
//
// That difference is a prop, not a separate screen: one layout, one set of
// copy, and the card panel simply explains itself when it cannot be shown.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Flex, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import LoanSummary from "../../features/loan/ui/LoanSummary";
import NextPaymentCard from "../../features/payments/ui/NextPaymentCard";
import { usePortal } from "../usePortal";
import { LOAN } from "../portalMocks";

export default function LoanScreen() {
  const navigate = useNavigate();
  const portal = usePortal("loan");
  /** Mock switch: the same screen for both people on the loan. */
  const [role, setRole] = useState<"borrower" | "co-borrower">("borrower");

  return (
    <CustomerShell {...portal} width="wide">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          My loan
        </Typography.Title>

        <Flex gap={24} align="start" wrap>
          <Flex vertical gap={24} style={{ flex: "1 1 320px", minWidth: 0 }}>
            <LoanSummary
              status={LOAN.status}
              amount={LOAN.amount}
              unusedBalance={LOAN.unusedBalance}
              outstanding={LOAN.outstanding}
              apr={LOAN.apr}
              termMonths={LOAN.termMonths}
              monthlyPayment={LOAN.monthlyPayment}
              nextPaymentDue={LOAN.nextPaymentDue}
            />

            <Card title="Your documents">
              <Flex vertical gap={12} align="start">
                <Typography.Text type="secondary">
                  Your loan agreement and disclosures, ready to download.
                </Typography.Text>
                <Button onClick={() => navigate({ to: "/loan/documents" })}>
                  See my documents
                </Button>
              </Flex>
            </Card>
          </Flex>

          <Flex vertical gap={24} style={{ flex: "1 1 320px", minWidth: 0 }}>
            <NextPaymentCard
              amount={LOAN.monthlyPayment}
              dueDate={LOAN.nextPaymentDue}
              onPay={() => navigate({ to: "/payments/make" })}
              onPayExtra={() => navigate({ to: "/payments/extra" })}
            />

            {role === "borrower" && (
              <Card title="Your payment card">
                <Flex vertical gap={12} align="start">
                  <Typography.Text type="secondary">
                    Use it to pay your USCIS fee. Only you can see it.
                  </Typography.Text>
                  <Button type="primary" onClick={() => navigate({ to: "/loan/card" })}>
                    See my card
                  </Button>
                </Flex>
              </Card>
            )}

            <Card size="small" title="Preview as">
              <Segmented
                value={role}
                onChange={(v) => setRole(v as "borrower" | "co-borrower")}
                options={[
                  { label: "Borrower", value: "borrower" },
                  { label: "Co-borrower", value: "co-borrower" },
                ]}
              />
            </Card>
          </Flex>
        </Flex>

        <Flex>
          <Button type="text" danger onClick={() => navigate({ to: "/loan/cancel" })}>
            Cancel this loan
          </Button>
        </Flex>
      </Flex>
    </CustomerShell>
  );
}
