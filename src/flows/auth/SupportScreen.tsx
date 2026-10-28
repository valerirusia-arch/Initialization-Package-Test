// src/flows/auth/SupportScreen.tsx
//
// Route: /support
//
// Built now, with the Auth epic, because every auth screen's support link
// points here — an escape hatch that leads to a 404 is worse than none.
//
// PROJECT.md §4.1: information only, no interactive elements. The phone number
// is copyable and the email is a mailto, which is how you reach someone, not
// an interaction with the application.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Descriptions, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DisplayTitle from "../../shared/ui/DisplayTitle";

export default function SupportScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");

  return (
    <CustomerShell locale={locale} onLocaleChange={setLocale}>
      <Flex vertical gap={16}>
        <DisplayTitle level={2}>We are here to help</DisplayTitle>
        <Typography.Paragraph type="secondary">
          If you cannot finish your application, or something on this site does
          not make sense, call or write to us. We speak English and Spanish.
        </Typography.Paragraph>

        <Card>
          <Descriptions column={1} colon={false}>
            <Descriptions.Item label="Phone">
              <Typography.Text strong copyable>
                617-404-9797
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Hours">
              Monday to Friday, 9:00am – 5:00pm Eastern
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Typography.Link href="mailto:info@onepercentforamerica.org">
                info@onepercentforamerica.org
              </Typography.Link>
            </Descriptions.Item>
            <Descriptions.Item label="Languages">English, Spanish</Descriptions.Item>
          </Descriptions>
        </Card>

        <Flex>
          <Button onClick={() => navigate({ to: "/auth/login" })}>Back to sign in</Button>
        </Flex>
      </Flex>
    </CustomerShell>
  );
}
