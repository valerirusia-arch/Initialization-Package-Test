// src/flows/payments/ExtraPaymentScreen.tsx — /payments/extra
//
// An extra payment: catching up, paying more than the instalment, or clearing
// the loan early.
//
// At 1% APR there is no early-repayment penalty, and saying so is the point of
// the screen — people assume there is one, and that assumption costs them.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Card, Flex, Form, InputNumber, Radio, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import Money from "../../shared/ui/Money";
import { usePortal } from "../usePortal";
import { LOAN } from "../portalMocks";

type Choice = "instalment" | "payoff" | "other";

export default function ExtraPaymentScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");
  const [choice, setChoice] = useState<Choice>("payoff");
  const [other, setOther] = useState<number | null>(null);

  const amount =
    choice === "instalment"
      ? LOAN.monthlyPayment
      : choice === "payoff"
        ? LOAN.outstanding
        : (other ?? 0);

  return (
    <CustomerShell
      {...portal}
      width="narrow"
      primaryAction={{
        label: "Continue",
        disabled: amount <= 0,
        onClick: () => {
          console.log("extra payment", amount);
          navigate({ to: "/payments/result/p5" });
        },
      }}
      secondaryAction={{ label: "Back", onClick: () => navigate({ to: "/payments" }) }}
    >
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Pay a different amount
        </Typography.Title>

        <Alert
          type="success"
          showIcon
          title="There is no penalty for paying early"
          description="Your rate is 1%. If you pay more, or pay the whole loan off now, you simply stop paying interest sooner. Nothing is added."
        />

        <Card>
          <Radio.Group
            value={choice}
            onChange={(e) => setChoice(e.target.value as Choice)}
            style={{ width: "100%" }}
          >
            <Flex vertical gap={16}>
              <Radio value="instalment">
                One more monthly payment — <Money amount={LOAN.monthlyPayment} />
              </Radio>
              <Radio value="payoff">
                Pay off the whole loan — <Money amount={LOAN.outstanding} />
              </Radio>
              <Radio value="other">A different amount</Radio>
            </Flex>
          </Radio.Group>

          {choice === "other" && (
            <Form layout="vertical" style={{ marginTop: 16 }}>
              <Form.Item
                label="How much do you want to pay?"
                help={`Anything up to ${LOAN.outstanding.toLocaleString("en-US", { style: "currency", currency: "USD" })}.`}
              >
                <InputNumber
                  value={other}
                  onChange={setOther}
                  prefix="$"
                  min={1}
                  max={LOAN.outstanding}
                  style={{ width: 200 }}
                />
              </Form.Item>
            </Form>
          )}
        </Card>

        <Card title="After this payment">
          <Flex vertical gap={4}>
            <Typography.Text>
              You would still owe{" "}
              <Money amount={Math.max(0, LOAN.outstanding - amount)} strong />
            </Typography.Text>
            <Typography.Text type="secondary">
              {amount >= LOAN.outstanding
                ? "That clears your loan. Your schedule ends and nothing more is taken."
                : "Your monthly payments carry on as scheduled until the loan is cleared."}
            </Typography.Text>
          </Flex>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
