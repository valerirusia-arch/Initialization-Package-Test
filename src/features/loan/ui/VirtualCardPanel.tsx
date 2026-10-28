// src/features/loan/ui/VirtualCardPanel.tsx
//
// The issued virtual payment card. PROJECT.md §4.3: BORROWER ONLY — the
// co-borrower has no access to card information at all.
//
// That rule is expressed as a prop (`canView`), and when it is false the panel
// renders an explanation rather than a masked card: hinting at details someone
// may never see is worse than saying plainly that they cannot.
//
// The number is masked until revealed, and the reveal is per-field. This is
// the one place in the product a full card number is ever shown.

import { Alert, Button, Card, Descriptions, Flex, Typography } from "antd";
import { CopyOutlined, CreditCardOutlined } from "@ant-design/icons";
import MaskedValue from "../../../shared/ui/MaskedValue";
import Money from "../../../shared/ui/Money";

export type VirtualCardPanelProps = {
  brand: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  /** False for a co-borrower. Renders the explanation instead of the card. */
  canView?: boolean;
  onCopy?: () => void;
  locale?: string;
};

export default function VirtualCardPanel({
  brand,
  number,
  expiry,
  cvv,
  balance,
  canView = true,
  onCopy,
  locale,
}: VirtualCardPanelProps) {
  if (!canView) {
    return (
      <Card>
        <Alert
          type="info"
          showIcon
          title="Only the borrower can see the card"
          description="The payment card belongs to the person who applied for the loan. You can still see the loan, the repayment schedule and the payments."
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <CreditCardOutlined />
          <span>Your {brand} card</span>
        </Flex>
      }
      extra={
        <Button type="text" icon={<CopyOutlined />} onClick={onCopy}>
          Copy number
        </Button>
      }
    >
      <Flex vertical gap={16}>
        <Flex vertical gap={2}>
          <Typography.Text type="secondary">Available to spend</Typography.Text>
          <Money amount={balance} size="large" locale={locale} />
        </Flex>

        <Descriptions column={1} colon={false} size="small">
          <Descriptions.Item label="Card number">
            <MaskedValue value={number} kind="card" revealable />
          </Descriptions.Item>
          <Descriptions.Item label="Expires">{expiry}</Descriptions.Item>
          <Descriptions.Item label="Security code">{cvv}</Descriptions.Item>
        </Descriptions>

        <Alert
          type="info"
          showIcon
          title="Use this card to pay USCIS"
          description="Enter these details on the USCIS payment page. The card only works for your application fee, and only for the amount above."
        />
      </Flex>
    </Card>
  );
}
