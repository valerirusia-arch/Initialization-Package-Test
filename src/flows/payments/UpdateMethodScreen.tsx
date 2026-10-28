// src/flows/payments/UpdateMethodScreen.tsx — /payments/methods/update
//
// Replacing the repayment card. The WBS is specific: the old card is removed
// and the new one goes through the same Repay flow as the first time.
//
// So the screen says that plainly, in the order it happens — people expect
// "edit my card" and instead get "add a new one", and an unexplained
// difference at a payment screen reads as a fault.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import ThirdPartyFrame from "../../shared/ui/ThirdPartyFrame";
import PaymentMethodCard from "../../features/payments/ui/PaymentMethodCard";
import { usePortal } from "../usePortal";
import { SAVED_CARD } from "../portalMocks";

export default function UpdateMethodScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Change your card
        </Typography.Title>

        <Flex vertical gap={8}>
          <Typography.Text type="secondary">Your card now</Typography.Text>
          <PaymentMethodCard
            brand={SAVED_CARD.brand}
            number={SAVED_CARD.number}
            expiry={SAVED_CARD.expiry}
            active
          />
        </Flex>

        <Alert
          type="info"
          showIcon
          title="We replace the card rather than edit it"
          description="Your new card goes through the same checks as the first one. The old card stops being used as soon as the new one is confirmed — there is no gap where a payment could be missed."
        />

        <ThirdPartyFrame
          provider="Repay"
          title="Add your new debit card"
          description="A US debit card in your own name. Our payment partner collects the details — OPA only receives a secure token."
          state={state}
          startLabel="Add the new card"
          onStart={() => {
            setState("loading");
            console.log("open repay update form");
            window.setTimeout(() => setState("done"), 900);
          }}
          onRetry={() => setState("idle")}
        />

        {state === "done" && (
          <Alert
            type="success"
            showIcon
            title="Your new card is in use"
            description="Your next payment will come from it. Nothing else about your loan changes."
            action={
              <Typography.Link onClick={() => navigate({ to: "/payments" })}>
                Back to payments
              </Typography.Link>
            }
          />
        )}
      </Flex>
    </CustomerShell>
  );
}
