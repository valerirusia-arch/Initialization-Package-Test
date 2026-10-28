// src/flows/application/StatusScreen.tsx — /application/status
//
// Where the application is, and what the applicant can do about it.
//
// The statuses are the vocabulary from PROJECT.md §5, and the timeline says
// which automated checks have run. What it never shows is WHY a check failed:
// identity and sanctions results are not disclosed to the applicant — that
// rule is why "Pending action" sends people to a request for information
// rather than to an explanation.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Descriptions, Flex, Segmented, Steps, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import StatusTag from "../../shared/ui/StatusTag";
import Money from "../../shared/ui/Money";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { APPLICATION } from "../portalMocks";

type View = "Under review" | "Pending action" | "Approved" | "Declined";

export default function StatusScreen() {
  const navigate = useNavigate();
  const portal = usePortal("application");
  const [status, setStatus] = useState<View>("Under review");

  const stage =
    status === "Under review" ? 2 : status === "Pending action" ? 2 : 3;

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Flex align="center" justify="space-between" gap={12} wrap>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Your application
          </Typography.Title>
          <StatusTag kind="application" status={status} />
        </Flex>

        {status === "Pending action" && (
          <Alert
            type="warning"
            showIcon
            title="We need something from you"
            description="Someone has looked at your application and asked for one more thing. Until we have it, your application waits."
            action={
              <Button size="small" onClick={() => navigate({ to: "/application/additional-info" })}>
                See what is needed
              </Button>
            }
          />
        )}

        {status === "Approved" && (
          <Alert
            type="success"
            showIcon
            title="Your loan is approved"
            description="Sign your loan agreement and we will put the money on your card."
            action={
              <Button size="small" type="primary" onClick={() => navigate({ to: "/loan/sign" })}>
                Sign the agreement
              </Button>
            }
          />
        )}

        {status === "Declined" && (
          <Alert
            type="error"
            showIcon
            title="We cannot offer you a loan this time"
            description="We have sent you a letter by email explaining what you can do next, including how to see the information we used. You can apply again in the future."
          />
        )}

        <Card>
          <Steps
            orientation="vertical"
            current={stage}
            status={status === "Declined" ? "error" : "process"}
            items={[
              { title: "Application sent", content: "We have everything you entered." },
              { title: "Identity confirmed", content: "We checked who you are." },
              {
                title: "Under review",
                content:
                  status === "Pending action"
                    ? "Waiting for the information we asked you for."
                    : "We are checking your credit and your income.",
              },
              {
                title: "Decision",
                content:
                  status === "Approved"
                    ? "Approved — sign your agreement."
                    : status === "Declined"
                      ? "We could not approve this application."
                      : "We will email and text you as soon as we know.",
              },
            ]}
          />
        </Card>

        <Card title="What you applied for">
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="Application">#{APPLICATION.id}</Descriptions.Item>
            <Descriptions.Item label="Sent">
              <DateText value={APPLICATION.submittedOn} format="long" />
            </Descriptions.Item>
            <Descriptions.Item label="USCIS service">{APPLICATION.service}</Descriptions.Item>
            <Descriptions.Item label="Amount">
              <Money amount={APPLICATION.amount} hideCents />
            </Descriptions.Item>
            <Descriptions.Item label="Co-borrower">
              {APPLICATION.coBorrower.name}{" "}
              <StatusTag kind="invitation" status={APPLICATION.coBorrower.invitationStatus} />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Flex gap={12} wrap>
          <Button onClick={() => navigate({ to: "/application/documents" })}>
            My documents
          </Button>
          <Button type="text" danger onClick={() => navigate({ to: "/application/withdraw" })}>
            Withdraw this application
          </Button>
        </Flex>

        <Card size="small" title="Preview other states">
          <Segmented
            value={status}
            onChange={(v) => setStatus(v as View)}
            options={["Under review", "Pending action", "Approved", "Declined"]}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
