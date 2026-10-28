// src/features/loan/ui/DocumentList.tsx
//
// Loan and application documents. PROJECT.md §4.2/§4.3: DOWNLOAD ONLY, no
// in-app preview anywhere — so there is one action per row and it is Download.
//
// Plain Flex rows rather than antd <List>, which is deprecated since 6.6; its
// replacement Listy is a virtual list and these lists are four items long.

import { Button, Divider, Empty, Flex, Typography } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import DateText from "../../../shared/ui/DateText";
import { getStyles } from "./DocumentList.styles";

export type LoanDocument = {
  key: string;
  name: string;
  /** When it was signed, or produced. */
  signedOn?: string;
  size?: string;
};

export type DocumentListProps = {
  documents: LoanDocument[];
  onDownload?: (key: string) => void;
  locale?: string;
  emptyDescription?: string;
};

export default function DocumentList({
  documents,
  onDownload,
  locale,
  emptyDescription = "Your documents will appear here once you have signed them.",
}: DocumentListProps) {
  const styles = getStyles();

  if (documents.length === 0) {
    return <Empty description={emptyDescription} />;
  }

  return (
    <Flex vertical>
      {documents.map((doc, i) => (
        <div key={doc.key}>
          {i > 0 && <Divider style={styles.divider} />}
          <Flex align="center" justify="space-between" gap={12} wrap>
            <Flex align="center" gap={12} style={styles.main}>
              <FileTextOutlined />
              <Flex vertical>
                <Typography.Text>{doc.name}</Typography.Text>
                <Typography.Text type="secondary">
                  {doc.signedOn && (
                    <>
                      Signed <DateText value={doc.signedOn} locale={locale} />
                    </>
                  )}
                  {doc.signedOn && doc.size ? " · " : null}
                  {doc.size}
                </Typography.Text>
              </Flex>
            </Flex>
            <Button icon={<DownloadOutlined />} onClick={() => onDownload?.(doc.key)}>
              Download
            </Button>
          </Flex>
        </div>
      ))}
    </Flex>
  );
}
