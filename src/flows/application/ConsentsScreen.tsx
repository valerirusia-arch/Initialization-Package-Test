// src/flows/application/ConsentsScreen.tsx — step 1 of 6, /application/consents
//
// Credit authorization, electronic disclosures and consents, signed in
// DocuSign. The WBS: document packages are generated per state and per role,
// and the only thing the applicant does in DocuSign is sign.
//
// The screen says what the signature permits BEFORE handing anyone off. A
// credit authorization is permission to run a hard inquiry — being clear about
// that is the whole reason this is a separate step.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Flex, Typography } from "antd";
import ApplicationLayout from "../../features/application/ui/ApplicationLayout";
import { APPLICATION_STEPS, appStepIndex } from "../../features/application/ui/applicationSteps";
import ThirdPartyFrame from "../../shared/ui/ThirdPartyFrame";
import { useWizardChrome } from "../usePortal";

export default function ConsentsScreen() {
  const navigate = useNavigate();
  const chrome = useWizardChrome();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const step = appStepIndex("consents");

  return (
    <ApplicationLayout
      {...chrome}
      step={step}
      title="Give us permission to check your credit"
      description="Before we can look at your application we need your written permission. You will sign on DocuSign and come straight back here."
      onPrimary={state === "done" ? () => navigate({ to: APPLICATION_STEPS[step + 1].path }) : undefined}
      primaryLabel="Continue"
    >
      <Flex vertical gap={16}>
        <Typography.Paragraph type="secondary">
          You are signing two things: permission for us to request your credit
          report, and the disclosures your state requires. We will email you a
          copy of both, and they stay in your documents.
        </Typography.Paragraph>

        <ThirdPartyFrame
          provider="DocuSign"
          title="Credit authorization and disclosures"
          description="Signing takes about two minutes. The date is filled in for you — there is nothing else to complete."
          state={state}
          startLabel="Continue to DocuSign"
          onStart={() => {
            setState("loading");
            console.log("start docusign");
            window.setTimeout(() => setState("done"), 900);
          }}
          onRetry={() => setState("idle")}
        />
      </Flex>
    </ApplicationLayout>
  );
}
