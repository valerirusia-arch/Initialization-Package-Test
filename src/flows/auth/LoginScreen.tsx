// src/flows/auth/LoginScreen.tsx
//
// Route: /auth/login (and "/", the portal's front door)
//
// "Remember me" is phrased as what it does, not as jargon. The failed-attempt
// counter is shown because the WBS locks the account after consecutive
// failures — locking someone out with no warning, on the account that holds
// their citizenship application, is the kind of dead end DESIGN.md §2 forbids.
//
// Stub: the password "locked" sends you to the locked screen so that state can
// be reviewed; anything else signs in.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Checkbox, Flex, Form, Input } from "antd";
import AuthCard from "../../features/auth/ui/AuthCard";

const MAX_ATTEMPTS = 5;

export default function LoginScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(0);

  const submit = () => {
    if (password === "locked" || failed + 1 >= MAX_ATTEMPTS) {
      navigate({ to: "/auth/account-locked" });
      return;
    }
    if (password === "wrong") {
      setFailed((n) => n + 1);
      return;
    }
    console.log("sign in");
  };

  const attemptsLeft = MAX_ATTEMPTS - failed;

  return (
    <AuthCard
      title="Sign in"
      description="Use the email address and password you created when you applied."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      primaryLabel="Sign in"
      onPrimary={submit}
      footer={
        <>
          <Button type="link" onClick={() => navigate({ to: "/auth/forgot-password" })}>
            Forgot your password?
          </Button>
          <Button type="link" onClick={() => navigate({ to: "/auth/register" })}>
            Create an account
          </Button>
        </>
      }
    >
      <Flex vertical gap={16}>
        {failed > 0 && (
          <Alert
            type="error"
            showIcon
            title="That email and password do not match"
            description={`You have ${attemptsLeft} ${
              attemptsLeft === 1 ? "attempt" : "attempts"
            } left before we lock the account to keep it safe.`}
          />
        )}

        <Form layout="vertical" requiredMark onFinish={submit}>
          <Form.Item label="Email address" required>
            <Input autoComplete="username" inputMode="email" />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            {/* Not "Remember me" — say what it actually does. */}
            <Checkbox onChange={(e) => console.log("trust device", e.target.checked)}>
              Keep me signed in on this device
            </Checkbox>
          </Form.Item>
        </Form>
      </Flex>
    </AuthCard>
  );
}
