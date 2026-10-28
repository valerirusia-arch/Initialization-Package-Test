// src/flows/application/LoanDetailsScreen.tsx — step 3 of 6, /application/details
//
// Which USCIS service you are applying for, which sets the loan amount. The
// values are predefined by the back end and not configurable (WBS).
//
// Cards rather than a dropdown: this is the decision that sets what is
// borrowed, so the fee is visible next to each option rather than one click
// away. See ChoiceCard for the reasoning.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Descriptions, Divider, Flex, Radio, Typography } from "antd";
import ApplicationLayout from "../../features/application/ui/ApplicationLayout";
import { APPLICATION_STEPS, appStepIndex } from "../../features/application/ui/applicationSteps";
import ChoiceCard from "../../features/application/ui/ChoiceCard";
import Money from "../../shared/ui/Money";
import { useWizardChrome } from "../usePortal";
import { USCIS_OPTIONS } from "../portalMocks";

export default function LoanDetailsScreen() {
  const navigate = useNavigate();
  const chrome = useWizardChrome();
  const [choice, setChoice] = useState<string>();
  const step = appStepIndex("details");

  const selected = USCIS_OPTIONS.find((o) => o.value === choice);
  const monthly = selected ? Number((selected.amount / 12 * 1.005).toFixed(2)) : 0;

  return (
    <ApplicationLayout
      {...chrome}
      step={step}
      title="What are you applying for?"
      description="Your loan covers the USCIS fee for one application. Choose the one you are filing and we will lend exactly that amount."
      onBack={() => navigate({ to: APPLICATION_STEPS[step - 1].path })}
      onPrimary={() => navigate({ to: APPLICATION_STEPS[step + 1].path })}
      primaryDisabled={!choice}
      onStepClick={(i) => navigate({ to: APPLICATION_STEPS[i].path })}
    >
      <Flex vertical gap={16}>
        <Radio.Group value={choice} style={{ width: "100%" }}>
          <Flex vertical gap={12}>
            {USCIS_OPTIONS.map((o) => (
              <ChoiceCard
                key={o.value}
                value={o.value}
                title={o.title}
                description={o.description}
                amount={o.amount}
                checked={choice === o.value}
                onSelect={setChoice}
              />
            ))}
          </Flex>
        </Radio.Group>

        {selected && (
          <>
            <Divider />
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              What this would cost you
            </Typography.Title>
            <Descriptions column={1} colon={false} size="small">
              <Descriptions.Item label="You borrow">
                <Money amount={selected.amount} hideCents />
              </Descriptions.Item>
              <Descriptions.Item label="Rate">1% APR</Descriptions.Item>
              <Descriptions.Item label="You repay">
                12 monthly payments of about <Money amount={monthly} />
              </Descriptions.Item>
              <Descriptions.Item label="First payment">
                Within 45 days of approval, then the 1st of each month
              </Descriptions.Item>
            </Descriptions>
            <Alert
              type="info"
              showIcon
              title="We pay USCIS directly"
              description="The money goes onto a card that can only be used for your application fee. It is never paid to you in cash."
            />
          </>
        )}
      </Flex>
    </ApplicationLayout>
  );
}
