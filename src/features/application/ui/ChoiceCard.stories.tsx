import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex, Radio } from "antd";
import ChoiceCard from "./ChoiceCard";

const meta: Meta<typeof ChoiceCard> = {
  title: "Application/ChoiceCard",
  component: ChoiceCard,
  args: {
    value: "n400",
    title: "N-400 — Application for Naturalization",
    description: "The main application to become a US citizen.",
    amount: 760,
  },
};
export default meta;

type Story = StoryObj<typeof ChoiceCard>;

export const Unselected: Story = {};
export const Selected: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const WithoutAmount: Story = {
  args: { amount: undefined, title: "I am not sure yet", description: "We can help you work it out." },
};

/** How it is actually used: a radio group of options with their fees. */
export const AsAGroup: Story = {
  render: () => (
    <Radio.Group value="n400" style={{ width: "100%" }}>
      <Flex vertical gap={12}>
        <ChoiceCard
          value="n400"
          title="N-400 — Application for Naturalization"
          description="The main application to become a US citizen."
          amount={760}
          checked
        />
        <ChoiceCard
          value="n400-reduced"
          title="N-400 with a reduced fee"
          description="If your household income qualifies you for the reduced USCIS fee."
          amount={380}
        />
        <ChoiceCard
          value="n600"
          title="N-600 — Certificate of Citizenship"
          description="If you are already a citizen through a parent and need the certificate."
          amount={1170}
        />
      </Flex>
    </Radio.Group>
  ),
};
