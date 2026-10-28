import type { Meta, StoryObj } from "@storybook/react-vite";
import OtpField from "./OtpField";

const meta: Meta<typeof OtpField> = {
  title: "Auth/OtpField",
  component: OtpField,
  args: { sentTo: "m•••a@example.com" },
};
export default meta;

type Story = StoryObj<typeof OtpField>;

export const Email: Story = {};

export const Phone: Story = {
  args: { sentTo: "(•••) •••-4821" },
};

/** Cooldown stated as a number — never a disabled button with no explanation. */
export const ResendCoolingDown: Story = {
  args: { resendIn: 42 },
};

export const WrongCode: Story = {
  args: {
    value: "123456",
    error: "That code did not match. Check the last code we sent, or ask for a new one.",
  },
};

export const CodeExpired: Story = {
  args: {
    error: "That code has expired. Ask for a new one and we will send it right away.",
  },
};

export const Verifying: Story = {
  args: { value: "482913", disabled: true },
};
