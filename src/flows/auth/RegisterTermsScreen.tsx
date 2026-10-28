// src/flows/auth/RegisterTermsScreen.tsx
//
// Registration, step 4 of 6 — route: /auth/register/terms
//
// The WBS is explicit: the Terms of Use and Privacy Policy are acknowledged
// BEFORE the account is created. So this is a step in the wizard, not a
// checkbox buried in step 1 — and the documents are reachable from here rather
// than being links the person is assumed to have read.
//
// Two separate acknowledgements, because they are two separate documents.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, Flex, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import RegistrationLayout from "../../features/auth/ui/RegistrationLayout";
import { REGISTRATION_STEPS, stepIndex } from "../../features/auth/ui/registrationSteps";

const DOCUMENTS = [
  { key: "terms", title: "Terms of Use", summary: "What you agree to when you use OPA." },
  { key: "privacy", title: "Privacy Policy", summary: "What we do with your information." },
];

export default function RegisterTermsScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");
  const [accepted, setAccepted] = useState<string[]>([]);
  const step = stepIndex("terms");

  return (
    <RegistrationLayout
      step={step}
      title="Please read and accept"
      description="Before we create your account we need you to agree to two documents. You can open each one, and we will email you a copy."
      locale={locale}
      onLocaleChange={setLocale}
      onSupport={() => navigate({ to: "/support" })}
      onBack={() => navigate({ to: REGISTRATION_STEPS[step - 1].path })}
      onPrimary={() => navigate({ to: REGISTRATION_STEPS[step + 1].path })}
      primaryDisabled={accepted.length < DOCUMENTS.length}
      onStepClick={(i) => navigate({ to: REGISTRATION_STEPS[i].path })}
    >
      <Checkbox.Group value={accepted} onChange={(v) => setAccepted(v as string[])}>
        <Flex vertical gap={20}>
          {DOCUMENTS.map((doc) => (
            <Flex key={doc.key} vertical gap={8}>
              <Flex align="center" gap={8} wrap>
                <FileTextOutlined />
                <Typography.Text strong>{doc.title}</Typography.Text>
                <Button
                  type="link"
                  style={{ padding: 0, height: "auto" }}
                  onClick={() => console.log("open document", doc.key)}
                >
                  Open
                </Button>
              </Flex>
              <Typography.Text type="secondary">{doc.summary}</Typography.Text>
              <Checkbox value={doc.key}>I have read and accept the {doc.title}</Checkbox>
            </Flex>
          ))}
        </Flex>
      </Checkbox.Group>
    </RegistrationLayout>
  );
}
