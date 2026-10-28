import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Input } from "antd";
import RegistrationLayout from "./RegistrationLayout";

const meta: Meta<typeof RegistrationLayout> = {
  title: "Auth/RegistrationLayout",
  component: RegistrationLayout,
  parameters: { layout: "fullscreen" },
  args: {
    step: 0,
    title: "Your details",
    description:
      "We ask for this so we can confirm who you are. Your progress is saved at every step.",
    locale: "en",
    onLocaleChange: () => {},
    onSupport: () => {},
    onPrimary: () => {},
    children: (
      <Form layout="vertical">
        <Form.Item label="First name" required>
          <Input />
        </Form.Item>
        <Form.Item label="Last name" required>
          <Input />
        </Form.Item>
      </Form>
    ),
  },
};
export default meta;

type Story = StoryObj<typeof RegistrationLayout>;

export const FirstStep: Story = {};
export const MidWizard: Story = { args: { step: 2, title: "Choose a password", onBack: () => {} } };
export const LastStep: Story = {
  args: { step: 5, title: "Confirm your phone number", primaryLabel: "Create my account", onBack: () => {} },
};
export const NothingEnteredYet: Story = { args: { primaryDisabled: true } };
export const Spanish: Story = {
  args: { locale: "es", title: "Sus datos", primaryLabel: "Continuar" },
};
