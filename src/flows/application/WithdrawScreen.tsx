// src/flows/application/WithdrawScreen.tsx — /application/withdraw
//
// Withdrawing before a decision. A destructive, irreversible action, so it
// gets its own screen rather than a modal fired from a menu: what it means,
// what it does not mean, and a deliberate confirmation.
//
// Tone matters here. Someone withdrawing may be frightened about their status,
// not annoyed with us — so the copy is matter-of-fact and says they can come
// back.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Checkbox, Flex, Form, Input, Result, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import { usePortal } from "../usePortal";

export default function WithdrawScreen() {
  const navigate = useNavigate();
  const portal = usePortal("application");
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <CustomerShell {...portal} width="narrow">
        <Card>
          <Result
            status="info"
            title="Your application is withdrawn"
            subTitle="Nothing further will happen with it. If you want to apply again later, you can — you will start a new application."
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
          Withdraw your application
        </Typography.Title>

        <Alert
          type="warning"
          showIcon
          title="This cannot be undone"
          description="We stop reviewing your application and no decision is made. Your account stays, and so do the documents you have already signed."
        />

        <Card>
          <Flex vertical gap={16}>
            <Typography.Text>
              Withdrawing does <Typography.Text strong>not</Typography.Text> affect
              your immigration application, and it does not stop you applying to
              OPA again later.
            </Typography.Text>

            <Form layout="vertical">
              <Form.Item label="Would you tell us why?" help="Optional, and it does not change anything.">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>

            <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}>
              I understand that my application will be withdrawn
            </Checkbox>

            <Flex gap={12} wrap>
              <Button
                danger
                type="primary"
                disabled={!confirmed}
                onClick={() => {
                  console.log("withdraw application");
                  setDone(true);
                }}
              >
                Withdraw my application
              </Button>
              <Button type="text" onClick={() => navigate({ to: "/application/status" })}>
                Keep my application
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
