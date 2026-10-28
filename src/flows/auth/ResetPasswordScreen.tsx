// src/flows/auth/ResetPasswordScreen.tsx
//
// Route: /auth/reset-password  (reached from the emailed link)
//
// The expired-link state matters as much as the happy path: these links last
// 24 hours, and the person arriving on an expired one has already waited for
// an email once. They get a way to ask for another without going back to
// hunting for the sign-in page.
//
// Stub: add ?expired to the URL in the DevBar to review that state — here it is
// local state, toggled by the link below, so no routing logic is involved.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Form, Input, Result } from "antd";
import AuthCard from "../../features/auth/ui/AuthCard";
import PasswordRules from "../../features/auth/ui/PasswordRules";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rulesMet, setRulesMet] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = rulesMet && confirm.length > 0 && confirm === password;

  if (expired) {
    return (
      <AuthCard
        title="That link has expired"
        locale={locale}
        onLocaleChange={setLocale}
        onSupport={() => navigate({ to: "/support" })}
        primaryLabel="Send me a new link"
        onPrimary={() => navigate({ to: "/auth/forgot-password" })}
        footer={
          <Button type="link" onClick={() => navigate({ to: "/auth/login" })}>
            Back to sign in
          </Button>
        }
      >
        <Result
          status="warning"
          title="Links last 24 hours"
          subTitle="This one is older than that, so we cannot use it. Ask for a new one and we will send it right away."
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choose a new password"
      description="Pick something you have not used here before. You will use it with your email address to sign in."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      primaryLabel="Save my new password"
      onPrimary={() => {
        console.log("reset password");
        navigate({ to: "/auth/login" });
      }}
      primaryDisabled={!canSubmit}
      footer={
        <Button type="link" onClick={() => setExpired(true)}>
          Preview: link expired
        </Button>
      }
    >
      <Form layout="vertical" requiredMark>
        <Form.Item label="New password" required>
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
          label="Type it again"
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
      </Form>
    </AuthCard>
  );
}
