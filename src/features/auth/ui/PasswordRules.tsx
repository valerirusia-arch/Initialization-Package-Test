// src/features/auth/ui/PasswordRules.tsx
//
// The password requirements, shown as a live checklist rather than as an error
// after the fact. Someone typing their first US account password should be able
// to see what is still missing while they type — not be told afterwards.
//
// Pure presentation: it derives the checks from the value it is handed and
// reports whether they all pass through `onValidityChange`. No validation
// library, no Zod — that is Dev's, in /models. The rules themselves live in
// ./checkPassword.ts so this file exports a component and nothing else.

import { useEffect } from "react";
import { Flex, Typography, theme } from "antd";
import { CheckCircleFilled, MinusCircleOutlined } from "@ant-design/icons";
import { getStyles } from "./PasswordRules.styles";
import { checkPassword } from "./checkPassword";

export type PasswordRulesProps = {
  value: string;
  /** Called whenever every rule passes or stops passing. */
  onValidityChange?: (valid: boolean) => void;
};

export default function PasswordRules({ value, onValidityChange }: PasswordRulesProps) {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  const rules = checkPassword(value);
  const allPassed = rules.every((r) => r.passed);

  useEffect(() => {
    onValidityChange?.(allPassed);
  }, [allPassed, onValidityChange]);

  return (
    <Flex vertical gap={6}>
      {rules.map((rule) => (
        <Flex key={rule.label} align="center" gap={8}>
          {/* The icon changes shape as well as colour — colour alone never
              carries meaning (DESIGN.md §7). */}
          {rule.passed ? (
            <CheckCircleFilled style={styles.passed} />
          ) : (
            <MinusCircleOutlined style={styles.pending} />
          )}
          <Typography.Text type={rule.passed ? undefined : "secondary"}>
            {rule.label}
          </Typography.Text>
        </Flex>
      ))}
    </Flex>
  );
}
