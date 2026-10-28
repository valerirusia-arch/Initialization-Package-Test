// src/flows/payments/MakePaymentScreen.tsx — /payments/make
//
// Paying the scheduled instalment. One amount, one card, one button.
//
// The confirmation says the exact amount and the exact card before anything is
// taken: this audience is, per the CFPB, more exposed to unclear financial
// terms, and "pay" buttons that do not restate the number are exactly that.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Card, Descriptions, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import PaymentMethodCard from "../../features/payments/ui/PaymentMethodCard";
import Money from "../../shared/ui/Money";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { LATE_FEE, LOAN, SAVED_CARD } from "../portalMocks";

export default function MakePaymentScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");
  const [paying, setPaying] = useState(false);

  const overdue = true;
  const fee = overdue ? LATE_FEE.amount : 0;
  const total = LOAN.monthlyPayment + fee;

  return (
    <CustomerShell
      {...portal}
      width="narrow"
      primaryAction={{
        label: `Pay ${total.toLocaleString("en-US", { style: "currency", currency: "USD" })}`,
        loading: paying,
        onClick: () => {
          setPaying(true);
          console.log("take payment", total);
          window.setTimeout(() => navigate({ to: "/payments/result/p4" }), 900);
        },
      }}
      secondaryAction={{ label: "Back", onClick: () => navigate({ to: "/payments" }) }}
    >
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Make your payment
        </Typography.Title>

        <Card title="What you are paying">
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="Monthly payment">
              <Money amount={LOAN.monthlyPayment} />
            </Descriptions.Item>
            {fee > 0 && (
              <Descriptions.Item label="Late fee">
                <Money amount={fee} type="danger" />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Total today">
              <Money amount={total} strong />
            </Descriptions.Item>
            <Descriptions.Item label="This covers">
              Payment 3 of {LOAN.termMonths}, due{" "}
              <DateText value="2027-03-01" format="long" />
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Flex vertical gap={8}>
          <Typography.Text strong>Paid with</Typography.Text>
          <PaymentMethodCard
            brand={SAVED_CARD.brand}
            number={SAVED_CARD.number}
            expiry={SAVED_CARD.expiry}
            active
            onUpdate={() => navigate({ to: "/payments/methods/update" })}
          />
        </Flex>

        {fee > 0 && (
          <Alert
            type="warning"
            showIcon
            title="Why there is a fee"
            description={LATE_FEE.reason}
          />
        )}
      </Flex>
    </CustomerShell>
  );
}
