// src/flows/loan/LoanDocumentsScreen.tsx — /loan/documents
//
// All loan documents, download only.

import { Card, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DocumentList from "../../features/loan/ui/DocumentList";
import { usePortal } from "../usePortal";
import { DOCUMENTS } from "../portalMocks";

export default function LoanDocumentsScreen() {
  const portal = usePortal("documents");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={16}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          My documents
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Everything you have signed with us. Download a copy to keep — we
          cannot show these inside the site.
        </Typography.Paragraph>
        <Card>
          <DocumentList
            documents={DOCUMENTS}
            onDownload={(key) => console.log("download", key)}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
