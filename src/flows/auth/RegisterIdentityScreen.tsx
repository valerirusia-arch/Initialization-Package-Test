// src/flows/auth/RegisterIdentityScreen.tsx
//
// Registration, step 2 of 6 — route: /auth/register/identity
//
// SSN and US address. This is the most sensitive screen in the whole product
// and the one most likely to make someone stop, so it opens by saying WHY we
// need it and what we do with it — before the first field, not after.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Col, Form, Input, Row, Select } from "antd";
import { LockOutlined } from "@ant-design/icons";
import RegistrationLayout from "../../features/auth/ui/RegistrationLayout";
import { REGISTRATION_STEPS, stepIndex } from "../../features/auth/ui/registrationSteps";
import { SUPPORTED_STATES } from "./mocks";

export default function RegisterIdentityScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const step = stepIndex("identity");

  return (
    <RegistrationLayout
      step={step}
      title="Your address and Social Security number"
      description="We are required to confirm your identity before we can lend to you. We check this with a service called LexisNexis — it does not affect your credit score."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      onBack={() => navigate({ to: REGISTRATION_STEPS[step - 1].path })}
      onPrimary={() => navigate({ to: REGISTRATION_STEPS[step + 1].path })}
      onStepClick={(i) => navigate({ to: REGISTRATION_STEPS[i].path })}
    >
      <Alert
        type="info"
        showIcon
        icon={<LockOutlined />}
        title="Your Social Security number is stored encrypted"
        description="We use it only to confirm your identity and to report your payments. We never show it in full again."
        style={{ marginBottom: 24 }}
      />

      <Form layout="vertical" requiredMark onFinish={() => console.log("submit: identity")}>
        <Form.Item
          label="Social Security number"
          required
          help="Nine digits, like 123-45-6789."
        >
          <Input.Password placeholder="•••-••-••••" inputMode="numeric" autoComplete="off" />
        </Form.Item>

        <Form.Item label="Street address" required>
          <Input autoComplete="address-line1" />
        </Form.Item>

        <Form.Item label="Apartment or unit" help="Leave empty if you do not have one.">
          <Input autoComplete="address-line2" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label="City" required>
              <Input autoComplete="address-level2" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item
              label="State"
              required
              help="OPA can only lend in these states right now."
            >
              <Select options={SUPPORTED_STATES} placeholder="State" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={6}>
            <Form.Item label="ZIP code" required>
              <Input inputMode="numeric" autoComplete="postal-code" maxLength={5} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </RegistrationLayout>
  );
}
