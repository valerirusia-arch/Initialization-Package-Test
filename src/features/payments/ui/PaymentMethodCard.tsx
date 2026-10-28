// src/features/payments/ui/PaymentMethodCard.tsx
//
// A saved repayment card. PROJECT.md §4.4: masked number, brand, expiry and
// whether it is the active repayment method — and each user sees ONLY the
// cards they added. A borrower and a co-borrower never see each other's.
//
// That last rule is why there is no "owner" column: if a card is on this
// screen, it is yours. Showing someone else's as "hidden" would already be
// telling you it exists.

import { Button, Card, Flex, Tag, Typography } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";
import MaskedValue from "../../../shared/ui/MaskedValue";

export type PaymentMethodCardProps = {
  brand: string;
  number: string;
  expiry: string;
  active?: boolean;
  expired?: boolean;
  onUpdate?: () => void;
};

export default function PaymentMethodCard({
  brand,
  number,
  expiry,
  active = false,
  expired = false,
  onUpdate,
}: PaymentMethodCardProps) {
  return (
    <Card>
      <Flex align="center" justify="space-between" gap={16} wrap>
        <Flex align="center" gap={12}>
          <CreditCardOutlined />
          <Flex vertical gap={2}>
            <MaskedValue value={number} kind="card" prefix={brand} />
            <Typography.Text type={expired ? "danger" : "secondary"}>
              {expired ? `Expired ${expiry}` : `Expires ${expiry}`}
            </Typography.Text>
          </Flex>
        </Flex>

        <Flex align="center" gap={8}>
          {active && !expired && <Tag color="success">Used for repayments</Tag>}
          {expired && <Tag color="error">Needs replacing</Tag>}
          {onUpdate && <Button onClick={onUpdate}>Change card</Button>}
        </Flex>
      </Flex>
    </Card>
  );
}
