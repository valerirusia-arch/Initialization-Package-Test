// src/features/auth/ui/OtpField.tsx
//
// The one-time code step, used for both email and phone verification.
//
// Design notes that are not decoration:
//  - The destination is shown, masked. "We sent a code" with no address is how
//    someone sits waiting on a typo they made two screens ago.
//  - "Resend" is always reachable, with its cooldown stated as a number, not
//    hidden behind a disabled button with no explanation.
//  - The error is a sentence. "Invalid OTP" is not a sentence.

import { Alert, Button, Flex, Input, Typography } from "antd";
import { getStyles } from "./OtpField.styles";

export type OtpFieldProps = {
  /** Where the code went, already masked: "m•••a@example.com", "(•••) •••-4821". */
  sentTo: string;
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  /** Fires when every digit is filled — lets the screen submit without a click. */
  onComplete?: (value: string) => void;
  /** A sentence, not a code. */
  error?: string;
  /** Seconds until "Resend" becomes available. 0 = available now. */
  resendIn?: number;
  onResend?: () => void;
  disabled?: boolean;
};

export default function OtpField({
  sentTo,
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  resendIn = 0,
  onResend,
  disabled,
}: OtpFieldProps) {
  const styles = getStyles();

  return (
    <Flex vertical gap={16}>
      <Typography.Text>
        We sent a {length}-digit code to <Typography.Text strong>{sentTo}</Typography.Text>.
      </Typography.Text>

      <Input.OTP
        length={length}
        value={value}
        onChange={onComplete}
        onInput={(chars) => onChange?.(chars.join(""))}
        status={error ? "error" : undefined}
        disabled={disabled}
        size="large"
        style={styles.otp}
      />

      {error && <Alert type="error" showIcon title={error} />}

      <Flex align="center" gap={8} wrap>
        <Typography.Text type="secondary">Did not get it?</Typography.Text>
        {resendIn > 0 ? (
          <Typography.Text type="secondary">
            You can ask for a new code in {resendIn} seconds.
          </Typography.Text>
        ) : (
          <Button type="link" onClick={onResend} style={styles.resend}>
            Send a new code
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
