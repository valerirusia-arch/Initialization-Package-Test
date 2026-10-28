// src/flows/auth/RegisterSecurityScreen.tsx
//
// Registration, step 3 of 6 — route: /auth/register/security
//
// Password and communication preferences. The rules are a live checklist, not
// an error after submitting: someone setting up their first US account should
// see what is still missing while they type.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Checkbox, Divider, Form, Input, Typography } from "antd";
import RegistrationLayout from "../../features/auth/ui/RegistrationLayout";
import PasswordRules from "../../features/auth/ui/PasswordRules";
import { REGISTRATION_STEPS, stepIndex } from "../../features/auth/ui/registrationSteps";
import { CONTACT_CHANNELS } from "./mocks";

export default function RegisterSecurityScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rulesMet, setRulesMet] = useState(false);
  const step = stepIndex("security");

  const mismatch = confirm.length > 0 && confirm !== password;
  const canContinue = rulesMet && confirm === password && confirm.length > 0;

  return (
    <RegistrationLayout
      step={step}
      title="Choose a password"
      description="You will use your email address and this password to sign in and check your loan."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      onBack={() => navigate({ to: REGISTRATION_STEPS[step - 1].path })}
      onPrimary={() => navigate({ to: REGISTRATION_STEPS[step + 1].path })}
      primaryDisabled={!canContinue}
      onStepClick={(i) => navigate({ to: REGISTRATION_STEPS[i].path })}
    >
      <Form layout="vertical" requiredMark onFinish={() => console.log("submit: security")}>
        <Form.Item label="Password" required>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <PasswordRules value={password} onValidityChange={setRulesMet} />
        </Form.Item>

        <Form.Item
          label="Type your password again"
          required
          validateStatus={mismatch ? "error" : undefined}
          help={mismatch ? "The two passwords do not match yet." : undefined}
        >
          <Input.Password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </Form.Item>

        <Divider />

        <Typography.Title level={5}>How should we reach you?</Typography.Title>
        <Typography.Paragraph type="secondary">
          We will tell you about your application, your payments and anything we
          need from you. You can change this later in your profile.
        </Typography.Paragraph>

        <Form.Item>
          <Checkbox.Group
            options={CONTACT_CHANNELS}
            defaultValue={["email", "sms"]}
            onChange={(v) => console.log("contact channels", v)}
          />
        </Form.Item>
      </Form>
    </RegistrationLayout>
  );
}
