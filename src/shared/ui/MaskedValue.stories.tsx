import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "antd";
import MaskedValue from "./MaskedValue";

const meta: Meta<typeof MaskedValue> = {
  title: "Shared/MaskedValue",
  component: MaskedValue,
};
export default meta;

type Story = StoryObj<typeof MaskedValue>;

export const Ssn: Story = {
  args: { value: "123-45-6789", kind: "ssn" },
};

export const SsnRevealable: Story = {
  args: { value: "123-45-6789", kind: "ssn", revealable: true },
};

export const RepaymentCard: Story = {
  args: { value: "4111 1111 1111 4242", kind: "card", prefix: "Visa" },
};

/** The virtual card: borrower-only, and the only place a full number is shown. */
export const VirtualCard: Story = {
  args: { value: "5200 8282 8282 8210", kind: "card", prefix: "Mastercard", revealable: true },
};

export const InARow: Story = {
  render: () => (
    <Flex vertical gap={12}>
      <MaskedValue value="123-45-6789" kind="ssn" />
      <MaskedValue value="4111 1111 1111 4242" kind="card" prefix="Visa" />
      <MaskedValue value="000123456789" kind="account" prefix="Account" />
    </Flex>
  ),
};
