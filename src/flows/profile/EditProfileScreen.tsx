// src/flows/profile/EditProfileScreen.tsx — /profile/edit
//
// Contact details only. The WBS adds one rule that shapes the whole screen:
// changing an email address or a phone number RE-TRIGGERS verification. So the
// field says it before the change is made, not after — being bounced to an OTP
// screen you were not expecting feels like something went wrong.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Card, Col, Flex, Form, Input, Row, Select, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import { usePortal } from "../usePortal";
import { SUPPORTED_STATES } from "../auth/mocks";

export default function EditProfileScreen() {
  const navigate = useNavigate();
  const portal = usePortal();
  const [email, setEmail] = useState("maria.g@example.com");
  const [phone, setPhone] = useState("(617) 555-4821");

  const emailChanged = email !== "maria.g@example.com";
  const phoneChanged = phone !== "(617) 555-4821";
  const needsVerification = emailChanged || phoneChanged;

  return (
    <CustomerShell
      {...portal}
      width="narrow"
      primaryAction={{
        label: needsVerification ? "Save and confirm" : "Save",
        onClick: () => {
          console.log("save contact details");
          navigate({ to: needsVerification ? "/auth/register/verify-email" : "/profile" });
        },
      }}
      secondaryAction={{ label: "Cancel", onClick: () => navigate({ to: "/profile" }) }}
    >
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            How we reach you
          </Typography.Title>
          <Typography.Text type="secondary">
            We use these for everything about your loan, so keep them up to date.
          </Typography.Text>
        </Flex>

        {needsVerification && (
          <Alert
            type="warning"
            showIcon
            title="You will need to confirm the change"
            description={`We will send a code to your new ${
              emailChanged && phoneChanged
                ? "email address and phone number"
                : emailChanged
                  ? "email address"
                  : "phone number"
            } before we start using it.`}
          />
        )}

        <Card>
          <Form layout="vertical" requiredMark>
            <Form.Item label="Email address" required>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
            </Form.Item>

            <Form.Item label="Mobile phone number" required>
              <Input
                prefix="+1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
              />
            </Form.Item>

            <Form.Item label="Street address" required>
              <Input defaultValue="48 Hyde Park Ave" />
            </Form.Item>
            <Form.Item label="Apartment or unit">
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="City" required>
                  <Input defaultValue="Boston" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item label="State" required>
                  <Select options={SUPPORTED_STATES} defaultValue="MA" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item label="ZIP code" required>
                  <Input defaultValue="02130" maxLength={5} inputMode="numeric" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
