// src/flows/auth/VerifyEmailScreen.tsx
//
// Registration, step 5 of 6 — route: /auth/register/verify-email
//
// The code is stubbed: entering 000000 shows the error state so the state can
// be reviewed without a back end. Everything else is a console.log for Dev.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Flex } from "antd";
import RegistrationLayout from "../../features/auth/ui/RegistrationLayout";
import OtpField from "../../features/auth/ui/OtpField";
import { REGISTRATION_STEPS, stepIndex } from "../../features/auth/ui/registrationSteps";
import { MOCK_APPLICANT } from "./mocks";

export default function VerifyEmailScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const step = stepIndex("verify-email");

  const submit = (value: string) => {
    if (value === "000000") {
      setError("That code did not match. Check the last email we sent, or ask for a new one.");
      return;
    }
    console.log("verify email", value);
    navigate({ to: REGISTRATION_STEPS[step + 1].path });
  };

  return (
    <RegistrationLayout
      step={step}
      title="Confirm your email address"
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      onBack={() => navigate({ to: REGISTRATION_STEPS[step - 1].path })}
      onPrimary={() => submit(code)}
      primaryDisabled={code.length < 6}
      onStepClick={(i) => navigate({ to: REGISTRATION_STEPS[i].path })}
    >
      <Flex vertical gap={24}>
        <OtpField
          sentTo={MOCK_APPLICANT.maskedEmail}
          value={code}
          error={error}
          onChange={(v) => {
            setCode(v);
            setError(undefined);
          }}
          onComplete={submit}
          onResend={() => console.log("resend email code")}
        />

        {/* A typo two screens ago is the most common reason a code never
            arrives, so the way back is on this screen, not in support. */}
        <Button
          type="link"
          style={{ padding: 0, height: "auto", alignSelf: "flex-start" }}
          onClick={() => navigate({ to: REGISTRATION_STEPS[0].path })}
        >
          Wrong address? Change your email
        </Button>
      </Flex>
    </RegistrationLayout>
  );
}
