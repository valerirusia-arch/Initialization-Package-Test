// src/shared/ui/DateText.tsx
//
// Repayment is month-based: due on the 1st, first payment within 45 days of
// approval. Formatting centrally is what keeps the Spanish build from reading
// as English with translated labels around it (DESIGN.md §6).

import { Typography } from "antd";

export type DateTextProps = {
  /** ISO string or Date. */
  value: string | Date;
  locale?: string;
  /**
   * long   — "January 1, 2027"   (milestone copy)
   * short  — "Jan 1, 2027"       (tables, schedules)
   * numeric— "01/01/2027"        (dense back-office columns)
   */
  format?: "long" | "short" | "numeric";
  type?: "secondary" | "success" | "warning" | "danger";
  strong?: boolean;
};

const OPTIONS: Record<
  NonNullable<DateTextProps["format"]>,
  Intl.DateTimeFormatOptions
> = {
  long: { year: "numeric", month: "long", day: "numeric" },
  short: { year: "numeric", month: "short", day: "numeric" },
  numeric: { year: "numeric", month: "2-digit", day: "2-digit" },
};

export default function DateText({
  value,
  locale = "en-US",
  format = "short",
  type,
  strong = false,
}: DateTextProps) {
  const date = typeof value === "string" ? new Date(value) : value;
  const text = new Intl.DateTimeFormat(locale, OPTIONS[format]).format(date);
  return (
    <Typography.Text type={type} strong={strong}>
      {text}
    </Typography.Text>
  );
}
