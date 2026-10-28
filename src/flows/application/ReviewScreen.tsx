// src/flows/application/ReviewScreen.tsx — step 6 of 6, /application/review
//
// The last place anything can be corrected. Submitting starts Loan
// Decisioning, which includes a hard credit inquiry — so the button says what
// it does and the screen says what follows it.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Flex } from "antd";
import ApplicationLayout from "../../features/application/ui/ApplicationLayout";
import { APPLICATION_STEPS, appStepIndex } from "../../features/application/ui/applicationSteps";
import ReviewSummary from "../../features/application/ui/ReviewSummary";
import MaskedValue from "../../shared/ui/MaskedValue";
import Money from "../../shared/ui/Money";
import StatusTag from "../../shared/ui/StatusTag";
import { useWizardChrome } from "../usePortal";
import { APPLICATION } from "../portalMocks";

export default function ReviewScreen() {
  const navigate = useNavigate();
  const chrome = useWizardChrome();
  const [submitting, setSubmitting] = useState(false);
  const step = appStepIndex("review");
  const go = (path: string) => navigate({ to: path });

  return (
    <ApplicationLayout
      {...chrome}
      step={step}
      title="Check everything, then send"
      description="Once you send this we ask the credit bureau for your report, so please make sure it is all correct."
      onBack={() => navigate({ to: APPLICATION_STEPS[step - 1].path })}
      primaryLabel="Send my application"
      primaryLoading={submitting}
      onPrimary={() => {
        setSubmitting(true);
        console.log("submit application");
        window.setTimeout(() => navigate({ to: "/application/submitted" }), 900);
      }}
      onStepClick={(i) => navigate({ to: APPLICATION_STEPS[i].path })}
    >
      <Flex vertical gap={24}>
        <ReviewSummary
          sections={[
            {
              key: "you",
              title: "About you",
              onChange: () => go("/auth/register"),
              items: [
                { label: "Name", value: "María González" },
                { label: "Date of birth", value: "14 March 1991" },
                {
                  label: "Social Security number",
                  value: <MaskedValue value="123-45-6789" kind="ssn" />,
                },
                { label: "Address", value: "48 Hyde Park Ave, Boston, MA 02130" },
              ],
            },
            {
              key: "income",
              title: "Your income",
              onChange: () => go("/application/income"),
              items: [
                { label: "Annual income", value: <Money amount={38400} hideCents /> },
                { label: "Document", value: "paystub-october.pdf" },
              ],
            },
            {
              key: "loan",
              title: "What you need",
              onChange: () => go("/application/details"),
              items: [
                { label: "USCIS service", value: APPLICATION.service },
                { label: "Loan amount", value: <Money amount={APPLICATION.amount} hideCents /> },
                { label: "Rate", value: "1% APR" },
              ],
            },
            {
              key: "co",
              title: "Co-borrower",
              onChange: () => go("/application/co-borrower"),
              items: [
                { label: "Name", value: APPLICATION.coBorrower.name },
                {
                  label: "Invitation",
                  value: <StatusTag kind="invitation" status="Pending" />,
                },
              ],
            },
            {
              key: "card",
              title: "Repayment card",
              onChange: () => go("/application/card"),
              items: [
                {
                  label: "Card",
                  value: <MaskedValue value="4111 1111 1111 4242" kind="card" prefix="Visa" />,
                },
              ],
            },
          ]}
        />

        <Alert
          type="warning"
          showIcon
          title="Sending this runs a credit check"
          description="It appears on your credit file as a hard inquiry. We only do it once, and only after you press the button below."
        />
      </Flex>
    </ApplicationLayout>
  );
}
