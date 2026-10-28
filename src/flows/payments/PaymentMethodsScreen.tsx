// src/flows/payments/PaymentMethodsScreen.tsx — /payments/methods
//
// The card saved for repayments. PROJECT.md §4.4: each person sees only the
// cards they added — a borrower and co-borrower never see each other's.

import { useNavigate } from "@tanstack/react-router";
import { Alert, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import PaymentMethodCard from "../../features/payments/ui/PaymentMethodCard";
import { usePortal } from "../usePortal";
import { SAVED_CARD } from "../portalMocks";

export default function PaymentMethodsScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            My card
          </Typography.Title>
          <Typography.Text type="secondary">
            This is the card we take your monthly payment from.
          </Typography.Text>
        </Flex>

        <PaymentMethodCard
          brand={SAVED_CARD.brand}
          number={SAVED_CARD.number}
          expiry={SAVED_CARD.expiry}
          active={SAVED_CARD.active}
          onUpdate={() => navigate({ to: "/payments/methods/update" })}
        />

        <Alert
          type="info"
          showIcon
          title="Only you can see this"
          description="If someone else is on your loan, they have their own card and you cannot see it — and they cannot see yours."
        />
      </Flex>
    </CustomerShell>
  );
}
