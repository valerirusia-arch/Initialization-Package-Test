// src/flows/application/IncomeScreen.tsx — step 2 of 6, /application/income
//
// Annual income plus one document that shows it. The WBS is explicit that the
// objective is to verify an income source EXISTS, not to calculate or audit
// the amount — so the copy asks for one document, not a file of them.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Flex, Form, InputNumber, Typography } from "antd";
import ApplicationLayout from "../../features/application/ui/ApplicationLayout";
import { APPLICATION_STEPS, appStepIndex } from "../../features/application/ui/applicationSteps";
import DocumentUpload from "../../features/application/ui/DocumentUpload";
import type { UploadedDocument } from "../../features/application/ui/DocumentUpload";
import { useWizardChrome } from "../usePortal";
import { INCOME_DOCUMENT_TYPES } from "../portalMocks";

export default function IncomeScreen() {
  const navigate = useNavigate();
  const chrome = useWizardChrome();
  const [income, setIncome] = useState<number | null>(null);
  const [type, setType] = useState<string>();
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const step = appStepIndex("income");

  const addDocument = () => {
    const label = INCOME_DOCUMENT_TYPES.find((t) => t.value === type)?.label ?? "Document";
    setDocuments((d) => [
      ...d,
      { key: String(d.length + 1), name: `${type}-${d.length + 1}.pdf`, type: label, size: "412 KB" },
    ]);
  };

  return (
    <ApplicationLayout
      {...chrome}
      step={step}
      title="Your income"
      description="We need to see that you have money coming in. We are not checking how much you earn against a target — we just need to see a source."
      onBack={() => navigate({ to: APPLICATION_STEPS[step - 1].path })}
      onPrimary={() => navigate({ to: APPLICATION_STEPS[step + 1].path })}
      primaryDisabled={income === null || documents.length === 0}
      onStepClick={(i) => navigate({ to: APPLICATION_STEPS[i].path })}
    >
      <Flex vertical gap={24}>
        <Form layout="vertical" requiredMark>
          <Form.Item
            label="How much do you earn in a year?"
            required
            help="Before taxes. An estimate is fine."
          >
            <InputNumber
              value={income}
              onChange={setIncome}
              prefix="$"
              min={0}
              step={1000}
              style={{ width: "100%", maxWidth: 260 }}
            />
          </Form.Item>
        </Form>

        <Flex vertical gap={8}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Show us one document
          </Typography.Title>
          <DocumentUpload
            types={INCOME_DOCUMENT_TYPES}
            selectedType={type}
            onTypeChange={setType}
            documents={documents}
            onAdd={addDocument}
            onRemove={(key) => setDocuments((d) => d.filter((x) => x.key !== key))}
          />
        </Flex>
      </Flex>
    </ApplicationLayout>
  );
}
