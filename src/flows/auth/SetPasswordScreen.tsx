// src/flows/auth/SetPasswordScreen.tsx
//
// Route: /auth/set-password  (reached from an emailed invitation link)
//
// One screen, two audiences — the WBS uses the same "set your password" email
// for a new Admin/Underwriter created by an Admin, and for a co-borrower
// invited onto an application. The copy names who invited you and why, because
// an email asking for a password is otherwise indistinguishable from phishing
// — and this audience is, per the CFPB, more exposed to exactly that.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Form, Input, Segmented } from "antd";
import AuthCard from "../../features/auth/ui/AuthCard";
import PasswordRules from "../../features/auth/ui/PasswordRules";

type Audience = "co-borrower" | "staff";

const COPY: Record<Audience, { title: string; description: string; note: string }> = {
  "co-borrower": {
    title: "Set your password",
    description:
      "María González asked you to support her citizenship loan application. Choose a password and we will show you what she needs from you.",
    note: "You are only being asked to support one application. You will see that application and nothing else.",
  },
  staff: {
    title: "Set your password",
    description:
      "An OPA administrator created an account for you. Choose a password to sign in to the back office.",
    note: "If you were not expecting this, do not set a password — tell your administrator.",
  },
};

export default function SetPasswordScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  /** Mock switch so both versions of this screen can be reviewed. */
  const [audience, setAudience] = useState<Audience>("co-borrower");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rulesMet, setRulesMet] = useState(false);

  const copy = COPY[audience];
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = rulesMet && confirm.length > 0 && confirm === password;

  return (
    <AuthCard
      title={copy.title}
      description={copy.description}
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      primaryLabel="Save and continue"
      onPrimary={() => {
        console.log("set password", audience);
        navigate({ to: "/auth/login" });
      }}
      primaryDisabled={!canSubmit}
      footer={
        <Button type="link" onClick={() => navigate({ to: "/auth/login" })}>
          Back to sign in
        </Button>
      }
    >
      <Form layout="vertical" requiredMark>
        <Form.Item label="Preview as" help="Mock control — not part of the screen.">
          <Segmented
            value={audience}
            onChange={(v) => setAudience(v as Audience)}
            options={[
              { label: "Co-borrower", value: "co-borrower" },
              { label: "Internal user", value: "staff" },
            ]}
          />
        </Form.Item>

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

      <Alert type="info" showIcon title={copy.note} />
    </AuthCard>
  );
}
