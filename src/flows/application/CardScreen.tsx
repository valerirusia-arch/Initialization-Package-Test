// src/flows/application/CardScreen.tsx — step 5 of 6, /application/card
//
// The repayment card. PROJECT.md §6: card entry is a Repay embedded form and a
// black box to us — only a token is ever stored, US debit cards only, and we
// never hand-build a card form. The surrounding explanation is ours.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Flex } from "antd";
import ApplicationLayout from "../../features/application/ui/ApplicationLayout";
import { APPLICATION_STEPS, appStepIndex } from "../../features/application/ui/applicationSteps";
import ThirdPartyFrame from "../../shared/ui/ThirdPartyFrame";
import { useWizardChrome } from "../usePortal";

export default function CardScreen() {
  const navigate = useNavigate();
  const chrome = useWizardChrome();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const step = appStepIndex("card");

  return (
    <ApplicationLayout
      {...chrome}
      step={step}
      title="How you will repay"
      description="We take your monthly payment from a debit card. Nothing is taken until your loan is approved and funded."
      onBack={() => navigate({ to: APPLICATION_STEPS[step - 1].path })}
      onPrimary={state === "done" ? () => navigate({ to: APPLICATION_STEPS[step + 1].path }) : undefined}
      onStepClick={(i) => navigate({ to: APPLICATION_STEPS[i].path })}
    >
      <Flex vertical gap={16}>
        <Alert
          type="info"
          showIcon
          title="A US debit card in your own name"
          description="We cannot accept credit cards, prepaid cards or a card belonging to someone else."
        />

        <ThirdPartyFrame
          provider="Repay"
          title="Add your debit card"
          description="Our payment partner collects your card details directly. OPA only receives a secure token — we never see or store your card number."
          state={state}
          startLabel="Add my card"
          onStart={() => {
            setState("loading");
            console.log("open repay form");
            window.setTimeout(() => setState("done"), 900);
          }}
          onRetry={() => setState("idle")}
        />
      </Flex>
    </ApplicationLayout>
  );
}
