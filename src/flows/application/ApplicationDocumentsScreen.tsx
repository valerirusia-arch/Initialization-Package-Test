// src/flows/application/ApplicationDocumentsScreen.tsx — /application/documents
//
// Everything signed during the application. Download only, no preview
// (PROJECT.md §4.2).

import { useNavigate } from "@tanstack/react-router";
import { Card, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import DocumentList from "../../features/loan/ui/DocumentList";
import { usePortal } from "../usePortal";
import { DOCUMENTS } from "../portalMocks";

export default function ApplicationDocumentsScreen() {
  const navigate = useNavigate();
  const portal = usePortal("documents");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={16}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Application documents
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Everything you signed while applying. Download a copy to keep — we
          cannot show these inside the site.
        </Typography.Paragraph>
        <Card>
          <DocumentList
            documents={DOCUMENTS.slice(0, 2)}
            onDownload={(key) => console.log("download", key)}
            emptyDescription="Documents appear here once you have signed them."
          />
        </Card>
        <Flex>
          <Typography.Link onClick={() => navigate({ to: "/loan/documents" })}>
            Looking for your loan agreement?
          </Typography.Link>
        </Flex>
      </Flex>
    </CustomerShell>
  );
}
