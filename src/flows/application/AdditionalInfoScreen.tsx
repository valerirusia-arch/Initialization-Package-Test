// src/flows/application/AdditionalInfoScreen.tsx — /application/additional-info
//
// Responding to an underwriter's request. The WBS assumes a text note plus
// document upload in both directions, so the underwriter's own words are shown
// verbatim at the top — a generic "more information is required" would leave
// the applicant guessing, and guessing means another round trip.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Alert, Button, Card, Flex, Form, Input, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DocumentUpload from "../../features/application/ui/DocumentUpload";
import type { UploadedDocument } from "../../features/application/ui/DocumentUpload";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { INCOME_DOCUMENT_TYPES } from "../portalMocks";

export default function AdditionalInfoScreen() {
  const navigate = useNavigate();
  const portal = usePortal("application");
  const [type, setType] = useState<string>();
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <CustomerShell {...portal} width="narrow">
        <Card>
          <Alert
            type="success"
            showIcon
            title="Thank you — we have what we asked for"
            description="Your application goes back to the team that was reviewing it. We will email and text you when there is a decision."
          />
          <Flex style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => navigate({ to: "/application/status" })}>
              Back to my application
            </Button>
          </Flex>
        </Card>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell
      {...portal}
      width="narrow"
      primaryAction={{
        label: "Send this",
        onClick: () => {
          console.log("submit additional info", { note, documents });
          setSent(true);
        },
        disabled: note.trim().length === 0 && documents.length === 0,
      }}
      secondaryAction={{ label: "Back", onClick: () => navigate({ to: "/application/status" }) }}
    >
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            We need one more thing
          </Typography.Title>
          <Typography.Text type="secondary">
            Asked on <DateText value="2026-10-18" format="long" />
          </Typography.Text>
        </Flex>

        <Card title="What we asked for">
          <Typography.Paragraph>
            “The pay stub you sent covers two weeks in September. Could you send
            one more recent stub, or a letter from your employer confirming you
            still work there? Nothing else is needed.”
          </Typography.Paragraph>
        </Card>

        <Card title="Your reply">
          <Flex vertical gap={20}>
            <Form layout="vertical">
              <Form.Item label="Anything you want to tell us" help="Optional.">
                <Input.TextArea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="For example: I started a new job in October, the letter is attached."
                />
              </Form.Item>
            </Form>

            <DocumentUpload
              types={INCOME_DOCUMENT_TYPES}
              selectedType={type}
              onTypeChange={setType}
              documents={documents}
              onAdd={() =>
                setDocuments((d) => [
                  ...d,
                  { key: String(d.length + 1), name: `reply-${d.length + 1}.pdf`, type: "Document", size: "380 KB" },
                ])
              }
              onRemove={(key) => setDocuments((d) => d.filter((x) => x.key !== key))}
            />
          </Flex>
        </Card>
      </Flex>
    </CustomerShell>
  );
}
