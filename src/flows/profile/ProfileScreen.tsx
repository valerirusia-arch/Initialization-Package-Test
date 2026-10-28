// src/flows/profile/ProfileScreen.tsx — /profile
//
// Everything the system holds about this person (WBS: "review all their
// personal information stored in the system").
//
// The split matters more than the layout. Contact details are self-service;
// name, date of birth and SSN are NOT — they were used for identity
// verification and underwriting, and changing them needs OPA Staff. The screen
// says so where the fields are, rather than leaving people hunting for an edit
// button that does not exist.

import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Descriptions, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import MaskedValue from "../../shared/ui/MaskedValue";
import { usePortal } from "../usePortal";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const portal = usePortal();

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          My profile
        </Typography.Title>

        <Card
          title="How we reach you"
          extra={<Button onClick={() => navigate({ to: "/profile/edit" })}>Change</Button>}
        >
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="Email">maria.g@example.com</Descriptions.Item>
            <Descriptions.Item label="Mobile phone">(617) 555-4821</Descriptions.Item>
            <Descriptions.Item label="Mailing address">
              48 Hyde Park Ave, Boston, MA 02130
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Who you are">
          <Descriptions column={1} colon={false} size="small">
            <Descriptions.Item label="Name">María González</Descriptions.Item>
            <Descriptions.Item label="Date of birth">14 March 1991</Descriptions.Item>
            <Descriptions.Item label="Social Security number">
              <MaskedValue value="123-45-6789" kind="ssn" />
            </Descriptions.Item>
            <Descriptions.Item label="Country of birth">Colombia</Descriptions.Item>
          </Descriptions>

          <Alert
            style={{ marginTop: 16 }}
            type="info"
            showIcon
            title="These cannot be changed here"
            description="We used them to confirm your identity, so changing them needs one of our team. Call 617-404-9797 and we will do it with you."
          />
        </Card>

        <Card title="Your account">
          <Flex vertical gap={8} align="start">
            <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/profile/change-password" })}>
              Change my password
            </Button>
            <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/profile/notifications" })}>
              How we contact you
            </Button>
            <Button type="link" style={{ padding: 0 }} onClick={() => navigate({ to: "/auth/login" })}>
              Sign out
            </Button>
          </Flex>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
