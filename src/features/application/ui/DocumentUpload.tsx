// src/features/application/ui/DocumentUpload.tsx
//
// Uploading proof of income. The WBS asks for "select document type and upload
// a document"; the design rule from DESIGN.md §6 is that the accepted types,
// the size limit and the formats are stated BEFORE the picker, not discovered
// in an error afterwards.
//
// The aim of the check is to confirm an income source exists, not to audit the
// amount — so the copy says "one document", not "all your documents".
//
// Dumb: the file list is handed in, removal is a callback. Nothing uploads.

import { Alert, Button, Divider, Flex, Select, Typography, Upload } from "antd";
import { DeleteOutlined, FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { getStyles } from "./DocumentUpload.styles";

export type UploadedDocument = {
  key: string;
  name: string;
  type: string;
  size: string;
};

export type DocumentUploadProps = {
  /** The document types we accept, e.g. pay stub, tax return. */
  types: { value: string; label: string }[];
  selectedType?: string;
  onTypeChange?: (type: string) => void;

  documents: UploadedDocument[];
  onAdd?: () => void;
  onRemove?: (key: string) => void;

  /** Stated up front, never only in an error. */
  accepts?: string;
  maxSizeLabel?: string;
  error?: string;
};

export default function DocumentUpload({
  types,
  selectedType,
  onTypeChange,
  documents,
  onAdd,
  onRemove,
  accepts = "PDF, JPG or PNG",
  maxSizeLabel = "10 MB",
  error,
}: DocumentUploadProps) {
  const styles = getStyles();
  const canUpload = Boolean(selectedType);

  return (
    <Flex vertical gap={16}>
      <Flex vertical gap={8}>
        <Typography.Text strong>What are you uploading?</Typography.Text>
        <Select
          value={selectedType}
          onChange={onTypeChange}
          options={types}
          placeholder="Choose the kind of document"
          style={styles.select}
        />
      </Flex>

      <Typography.Text type="secondary">
        {accepts}, up to {maxSizeLabel}. A photo of a paper document is fine as long
        as the whole page is readable.
      </Typography.Text>

      <Upload beforeUpload={() => false} showUploadList={false} disabled={!canUpload}>
        <Button icon={<UploadOutlined />} disabled={!canUpload} onClick={onAdd}>
          Choose a file
        </Button>
      </Upload>
      {!canUpload && (
        <Typography.Text type="secondary">
          Pick the kind of document first, so we know what we are looking at.
        </Typography.Text>
      )}

      {error && <Alert type="error" showIcon title={error} />}

      {/* Plain Flex rows, not <List>: List is deprecated since antd 6.6, and
          Listy — its replacement — is a virtual list, overkill for two files. */}
      {documents.length > 0 && (
        <Flex vertical style={styles.list}>
          {documents.map((doc, i) => (
            <div key={doc.key}>
              {i > 0 && <Divider style={styles.rowDivider} />}
              <Flex align="center" justify="space-between" gap={12}>
                <Flex align="center" gap={12} style={styles.rowMain}>
                  <FileTextOutlined />
                  <Flex vertical>
                    <Typography.Text>{doc.name}</Typography.Text>
                    <Typography.Text type="secondary">
                      {doc.type} · {doc.size}
                    </Typography.Text>
                  </Flex>
                </Flex>
                <Button
                  type="text"
                  aria-label={`Remove ${doc.name}`}
                  icon={<DeleteOutlined />}
                  onClick={() => onRemove?.(doc.key)}
                />
              </Flex>
            </div>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
