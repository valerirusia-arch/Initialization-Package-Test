import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex, Typography } from "antd";
import DisplayTitle from "./DisplayTitle";

const meta: Meta<typeof DisplayTitle> = {
  title: "Shared/DisplayTitle",
  component: DisplayTitle,
  args: { children: "Apply for citizenship. Pay over time." },
};
export default meta;

type Story = StoryObj<typeof DisplayTitle>;

export const Level1: Story = {};

export const Level2: Story = {
  args: { level: 2, children: "Your application was submitted" },
};

export const Centered: Story = {
  args: { align: "center", children: "Your loan is approved" },
};

/** The intended pairing: display headline, Inter body. */
export const WithBodyCopy: Story = {
  render: (args) => (
    <Flex vertical gap={4} style={{ maxWidth: 560 }}>
      <DisplayTitle {...args} />
      <Typography.Paragraph type="secondary">
        We will send your loan funds to USCIS on your behalf. Repayment starts
        within 45 days, and your rate is 1%.
      </Typography.Paragraph>
    </Flex>
  ),
};

/** Spanish runs longer — the headline has to wrap without losing its rhythm. */
export const Spanish: Story = {
  args: { children: "Solicite la ciudadanía. Pague con el tiempo." },
};
