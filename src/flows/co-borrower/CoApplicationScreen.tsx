// src/flows/co-borrower/CoApplicationScreen.tsx — /co-application
//
// The co-borrower's own list of tasks. The WBS says they provide the same
// information as the borrower and sign the same documents, so rather than
// cloning the six-step wizard this screen is a checklist that sends them into
// the steps that apply to them.
//
// Scoping is the rule that shapes it: a co-borrower has access to the ONE
// application they were invited to, and to nothing else. So there is no "my
// loans", no borrower nav, and no sight of the virtual card.

import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Divider, Flex, Typography } from "antd";
import { CheckCircleFilled, RightOutlined } from "@ant-design/icons";
import CustomerShell from "../../shared/ui/CustomerShell";
import DisplayTitle from "../../shared/ui/DisplayTitle";
import Money from "../../shared/ui/Money";
import { usePortal } from "../usePortal";
import { APPLICATION, LOAN } from "../portalMocks";

const TASKS = [
  {
    key: "details",
    title: "Your details",
    description: "Name, date of birth, address and Social Security number.",
    to: "/auth/register/identity",
    done: true,
  },
  {
    key: "consents",
    title: "Sign your permissions",
    description: "Credit authorization and the disclosures your state requires.",
    to: "/application/consents",
    done: true,
  },
  {
    key: "income",
    title: "Show your income",
    description: "One document that shows money coming in.",
    to: "/application/income",
    done: false,
  },
  {
    key: "card",
    title: "Add a debit card",
    description: "Used only if a payment is ever missed.",
    to: "/application/card",
    done: false,
  },
];

export default function CoApplicationScreen() {
  const navigate = useNavigate();
  const portal = usePortal();
  const remaining = TASKS.filter((t) => !t.done).length;

  return (
    <CustomerShell {...portal} nav={[]} userName="Alvaro G." width="narrow">
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <DisplayTitle level={2}>What María needs from you</DisplayTitle>
          <Typography.Paragraph type="secondary">
            {remaining === 0
              ? "You are done. We will let you both know when there is a decision."
              : `${remaining} ${remaining === 1 ? "thing" : "things"} left. You can stop and come back — nothing is lost.`}
          </Typography.Paragraph>
        </Flex>

        <Card>
          <Flex vertical>
            {TASKS.map((task, i) => (
              <div key={task.key}>
                {i > 0 && <Divider style={{ margin: "12px 0" }} />}
                <Flex align="center" justify="space-between" gap={12} wrap>
                  <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                    {task.done ? (
                      <CheckCircleFilled />
                    ) : (
                      <Typography.Text type="secondary">{i + 1}</Typography.Text>
                    )}
                    <Flex vertical>
                      <Typography.Text delete={false} strong={!task.done}>
                        {task.title}
                      </Typography.Text>
                      <Typography.Text type="secondary">{task.description}</Typography.Text>
                    </Flex>
                  </Flex>
                  <Button
                    type={task.done ? "text" : "primary"}
                    icon={task.done ? undefined : <RightOutlined />}
                    iconPlacement="end"
                    onClick={() => navigate({ to: task.to })}
                  >
                    {task.done ? "Change" : "Start"}
                  </Button>
                </Flex>
              </div>
            ))}
          </Flex>
        </Card>

        <Card title="The application you are supporting">
          <Flex vertical gap={4}>
            <Typography.Text>{APPLICATION.service}</Typography.Text>
            <Typography.Text type="secondary">
              <Money amount={APPLICATION.amount} hideCents /> at {LOAN.apr}% APR, repaid
              over {LOAN.termMonths} months
            </Typography.Text>
          </Flex>
        </Card>

        <Alert
          type="info"
          showIcon
          title="You can only see this application"
          description="Nothing else of María's is visible to you, and she cannot see your income documents or your card."
        />
      </Flex>
    </CustomerShell>
  );
}
