// src/shared/ui/ThirdPartyFrame.tsx
//
// The surface around a third-party embed — Repay's card form, DocuSign's
// signing session. DESIGN.md §6.
//
// Two rules it exists to enforce:
//   1. We NEVER hand-build a card form. Card details go into Repay's own
//      embedded form and only a token ever reaches OPA. In Design Mode the
//      frame is a placeholder; it must stay one.
//   2. The user is told what is about to happen BEFORE it happens, and every
//      outcome has a next action. Handing someone a blank iframe at the moment
//      they are asked for a card number is how trust is lost.

import type { ReactNode } from "react";
import { Alert, Button, Card, Flex, Skeleton, Typography, theme } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { getStyles } from "./ThirdPartyFrame.styles";

export type ThirdPartyFrameProps = {
  provider: "Repay" | "DocuSign";
  title: string;
  /** Plain language: what happens, who sees what, what we store. */
  description: ReactNode;
  state: "idle" | "loading" | "active" | "error" | "done";
  /** Shown in the error state. A failure here must never be a dead end. */
  errorMessage?: string;
  startLabel?: string;
  onStart?: () => void;
  onRetry?: () => void;
  /** Rendered in the "active" state. In Design Mode, leave it out. */
  children?: ReactNode;
  height?: number;
};

export default function ThirdPartyFrame({
  provider,
  title,
  description,
  state,
  errorMessage,
  startLabel,
  onStart,
  onRetry,
  children,
  height = 320,
}: ThirdPartyFrameProps) {
  const { token } = theme.useToken();
  const styles = getStyles(token, height);

  return (
    <Card title={title}>
      <Flex vertical gap={16}>
        <Typography.Paragraph type="secondary" style={styles.description}>
          {description}
        </Typography.Paragraph>

        {state === "idle" && (
          <Flex vertical align="start" gap={12}>
            <Flex align="center" gap={8}>
              <LockOutlined style={styles.lock} />
              <Typography.Text type="secondary">
                Handled securely by {provider}. OPA never stores your full details.
              </Typography.Text>
            </Flex>
            <Button type="primary" onClick={onStart}>
              {startLabel ?? `Continue to ${provider}`}
            </Button>
          </Flex>
        )}

        {state === "loading" && (
          <div style={styles.frame}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        )}

        {state === "active" && (
          <div style={styles.frame}>
            {children ?? (
              <Flex align="center" justify="center" style={styles.placeholder}>
                <Typography.Text type="secondary">
                  {provider} form renders here
                </Typography.Text>
              </Flex>
            )}
          </div>
        )}

        {state === "error" && (
          <Alert
            type="error"
            showIcon
            title={`We could not reach ${provider}`}
            description={
              errorMessage ??
              "Your progress is saved. Please try again in a few minutes, or contact Customer Service."
            }
            action={
              onRetry && (
                <Button size="small" onClick={onRetry}>
                  Try again
                </Button>
              )
            }
          />
        )}

        {state === "done" && (
          <Alert
            type="success"
            showIcon
            title={
              provider === "DocuSign" ? "Documents signed" : "Card saved"
            }
            description={
              provider === "DocuSign"
                ? "A copy is available in your documents."
                : "Only a secure token is stored. You can change this card at any time."
            }
          />
        )}
      </Flex>
    </Card>
  );
}
