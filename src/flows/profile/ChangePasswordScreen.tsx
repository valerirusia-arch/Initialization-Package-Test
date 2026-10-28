// src/flows/profile/ChangePasswordScreen.tsx — /profile/change-password
//
// Changing a password you already know, so the current one is asked for first.
// Same live rules checklist as registration — one component, one standard.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, Flex, Form, Input, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import PasswordRules from "../../features/auth/ui/PasswordRules";
import { usePortal } from "../usePortal";

export default function ChangePasswordScreen() {
  const navigate = useNavigate();
  const portal = usePortal();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [rulesMet, setRulesMet] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== next;
  const canSave = current.length > 0 && rulesMet && confirm === next && confirm.length > 0;

  return (
    <CustomerShell
      {...portal}
      width="narrow"
      primaryAction={{
        label: "Save my new password",
        disabled: !canSave,
        onClick: () => {
          console.log("change password");
          navigate({ to: "/profile" });
        },
      }}
      secondaryAction={{ label: "Cancel", onClick: () => navigate({ to: "/profile" }) }}
    >
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Change my password
        </Typography.Title>

        <Card>
          <Form layout="vertical" requiredMark>
            <Form.Item label="Your password now" required>
              <Input.Password
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item label="New password" required>
              <Input.Password
                value={next}
                onChange={(e) => setNext(e.target.value)}
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item>
              <PasswordRules value={next} onValidityChange={setRulesMet} />
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
        </Card>
      </Flex>
    </CustomerShell>
  );
}
