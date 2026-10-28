// src/flows/loan/SignAgreementScreen.tsx — /loan/sign
//
// Signing the loan agreement package after approval. The package is generated
// per state and per role, and goes to DocuSign — the WBS is clear that loan
// documents are signed AFTER approval, separately from the application
// consents signed at the start.
//
// Both people sign. The screen shows whose signature is outstanding, because
// "waiting for the other person" is otherwise indistinguishable from "broken".

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Card, Descriptions, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import ThirdPartyFrame from "../../shared/ui/ThirdPartyFrame";
import StatusTag from "../../shared/ui/StatusTag";
import Money from "../../shared/ui/Money";
import { usePortal } from "../usePortal";
import { APPLICATION, LOAN } from "../portalMocks";

export default function SignAgreementScreen() {
  const navigate = useNavigate();
  const portal = usePortal("loan");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Flex align="center" justify="space-between" gap={12} wrap>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Sign your loan agreement
          </Typography.Title>
          <StatusTag kind="application" status="Approved" />
        </Flex>

        <Card title="What you are agreeing to">
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="You borrow">
              <Money amount={LOAN.amount} hideCents />
            </Descriptions.Item>
            <Descriptions.Item label="Rate">{LOAN.apr}% APR</Descriptions.Item>
            <Descriptions.Item label="You repay">
              {LOAN.termMonths} payments of <Money amount={LOAN.monthlyPayment} />
            </Descriptions.Item>
            <Descriptions.Item label="Total you repay">
              <Money amount={LOAN.totalRepayable} />
            </Descriptions.Item>
            <Descriptions.Item label="First payment">
              Within 45 days, then the 1st of each month
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <ThirdPartyFrame
          provider="DocuSign"
          title="Loan agreement and disclosures"
          description="Read each document, then sign. We will email you copies and keep them in your documents."
          state={state}
          startLabel="Read and sign"
          onStart={() => {
            setState("loading");
            console.log("start loan docusign");
            window.setTimeout(() => setState("done"), 900);
          }}
          onRetry={() => setState("idle")}
        />

        {state === "done" && (
          <Alert
            type="info"
            showIcon
            title={`Waiting for ${APPLICATION.coBorrower.name}`}
            description="Your part is done. We fund the loan once your co-borrower has signed too — we have reminded them, and we will tell you as soon as it is complete."
            action={
              <Typography.Link onClick={() => navigate({ to: "/loan" })}>
                Back to my loan
              </Typography.Link>
            }
          />
        )}
      </Flex>
    </CustomerShell>
  );
}
