// src/features/payments/ui/NextPaymentCard.tsx
//
// The one thing a borrower opens the portal to see: what is due, when, and the
// button to pay it.
//
// It carries the overdue case too, because a separate "you are late" banner
// elsewhere on the page is how people miss it. Late fees are stated as a
// number and a reason — $3.18 here is 5% of the instalment, which is less than
// the $5.00 cap, and someone who is already behind deserves the arithmetic
// rather than a surprise.

import { Alert, Button, Card, Flex, Typography } from "antd";
import Money from "../../../shared/ui/Money";
import DateText from "../../../shared/ui/DateText";

export type NextPaymentCardProps = {
  amount: number;
  dueDate: string;
  overdue?: boolean;
  /** Late fee already applied to this instalment. */
  fee?: number;
  feeReason?: string;
  paidOff?: boolean;
  onPay?: () => void;
  onPayExtra?: () => void;
  locale?: string;
};

export default function NextPaymentCard({
  amount,
  dueDate,
  overdue = false,
  fee,
  feeReason,
  paidOff = false,
  onPay,
  onPayExtra,
  locale,
}: NextPaymentCardProps) {
  if (paidOff) {
    return (
      <Card>
        <Flex vertical gap={8}>
          <Typography.Text type="secondary">Nothing left to pay</Typography.Text>
          <Money amount={0} size="large" type="success" locale={locale} />
          <Typography.Text type="secondary">
            Your loan is fully repaid. Your documents stay available here.
          </Typography.Text>
        </Flex>
      </Card>
    );
  }

  const total = amount + (fee ?? 0);

  return (
    <Card>
      <Flex vertical gap={16}>
        <Flex vertical gap={2}>
          <Typography.Text type="secondary">
            {overdue ? "Overdue payment" : "Your next payment"}
          </Typography.Text>
          <Money amount={total} size="large" type={overdue ? "danger" : undefined} locale={locale} />
          <Typography.Text type={overdue ? "danger" : "secondary"}>
            {overdue ? "Was due " : "Due "}
            <DateText value={dueDate} format="long" locale={locale} />
          </Typography.Text>
        </Flex>

        {fee ? (
          <Alert
            type="warning"
            showIcon
            title={<>A late fee of <Money amount={fee} locale={locale} /> was added</>}
            description={feeReason}
          />
        ) : null}

        <Flex gap={12} wrap>
          <Button type="primary" onClick={onPay}>
            {overdue ? "Pay now" : "Make this payment"}
          </Button>
          {onPayExtra && <Button onClick={onPayExtra}>Pay a different amount</Button>}
        </Flex>
      </Flex>
    </Card>
  );
}
