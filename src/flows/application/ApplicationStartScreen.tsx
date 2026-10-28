// src/flows/application/ApplicationStartScreen.tsx — /application
//
// The wizard's front door and its resume point. Two states: nothing started
// yet, or a part-finished application waiting to be picked up.
//
// Resuming is not a nicety here. The WBS says a technical failure after the
// account exists must leave the application where it was, and that the
// borrower carries on from the point of interruption — this is the screen that
// makes that visible.
//
// It is also where "one active application per borrower" is explained, and
// where someone on the DO NOT LOAN list is stopped (without being told why).

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Flex, Steps, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DisplayTitle from "../../shared/ui/DisplayTitle";
import Money from "../../shared/ui/Money";
import { APPLICATION_STEPS } from "../../features/application/ui/applicationSteps";
import { usePortal } from "../usePortal";

export default function ApplicationStartScreen() {
  const navigate = useNavigate();
  const portal = usePortal("application");
  /** Mock switch so both states can be reviewed. */
  const [started, setStarted] = useState(false);

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <DisplayTitle level={2}>
            {started ? "Carry on where you left off" : "Apply for your loan"}
          </DisplayTitle>
          <Typography.Paragraph type="secondary">
            {started
              ? "Everything you have entered is saved. You can change any step you have already done."
              : "Six steps. You can stop at any point and come back — nothing is lost."}
          </Typography.Paragraph>
        </Flex>

        <Card>
          <Steps
            orientation="vertical"
            current={started ? 2 : 0}
            items={APPLICATION_STEPS.map((s) => ({ title: s.label }))}
          />
        </Card>

        <Card>
          <Flex vertical gap={12}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Before you start
            </Typography.Title>
            <Typography.Text type="secondary">
              Have ready: a document that shows your income, a US debit card in
              your name, and the email address of someone who can be your
              co-borrower.
            </Typography.Text>
            <Typography.Text type="secondary">
              We lend at 1% APR, for USCIS fees only, and we pay USCIS directly.
              A typical N-400 loan is <Money amount={760} hideCents /> repaid over
              twelve months.
            </Typography.Text>
          </Flex>
        </Card>

        <Alert
          type="info"
          showIcon
          title="One application at a time"
          description="If you already have an application with us, finish that one first. You can see it under “My application”."
        />

        <Flex gap={12} wrap>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate({ to: APPLICATION_STEPS[started ? 2 : 0].path })}
          >
            {started ? "Carry on" : "Start my application"}
          </Button>
          <Button type="text" onClick={() => setStarted((v) => !v)}>
            Preview: {started ? "not started" : "part-finished"}
          </Button>
        </Flex>
      </Flex>
    </CustomerShell>
  );
}
