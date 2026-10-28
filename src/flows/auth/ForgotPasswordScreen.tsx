// src/flows/auth/ForgotPasswordScreen.tsx
//
// Route: /auth/forgot-password
//
// Two states in one screen: ask, then confirm. The confirmation is
// deliberately non-committal — "if that address is registered" — because
// saying "we sent it" confirms to anyone typing an address that it belongs to
// an OPA borrower.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Form, Input, Result } from "antd";
import AuthCard from "../../features/auth/ui/AuthCard";

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = () => {
    setSending(true);
    console.log("request password reset");
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        locale={locale}
        onLocaleChange={setLocale}
        onSupport={() => navigate({ to: "/support" })}
        footer={
          <>
            <Button type="link" onClick={() => setSent(false)}>
              Use a different email address
            </Button>
            <Button type="link" onClick={() => navigate({ to: "/auth/login" })}>
              Back to sign in
            </Button>
          </>
        }
      >
        <Result
          status="info"
          title="If that address is registered, the link is on its way"
          subTitle="The link works for 24 hours. If it does not arrive in a few minutes, check your spam folder."
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Tell us the email address you signed up with and we will send you a link to choose a new password."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      primaryLabel="Send me the link"
      onPrimary={submit}
      primaryLoading={sending}
      footer={
        <Button type="link" onClick={() => navigate({ to: "/auth/login" })}>
          Back to sign in
        </Button>
      }
    >
      <Form layout="vertical" requiredMark onFinish={submit}>
        <Form.Item label="Email address" required>
          <Input autoComplete="username" inputMode="email" />
        </Form.Item>
      </Form>
    </AuthCard>
  );
}
