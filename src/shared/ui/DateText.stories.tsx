import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex } from "antd";
import DateText from "./DateText";

const meta: Meta<typeof DateText> = {
  title: "Shared/DateText",
  component: DateText,
  args: { value: "2027-01-01" },
};
export default meta;

type Story = StoryObj<typeof DateText>;

export const Short: Story = {};
export const Long: Story = { args: { format: "long" } };
export const Numeric: Story = { args: { format: "numeric" } };

export const OverdueDueDate: Story = {
  args: { format: "long", type: "danger", strong: true },
};

/** Spanish month names are longer — this is where a fixed-width cell breaks. */
export const BothLocales: Story = {
  render: (args) => (
    <Flex vertical gap={8}>
      <DateText {...args} format="long" locale="en-US" />
      <DateText {...args} format="long" locale="es-US" />
    </Flex>
  ),
};
