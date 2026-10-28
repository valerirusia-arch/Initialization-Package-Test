// src/features/loan/ui/LoanSummary.tsx
//
// What the borrower actually wants to know about their loan: how much is left,
// what they owe next, and on what terms.
//
// The one number the screen is about gets the large treatment; the terms sit
// under it as plain rows. DESIGN.md §9 bans a chart here — a borrower needs a
// number and a date, not a donut.

import { Card, Descriptions, Divider, Flex, Typography } from "antd";
import Money from "../../../shared/ui/Money";
import DateText from "../../../shared/ui/DateText";
import StatusTag from "../../../shared/ui/StatusTag";
import type { STATUS } from "../../../shared/ui/statusMeta";

export type LoanSummaryProps = {
  status: keyof (typeof STATUS)["loan"];
  amount: number;
  unusedBalance: number;
  outstanding: number;
  apr: number;
  termMonths: number;
  monthlyPayment: number;
  nextPaymentDue: string;
  locale?: string;
  /** Headline figure: what is still owed, or what is still on the card. */
  headline?: "outstanding" | "unused";
};

export default function LoanSummary({
  status,
  amount,
  unusedBalance,
  outstanding,
  apr,
  termMonths,
  monthlyPayment,
  nextPaymentDue,
  locale,
  headline = "outstanding",
}: LoanSummaryProps) {
  const isUnused = headline === "unused";

  return (
    <Card>
      <Flex vertical gap={4}>
        <Flex align="center" justify="space-between" gap={12} wrap>
          <Typography.Text type="secondary">
            {isUnused ? "Still on your card" : "Still to repay"}
          </Typography.Text>
          <StatusTag kind="loan" status={status} />
        </Flex>
        <Money
          amount={isUnused ? unusedBalance : outstanding}
          size="large"
          locale={locale}
        />
        <Typography.Text type="secondary">
          Next payment <Money amount={monthlyPayment} locale={locale} /> on{" "}
          <DateText value={nextPaymentDue} format="long" locale={locale} />
        </Typography.Text>
      </Flex>

      <Divider />

      <Descriptions column={1} colon={false} size="small">
        <Descriptions.Item label="Loan amount">
          <Money amount={amount} hideCents locale={locale} />
        </Descriptions.Item>
        <Descriptions.Item label="Rate">{apr}% APR</Descriptions.Item>
        <Descriptions.Item label="Repayment">
          {termMonths} monthly payments of <Money amount={monthlyPayment} locale={locale} />
        </Descriptions.Item>
        <Descriptions.Item label="Payments are due">
          The 1st of each month
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
