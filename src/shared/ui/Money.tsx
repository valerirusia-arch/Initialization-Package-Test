// src/shared/ui/Money.tsx
//
// All currency in the product goes through here. No ad-hoc toFixed(2) anywhere
// (DESIGN.md §6) — the Spanish build has to read as Spanish, not as English
// with translated labels around it.

import { Typography } from "antd";

export type MoneyProps = {
  /** Amount in dollars. Negative renders with the locale's own sign. */
  amount: number;
  /** "en-US" | "es-US". Comes from the app's language switch. */
  locale?: string;
  currency?: string;
  /** Drop the cents — only for round figures like a loan amount. */
  hideCents?: boolean;
  strong?: boolean;
  /** antd Typography tone. Use "danger" for overdue, "success" for paid. */
  type?: "secondary" | "success" | "warning" | "danger";
  /** Bigger, for the one number a screen is actually about. */
  size?: "default" | "large";
};

export default function Money({
  amount,
  locale = "en-US",
  currency = "USD",
  hideCents = false,
  strong = false,
  type,
  size = "default",
}: MoneyProps) {
  const text = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: hideCents ? 0 : 2,
    maximumFractionDigits: hideCents ? 0 : 2,
  }).format(amount);

  if (size === "large") {
    return (
      <Typography.Title level={2} type={type} style={{ margin: 0 }}>
        {text}
      </Typography.Title>
    );
  }

  return (
    // A currency amount must never break across lines — "$63." on one line and
    // "65" on the next is unreadable, and it happens in any narrow table cell.
    <Typography.Text strong={strong} type={type} style={{ whiteSpace: "nowrap" }}>
      {text}
    </Typography.Text>
  );
}
