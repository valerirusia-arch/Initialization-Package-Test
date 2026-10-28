// src/shared/ui/MaskedValue.tsx
//
// Privacy is visual (DESIGN.md §8 of the principles): SSNs, card numbers and
// account identifiers are masked by default and revealed deliberately.
//
// The reveal is LOCAL UI state only — allowed in Design Mode. Whether a given
// user is permitted to reveal at all is a Dev concern: the screen simply omits
// `revealable` when they are not (a borrower can never reveal a co-borrower's
// card, and a co-borrower never sees the virtual card at all).

import { useState } from "react";
import { Button, Flex, Typography } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { styles } from "./MaskedValue.styles";

export type MaskedValueProps = {
  /** The full value. In Design Mode this is always mock data. */
  value: string;
  kind: "ssn" | "card" | "account";
  /** Show the reveal control. Omit for values this user may never see in full. */
  revealable?: boolean;
  /** Label announced next to the value, e.g. "Visa". */
  prefix?: string;
};

function mask(value: string, kind: MaskedValueProps["kind"]) {
  const digits = value.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  if (kind === "ssn") return `•••-••-${last4}`;
  if (kind === "card") return `•••• •••• •••• ${last4}`;
  return `••••${last4}`;
}

export default function MaskedValue({
  value,
  kind,
  revealable = false,
  prefix,
}: MaskedValueProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Flex align="center" gap={8}>
      {prefix && <Typography.Text type="secondary">{prefix}</Typography.Text>}
      <Typography.Text style={styles.value}>
        {revealed ? value : mask(value, kind)}
      </Typography.Text>
      {revealable && (
        <Button
          type="text"
          size="small"
          aria-label={revealed ? "Hide" : "Reveal"}
          icon={revealed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
          onClick={() => setRevealed((v) => !v)}
        />
      )}
    </Flex>
  );
}
