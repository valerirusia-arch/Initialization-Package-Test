// src/flows/application/SubmittedScreen.tsx — /application/submitted
//
// The confirmation, plus the questions the WBS puts after submission:
// household income and size, veteran status, and how the applicant heard about
// OPA. They come AFTER the application is in, deliberately — none of them
// affects the decision, and asking them earlier would make the form longer at
// the exact moment people give up.
//
// So the screen says plainly that these are optional and why we ask.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Divider, Flex, Form, InputNumber, Result, Select, Switch, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DisplayTitle from "../../shared/ui/DisplayTitle";
import { usePortal } from "../usePortal";

const HEARD_ABOUT = [
  { value: "friend", label: "A friend or family member" },
  { value: "organization", label: "An organization that helps immigrants" },
  { value: "lawyer", label: "My immigration lawyer" },
  { value: "search", label: "I searched online" },
  { value: "social", label: "Social media" },
  { value: "other", label: "Somewhere else" },
];

export default function SubmittedScreen() {
  const navigate = useNavigate();
  const portal = usePortal("application");
  const [saved, setSaved] = useState(false);

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Card>
          <Result
            status="success"
            title={<DisplayTitle level={2} align="center">Your application is in</DisplayTitle>}
            subTitle="We will review it and let you know by email and text message. Most people hear back within a few days."
            extra={
              <Button type="primary" onClick={() => navigate({ to: "/application/status" })}>
                See where it is
              </Button>
            }
          />
        </Card>

        <Card>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Three optional questions
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            None of these affects your application. We ask because the people
            who fund OPA want to know we are reaching the right communities —
            and because it helps us find more people like you.
          </Typography.Paragraph>

          <Divider />

          <Form layout="vertical">
            <Form.Item label="How many people live in your household?">
              <InputNumber min={1} style={{ width: 160 }} />
            </Form.Item>
            <Form.Item
              label="What is your total household income in a year?"
              help="Everyone in your home added together, before taxes."
            >
              <InputNumber prefix="$" min={0} step={1000} style={{ width: 220 }} />
            </Form.Item>
            <Form.Item label="Have you served in the US military?">
              <Switch />
            </Form.Item>
            <Form.Item label="How did you hear about OPA?">
              <Select options={HEARD_ABOUT} placeholder="Choose one" style={{ maxWidth: 360 }} />
            </Form.Item>

            <Flex gap={12} wrap align="center">
              <Button
                type="primary"
                onClick={() => {
                  console.log("save optional answers");
                  setSaved(true);
                }}
              >
                Save my answers
              </Button>
              <Button type="text" onClick={() => navigate({ to: "/application/status" })}>
                Skip
              </Button>
              {saved && <Typography.Text type="success">Saved. Thank you.</Typography.Text>}
            </Flex>
          </Form>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
