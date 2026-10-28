// src/features/application/ui/ChoiceCard.tsx
//
// A selectable card for a single choice — which USCIS service you are applying
// for, and therefore how much you are borrowing.
//
// Why not a plain <Select>: this is the one decision that sets the loan amount.
// A dropdown hides the options and their prices behind a click; cards put the
// fee next to the name so the choice is made with the number in view. For an
// audience the CFPB describes as more exposed to unclear financial terms, that
// is not a nicety.
//
// Still a radio underneath — antd's Radio gives us the keyboard behaviour and
// the accessible grouping for free.

import { Flex, Radio, Typography, theme } from "antd";
import Money from "../../../shared/ui/Money";
import { getStyles } from "./ChoiceCard.styles";

export type ChoiceCardProps = {
  value: string;
  title: string;
  description?: string;
  /** Shown prominently — this is what the applicant is really choosing. */
  amount?: number;
  amountLabel?: string;
  checked?: boolean;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  locale?: string;
};

export default function ChoiceCard({
  value,
  title,
  description,
  amount,
  amountLabel = "USCIS fee",
  checked = false,
  disabled = false,
  onSelect,
  locale,
}: ChoiceCardProps) {
  const { token } = theme.useToken();
  const styles = getStyles(token, checked, disabled);

  return (
    <div
      style={styles.card}
      onClick={() => !disabled && onSelect?.(value)}
      role="presentation"
    >
      <Flex align="start" gap={12} justify="space-between" wrap>
        <Flex align="start" gap={12} style={styles.main}>
          <Radio value={value} checked={checked} disabled={disabled} />
          <Flex vertical gap={2}>
            <Typography.Text strong>{title}</Typography.Text>
            {description && (
              <Typography.Text type="secondary">{description}</Typography.Text>
            )}
          </Flex>
        </Flex>

        {amount !== undefined && (
          <Flex vertical align="end" style={styles.amount}>
            <Money amount={amount} hideCents strong locale={locale} />
            <Typography.Text type="secondary">{amountLabel}</Typography.Text>
          </Flex>
        )}
      </Flex>
    </div>
  );
}
