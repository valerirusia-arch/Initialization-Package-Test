// src/flows/co-borrower/InvitationScreen.tsx — /invitation/:token
//
// Where an invited co-borrower lands from their email. Reads the token with
// useParams — navigation only, no loader (that is Dev's, in /app).
//
// The hard part of this screen is not layout, it is honesty. Someone has been
// asked by a friend or relative to take on joint responsibility for a loan,
// often without much context. So before any sign-up button: who invited you,
// what it costs, and — stated plainly — that you are responsible for repaying
// it if they do not.
//
// Three states, all reachable from the same link: open, expired (5 calendar
// days per the WBS), and already accepted.

import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Alert, Button, Card, Descriptions, Flex, Result, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DisplayTitle from "../../shared/ui/DisplayTitle";
import Money from "../../shared/ui/Money";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { APPLICATION, LOAN } from "../portalMocks";

type View = "open" | "expired" | "accepted";

export default function InvitationScreen() {
  const navigate = useNavigate();
  const portal = usePortal();
  // `strict: false` because the tree is built at runtime from routes.tsx.
  const params = useParams({ strict: false }) as { token?: string };
  const [view, setView] = useState<View>("open");

  return (
    <CustomerShell
      {...portal}
      nav={[]}
      userName={undefined}
      width="narrow"
      primaryAction={
        view === "open"
          ? {
              label: "Yes, I will be a co-borrower",
              onClick: () => navigate({ to: "/auth/set-password" }),
            }
          : undefined
      }
    >
      <Flex vertical gap={24}>
        {view === "expired" && (
          <Card>
            <Result
              status="warning"
              title="This invitation has expired"
              subTitle="Invitations last 5 days. Ask María to send you a new one — everything on her application is still there."
            />
          </Card>
        )}

        {view === "accepted" && (
          <Card>
            <Result
              status="success"
              title="You have already accepted"
              subTitle="Sign in to carry on with the information we need from you."
              extra={
                <Button type="primary" onClick={() => navigate({ to: "/auth/login" })}>
                  Sign in
                </Button>
              }
            />
          </Card>
        )}

        {view === "open" && (
          <>
            <Flex vertical gap={8}>
              <DisplayTitle level={2}>
                {APPLICATION.coBorrower.name.split(" ")[0]}, María has asked for your help
              </DisplayTitle>
              <Typography.Paragraph type="secondary">
                María González is applying to OPA for a loan to pay her US
                citizenship fee. She has asked you to be her co-borrower.
              </Typography.Paragraph>
            </Flex>

            <Card title="What she is applying for">
              <Descriptions column={1} colon={false} size="small">
                <Descriptions.Item label="For">{APPLICATION.service}</Descriptions.Item>
                <Descriptions.Item label="Amount">
                  <Money amount={APPLICATION.amount} hideCents />
                </Descriptions.Item>
                <Descriptions.Item label="Rate">{LOAN.apr}% APR</Descriptions.Item>
                <Descriptions.Item label="Repaid over">
                  {LOAN.termMonths} months, <Money amount={LOAN.monthlyPayment} /> a month
                </Descriptions.Item>
                <Descriptions.Item label="Invitation expires">
                  <DateText value={APPLICATION.coBorrower.expiresOn} format="long" />
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Alert
              type="warning"
              showIcon
              title="Being a co-borrower means you are responsible for the loan"
              description="If María does not make a payment, we will ask you for it. The loan will appear on your credit file, and missed payments will affect your credit as well as hers. Please be sure before you agree."
            />

            <Card title="What happens if you say yes">
              <Flex vertical gap={8}>
                <Typography.Text type="secondary">
                  1. You create an account and set a password.
                </Typography.Text>
                <Typography.Text type="secondary">
                  2. You give us the same information María did — your details,
                  your income, and a debit card.
                </Typography.Text>
                <Typography.Text type="secondary">
                  3. You sign the same documents she signed.
                </Typography.Text>
                <Typography.Text type="secondary">
                  You will only ever see this one application — nothing else of
                  María's, and she will not see your financial information.
                </Typography.Text>
              </Flex>
            </Card>

            <Flex justify="center">
              <Button type="text" onClick={() => navigate({ to: "/support" })}>
                I am not sure — I have questions
              </Button>
            </Flex>
          </>
        )}

        <Card size="small" title="Preview other states">
          <Flex vertical gap={8}>
            <Segmented
              value={view}
              onChange={(v) => setView(v as View)}
              options={[
                { label: "Open", value: "open" },
                { label: "Expired", value: "expired" },
                { label: "Already accepted", value: "accepted" },
              ]}
            />
            <Typography.Text type="secondary">
              Invitation token: {params.token ?? "—"}
            </Typography.Text>
          </Flex>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
