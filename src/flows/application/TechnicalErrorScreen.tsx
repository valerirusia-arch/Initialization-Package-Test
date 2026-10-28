// src/flows/application/TechnicalErrorScreen.tsx — /application/technical-error
//
// Something broke on our side. The WBS splits this in two and so does this
// screen, because the two cases have genuinely different answers:
//
//  - BEFORE the account exists: nothing was created, so the only honest advice
//    is to try again later.
//  - AFTER the account exists: the application keeps its state, OPA Staff are
//    notified automatically, and the applicant resumes from where it stopped.
//
// Either way this is our fault, the copy says so, and no application is ever
// rejected because of it.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Card, Flex, Result, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import { usePortal } from "../usePortal";

type Stage = "before-account" | "after-account";

export default function TechnicalErrorScreen() {
  const navigate = useNavigate();
  const portal = usePortal();
  const [stage, setStage] = useState<Stage>("after-account");

  const before = stage === "before-account";

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Card>
          <Result
            status="warning"
            title="Something went wrong on our side"
            subTitle={
              before
                ? "We could not finish setting up your account. Nothing was created and nothing was charged — please try again in a few minutes."
                : "We could not finish that step. Everything you entered is saved, and our team has already been told."
            }
            extra={
              before ? (
                <Button type="primary" onClick={() => navigate({ to: "/auth/register" })}>
                  Try again
                </Button>
              ) : (
                <Button type="primary" onClick={() => navigate({ to: "/application" })}>
                  Carry on where I left off
                </Button>
              )
            }
          />
        </Card>

        <Card>
          <Typography.Text type="secondary">
            This never counts against your application. If it keeps happening,
            call us on 617-404-9797 and we will finish it with you.
          </Typography.Text>
        </Card>

        <Card size="small" title="Preview both cases">
          <Segmented
            value={stage}
            onChange={(v) => setStage(v as Stage)}
            options={[
              { label: "Before the account exists", value: "before-account" },
              { label: "After the account exists", value: "after-account" },
            ]}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
