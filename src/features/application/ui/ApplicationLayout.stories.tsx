import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Input } from "antd";
import ApplicationLayout from "./ApplicationLayout";

const meta: Meta<typeof ApplicationLayout> = {
  title: "Application/ApplicationLayout",
  component: ApplicationLayout,
  parameters: { layout: "fullscreen" },
  args: {
    step: 1,
    title: "Your income",
    description:
      "Tell us what you earn in a year, then upload one document that shows it.",
    userName: "María G.",
    locale: "en",
    onLocaleChange: () => {},
    onSupport: () => {},
    onPrimary: () => {},
    onBack: () => {},
    children: (
      <Form layout="vertical">
        <Form.Item label="Annual income" required help="Before taxes, in US dollars.">
          <Input prefix="$" />
        </Form.Item>
      </Form>
    ),
  },
};
export default meta;

type Story = StoryObj<typeof ApplicationLayout>;

export const IncomeStep: Story = {};
export const FirstStep: Story = { args: { step: 0, title: "Permissions", onBack: undefined } };
export const LastStep: Story = {
  args: { step: 5, title: "Check and send", primaryLabel: "Send my application" },
};
