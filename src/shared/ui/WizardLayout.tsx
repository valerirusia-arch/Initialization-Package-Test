// src/shared/ui/WizardLayout.tsx
//
// The shape both wizards share: CustomerShell, a step rail, one card.
// DESIGN.md §5.2.
//
// Registration and the loan application are the same ergonomics with different
// steps, so the layout lives here once and each feature supplies its own list
// (RegistrationLayout, ApplicationLayout). A wizard deliberately shows NO
// top-bar navigation: a half-finished application is not somewhere to wander
// away from by accident.
//
// Dumb — emits callbacks, never navigates, so it renders in Storybook.
//
// The rail moves BACKWARDS only. Jumping forward past an unanswered step is
// how someone lands on "confirm your phone" having never given one.

import type { ReactNode } from "react";
import { Card, Flex, Grid, Progress, Steps, Typography } from "antd";
import CustomerShell from "./CustomerShell";
import { getStyles } from "./WizardLayout.styles";

export type WizardStep = { label: string };

export type WizardLayoutProps = {
  steps: readonly WizardStep[];
  /** 0-based index into `steps`. */
  step: number;
  title: string;
  /** Plain language: why we ask, what happens next. Always visible. */
  description?: ReactNode;
  children: ReactNode;

  primaryLabel?: string;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;

  backLabel?: string;
  onBack?: () => void;

  /** Fired only for steps already completed. */
  onStepClick?: (index: number) => void;

  locale?: "en" | "es";
  onLocaleChange?: (locale: "en" | "es") => void;
  onSupport?: () => void;
  userName?: string;
  onAccount?: (action: "profile" | "logout") => void;
};

export default function WizardLayout({
  steps,
  step,
  title,
  description,
  children,
  primaryLabel = "Continue",
  onPrimary,
  primaryLoading,
  primaryDisabled,
  backLabel = "Back",
  onBack,
  onStepClick,
  locale,
  onLocaleChange,
  onSupport,
  userName,
  onAccount,
}: WizardLayoutProps) {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const styles = getStyles();
  const current = steps[step];

  return (
    <CustomerShell
      locale={locale}
      onLocaleChange={onLocaleChange}
      onSupport={onSupport}
      userName={userName}
      onAccount={onAccount}
      primaryAction={
        onPrimary
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
      <Flex gap={32} align="start" wrap={isMobile}>
        {isMobile ? (
          // A full rail on a phone eats the screen before the question does.
          <Flex vertical gap={4} style={styles.mobileRail}>
            <Typography.Text type="secondary">
              Step {step + 1} of {steps.length} — {current?.label}
            </Typography.Text>
            <Progress
              percent={Math.round(((step + 1) / steps.length) * 100)}
              showInfo={false}
              size="small"
            />
          </Flex>
        ) : (
          <Steps
            orientation="vertical"
            current={step}
            style={styles.rail}
            onChange={(next) => next < step && onStepClick?.(next)}
            items={steps.map((s, i) => ({ title: s.label, disabled: i > step }))}
          />
        )}

        <Card style={styles.card}>
          <Typography.Title level={4} style={styles.title}>
            {title}
          </Typography.Title>
          {description && (
            <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
          )}
          {children}
        </Card>
      </Flex>
    </CustomerShell>
  );
}
