// src/flows/auth/RegisterDetailsScreen.tsx
//
// Registration, step 1 of 6 — route: /auth/register
//
// Name, date of birth, email, phone, country of origination. Identity data
// (SSN, address) is step 2 and the password is step 3: one decision per screen
// beats one long form an anxious applicant abandons (DESIGN.md §2).

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { DatePicker, Form, Input, Select } from "antd";
import RegistrationLayout from "../../features/auth/ui/RegistrationLayout";
import { REGISTRATION_STEPS, stepIndex } from "../../features/auth/ui/registrationSteps";
import { COUNTRIES } from "./mocks";

export default function RegisterDetailsScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");

  return (
    <RegistrationLayout
      step={stepIndex("details")}
      title="Your details"
      description="We ask for this so we can confirm who you are. Your progress is saved at every step, so you can stop and come back."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      onPrimary={() => navigate({ to: REGISTRATION_STEPS[1].path })}
      onStepClick={(i) => navigate({ to: REGISTRATION_STEPS[i].path })}
    >
      <Form layout="vertical" requiredMark onFinish={() => console.log("submit: details")}>
        <Form.Item label="First name" required>
          <Input autoComplete="given-name" />
        </Form.Item>

        <Form.Item label="Middle name" help="Only if it appears on your documents.">
          <Input autoComplete="additional-name" />
        </Form.Item>

        <Form.Item label="Last name" required>
          <Input autoComplete="family-name" />
        </Form.Item>

        <Form.Item label="Date of birth" required>
          <DatePicker style={{ width: "100%" }} format="MM/DD/YYYY" placeholder="MM/DD/YYYY" />
        </Form.Item>

        <Form.Item
          label="Country you were born in"
          required
          help="This does not affect whether you can get a loan."
        >
          <Select
            showSearch
            optionFilterProp="label"
            options={COUNTRIES}
            placeholder="Choose a country"
          />
        </Form.Item>

        <Form.Item
          label="Email address"
          required
          help="We will send a code here to confirm it, and use it for everything about your loan."
        >
          <Input autoComplete="email" inputMode="email" />
        </Form.Item>

        <Form.Item
          label="Mobile phone number"
          required
          help="A US number. We will text you a code to confirm it."
        >
          {/* US-only, so the country code is fixed rather than asked for. */}
          <Input prefix="+1" placeholder="(555) 555-5555" inputMode="tel" autoComplete="tel" />
        </Form.Item>
      </Form>
    </RegistrationLayout>
  );
}
