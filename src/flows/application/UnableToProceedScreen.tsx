// src/flows/application/UnableToProceedScreen.tsx — /application/unable-to-proceed
//
// Identity verification or OFAC screening did not pass.
//
// This is the single most carefully worded screen in the product, and the
// constraints come from the WBS, not from taste:
//
//  - It must NOT disclose which check failed or why. Saying "sanctions
//    screening" would tell someone something we are not permitted to tell them,
//    and would also tell a fraudster which check to work around.
//  - It must instruct the user to contact Customer Service — so the number is
//    printed here, not hidden behind a link.
//  - It must not read as an accusation. The person on the other side of this
//    screen is usually someone whose name resembles another name, or whose
//    address did not match a database. Treating them as a suspect is both
//    wrong and useless.
//
// DESIGN.md principle 5: no dead ends. The only way forward is a phone call,
// so the phone call is the primary action.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, Flex, Result, Typography } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import CustomerShell from "../../shared/ui/CustomerShell";
import DisplayTitle from "../../shared/ui/DisplayTitle";
import { usePortal } from "../usePortal";

export default function UnableToProceedScreen() {
  const navigate = useNavigate();
  const portal = usePortal();
  const [locale] = useState<"en" | "es">("en");

  return (
    <CustomerShell {...portal} locale={locale} width="narrow">
      <Flex vertical gap={24}>
        <Card>
          <Result
            icon={<PhoneOutlined />}
            title={
              <DisplayTitle level={2} align="center">
                Please call us
              </DisplayTitle>
            }
            subTitle="We cannot continue with your application online. This is something our team needs to go through with you directly."
            extra={
              <Flex vertical align="center" gap={8}>
                <Typography.Text strong copyable style={{ fontSize: 24 }}>
                  617-404-9797
                </Typography.Text>
                <Typography.Text type="secondary">
                  Monday to Friday, 9:00am – 5:00pm Eastern
                </Typography.Text>
                <Typography.Text type="secondary">
                  We speak English and Spanish
                </Typography.Text>
              </Flex>
            }
          />
        </Card>

        <Card>
          <Flex vertical gap={12}>
            <Typography.Text strong>What this does not mean</Typography.Text>
            <Typography.Text type="secondary">
              This is not a decision about your loan, and it has nothing to do
              with your immigration case. It happens most often when a name or
              an address does not match a record exactly.
            </Typography.Text>
            <Typography.Text type="secondary">
              Nothing you entered has been lost. When you call, have your photo
              ID nearby — it is usually sorted out in one conversation.
            </Typography.Text>
          </Flex>
        </Card>

        <Flex justify="center">
          <Typography.Link onClick={() => navigate({ to: "/support" })}>
            Other ways to reach us
          </Typography.Link>
        </Flex>
      </Flex>
    </CustomerShell>
  );
}
