// src/flows/application/CoBorrowerScreen.tsx — step 4 of 6, /application/co-borrower
//
// Inviting a co-borrower, and replacing one. Three states live here because
// they are the same question at different moments: nobody invited yet, an
// invitation waiting, and an invitation that needs replacing.
//
// WBS rules made visible:
//  - an invitation expires 5 calendar days after it is sent
//  - the borrower may replace a co-borrower as many times as needed, and the
//    previous invitation becomes inactive
//  - OPA's public terms say an employed co-borrower is usually required, so
//    this step is not framed as optional decoration

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Descriptions, Divider, Flex, Form, Input, Typography } from "antd";
import ApplicationLayout from "../../features/application/ui/ApplicationLayout";
import { APPLICATION_STEPS, appStepIndex } from "../../features/application/ui/applicationSteps";
import StatusTag from "../../shared/ui/StatusTag";
import DateText from "../../shared/ui/DateText";
import { useWizardChrome } from "../usePortal";
import { APPLICATION } from "../portalMocks";

type View = "invite" | "pending" | "needs-replacing";

export default function CoBorrowerScreen() {
  const navigate = useNavigate();
  const chrome = useWizardChrome();
  const [view, setView] = useState<View>("invite");
  const step = appStepIndex("co-borrower");
  const co = APPLICATION.coBorrower;

  return (
    <ApplicationLayout
      {...chrome}
      step={step}
      title="Add a co-borrower"
      description="A co-borrower supports your application and shares responsibility for repaying the loan. They need to be employed, and they will be asked for the same information as you."
      onBack={() => navigate({ to: APPLICATION_STEPS[step - 1].path })}
      onPrimary={() => navigate({ to: APPLICATION_STEPS[step + 1].path })}
      onStepClick={(i) => navigate({ to: APPLICATION_STEPS[i].path })}
    >
      <Flex vertical gap={16}>
        {view === "invite" && (
          <Form layout="vertical" requiredMark onFinish={() => setView("pending")}>
            <Form.Item label="Their first name" required>
              <Input />
            </Form.Item>
            <Form.Item label="Their last name" required>
              <Input />
            </Form.Item>
            <Form.Item
              label="Their email address"
              required
              help="We will email them an invitation. It works for 5 days."
            >
              <Input inputMode="email" />
            </Form.Item>
            <Button type="primary" onClick={() => setView("pending")}>
              Send the invitation
            </Button>
          </Form>
        )}

        {view === "pending" && (
          <>
            <Descriptions column={1} colon={false} size="small">
              <Descriptions.Item label="Name">{co.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{co.email}</Descriptions.Item>
              <Descriptions.Item label="Invitation">
                <StatusTag kind="invitation" status="Pending" />
              </Descriptions.Item>
              <Descriptions.Item label="Expires">
                <DateText value={co.expiresOn} format="long" />
              </Descriptions.Item>
            </Descriptions>
            <Alert
              type="info"
              showIcon
              title="Waiting for them to accept"
              description="We will tell you as soon as they do. You can carry on with the rest of your application in the meantime — we only need them before we make a decision."
            />
            <Flex gap={12} wrap>
              <Button onClick={() => console.log("resend invitation")}>Send it again</Button>
              <Button type="link" onClick={() => setView("needs-replacing")}>
                Preview: they did not pass underwriting
              </Button>
            </Flex>
          </>
        )}

        {view === "needs-replacing" && (
          <>
            <Alert
              type="warning"
              showIcon
              title="This co-borrower cannot support your application"
              description="We cannot tell you why — that information belongs to them. You can invite someone else, and your application keeps everything you have entered so far."
            />
            <Divider />
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              Invite someone else
            </Typography.Title>
            <Typography.Paragraph type="secondary">
              The earlier invitation stops working as soon as you send a new one.
            </Typography.Paragraph>
            <Button type="primary" onClick={() => setView("invite")}>
              Invite a different co-borrower
            </Button>
          </>
        )}
      </Flex>
    </ApplicationLayout>
  );
}
