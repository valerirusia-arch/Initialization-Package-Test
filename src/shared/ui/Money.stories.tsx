import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "antd";
import Money from "./Money";

const meta: Meta<typeof Money> = {
  title: "Shared/Money",
  component: Money,
  args: { amount: 1340.5 },
};
export default meta;

type Story = StoryObj<typeof Money>;

export const Default: Story = {};

export const LoanAmount: Story = {
  args: { amount: 760, hideCents: true, size: "large" },
};

export const Overdue: Story = {
  args: { amount: 68.42, type: "danger", strong: true },
};

export const Paid: Story = {
  args: { amount: 68.42, type: "success" },
};

/** The same figure in both shipped locales — Spanish must not fall back to English. */
export const BothLocales: Story = {
  render: (args) => (
    <Flex gap={24}>
      <Money {...args} locale="en-US" />
      <Money {...args} locale="es-US" />
    </Flex>
  ),
};
