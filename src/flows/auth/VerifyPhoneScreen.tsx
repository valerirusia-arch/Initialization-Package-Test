// src/flows/auth/VerifyPhoneScreen.tsx
//
// Registration, step 6 of 6 — route: /auth/register/verify-phone
//
// The last step, so the primary action says what it does: "Create my account".
// What happens next is stated here rather than discovered on the next screen —
// identity verification runs after the account exists, and if it cannot
// complete the applicant must know their progress is kept.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Flex } from "antd";
import RegistrationLayout from "../../features/auth/ui/RegistrationLayout";
import OtpField from "../../features/auth/ui/OtpField";
import { REGISTRATION_STEPS, stepIndex } from "../../features/auth/ui/registrationSteps";
import { MOCK_APPLICANT } from "./mocks";

export default function VerifyPhoneScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const step = stepIndex("verify-phone");

  const submit = () => {
    // Design Mode: simulate the submit, stub the real work for Dev.
    setSubmitting(true);
    console.log("create account", code);
    window.setTimeout(() => {
      setSubmitting(false);
      navigate({ to: "/auth/login" });
    }, 900);
  };

  return (
    <RegistrationLayout
      step={step}
      title="Confirm your phone number"
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      onBack={() => navigate({ to: REGISTRATION_STEPS[step - 1].path })}
      primaryLabel="Create my account"
      onPrimary={submit}
      primaryLoading={submitting}
      primaryDisabled={code.length < 6}
      onStepClick={(i) => navigate({ to: REGISTRATION_STEPS[i].path })}
    >
      <Flex vertical gap={24}>
        <OtpField
          sentTo={MOCK_APPLICANT.maskedPhone}
          value={code}
          onChange={setCode}
          onComplete={() => submit()}
          onResend={() => console.log("resend sms code")}
          disabled={submitting}
        />

        <Alert
          type="info"
          showIcon
          title="What happens after this"
          description="We create your account and check your identity. This usually takes under a minute. If something goes wrong on our side, nothing you entered is lost — you can come back and carry on."
        />
      </Flex>
    </RegistrationLayout>
  );
}
