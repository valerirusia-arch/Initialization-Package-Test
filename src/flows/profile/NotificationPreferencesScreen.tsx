// src/flows/profile/NotificationPreferencesScreen.tsx — /profile/notifications
//
// Which channel each kind of message goes to (WBS: users manage their
// preferred communication channels).
//
// One rule is encoded in the UI rather than written in a disclaimer: anything
// about a decision, a signature or money cannot be switched off. Letting
// someone mute "your payment failed" would be doing them harm, so those rows
// show the channel choice but not an off switch.

import { useNavigate } from "@tanstack/react-router";
import { Alert, Card, Checkbox, Divider, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import { usePortal } from "../usePortal";

const GROUPS = [
  {
    key: "decisions",
    title: "Your application and loan",
    description: "Decisions, documents to sign, and anything we need from you.",
    required: true,
    items: ["Application approved or declined", "Documents ready to sign", "We need more information"],
  },
  {
    key: "money",
    title: "Payments",
    description: "Reminders before a payment, and what happened after it.",
    required: true,
    items: ["Payment reminders", "Payment confirmed", "Payment failed", "Overdue payments and fees"],
  },
  {
    key: "other",
    title: "Everything else",
    description: "News from OPA, and help with your citizenship journey.",
    required: false,
    items: ["Tips and guides", "News about OPA"],
  },
];

export default function NotificationPreferencesScreen() {
  const navigate = useNavigate();
  const portal = usePortal();

  return (
    <CustomerShell
      {...portal}
      width="narrow"
      primaryAction={{
        label: "Save",
        onClick: () => {
          console.log("save notification preferences");
          navigate({ to: "/profile" });
        },
      }}
      secondaryAction={{ label: "Cancel", onClick: () => navigate({ to: "/profile" }) }}
    >
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            How we contact you
          </Typography.Title>
          <Typography.Text type="secondary">
            Choose where each kind of message goes. You can pick both.
          </Typography.Text>
        </Flex>

        <Alert
          type="info"
          showIcon
          title="Some messages always get sent"
          description="Anything about a decision, a document to sign or money owed is sent whatever you choose here — you can pick the channel, but not turn it off."
        />

        {GROUPS.map((group) => (
          <Card key={group.key} title={group.title}>
            <Typography.Paragraph type="secondary">{group.description}</Typography.Paragraph>
            <Flex vertical>
              {group.items.map((item, i) => (
                <div key={item}>
                  {i > 0 && <Divider style={{ margin: "12px 0" }} />}
                  <Flex align="center" justify="space-between" gap={16} wrap>
                    <Typography.Text>{item}</Typography.Text>
                    <Flex gap={16}>
                      <Checkbox defaultChecked disabled={group.required}>
                        Email
                      </Checkbox>
                      <Checkbox defaultChecked={group.required}>Text</Checkbox>
                    </Flex>
                  </Flex>
                </div>
              ))}
            </Flex>
          </Card>
        ))}
      </Flex>
    </CustomerShell>
  );
}
