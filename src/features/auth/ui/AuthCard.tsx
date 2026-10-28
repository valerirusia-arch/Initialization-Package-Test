// src/features/auth/ui/AuthCard.tsx
//
// The chrome for every auth screen that is NOT part of the registration wizard:
// sign in, account locked, forgot / reset / set password.
//
// One centred card, one question, one primary action. The language switch and
// the support link come from CustomerShell, so they are present here too —
// someone who cannot sign in is exactly the person who needs both.

import type { ReactNode } from "react";
import { Card, Flex, Typography } from "antd";
import CustomerShell from "../../../shared/ui/CustomerShell";
import DisplayTitle from "../../../shared/ui/DisplayTitle";
import { getStyles } from "./AuthCard.styles";

export type AuthCardProps = {
  title: string;
  /** Plain language, always visible — never a tooltip. */
  description?: ReactNode;
  children: ReactNode;
  /** Links under the card: "Forgot your password?", "Create an account". */
  footer?: ReactNode;

  primaryLabel?: string;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  backLabel?: string;
  onBack?: () => void;

  locale?: "en" | "es";
  onLocaleChange?: (locale: "en" | "es") => void;
  onSupport?: () => void;
};

export default function AuthCard({
  title,
  description,
  children,
  footer,
  primaryLabel,
  onPrimary,
  primaryLoading,
  primaryDisabled,
  backLabel = "Back",
  onBack,
  locale,
  onLocaleChange,
  onSupport,
}: AuthCardProps) {
  const styles = getStyles();

  return (
    <CustomerShell
      locale={locale}
      onLocaleChange={onLocaleChange}
      onSupport={onSupport}
      primaryAction={
        primaryLabel
          ? {
              label: primaryLabel,
              onClick: onPrimary,
              loading: primaryLoading,
              disabled: primaryDisabled,
            }
          : undefined
      }
      secondaryAction={onBack ? { label: backLabel, onClick: onBack } : undefined}
    >
      <Flex vertical align="center" style={styles.wrap}>
        <Card style={styles.card}>
          <DisplayTitle level={2}>{title}</DisplayTitle>
          {description && (
            <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
          )}
          {children}
        </Card>
        {footer && (
          <Flex gap={16} wrap justify="center" style={styles.footer}>
            {footer}
          </Flex>
        )}
      </Flex>
    </CustomerShell>
  );
}
