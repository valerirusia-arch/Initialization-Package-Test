import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form, Input } from "antd";
import WizardLayout from "./WizardLayout";

const STEPS = [
  { label: "Your details" },
  { label: "Address & SSN" },
  { label: "Password" },
  { label: "Terms" },
  { label: "Confirm email" },
  { label: "Confirm phone" },
];

const meta: Meta<typeof WizardLayout> = {
  title: "Shared/WizardLayout",
  component: WizardLayout,
  parameters: { layout: "fullscreen" },
  args: {
    steps: STEPS,
    step: 0,
    title: "Your details",
    description:
      "We ask for this so we can check your identity. Your progress is saved at every step.",
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

type Story = StoryObj<typeof WizardLayout>;

export const FirstStep: Story = {};

/** From step 2 on there is always a way back — the WBS requires it. */
export const MidWizard: Story = {
  args: { step: 2, title: "Choose a password", onBack: () => {} },
};

export const LastStep: Story = {
  args: { step: 5, title: "Confirm your phone number", primaryLabel: "Create my account", onBack: () => {} },
};

export const Submitting: Story = {
  args: { step: 5, primaryLoading: true, onBack: () => {} },
};

export const NothingEnteredYet: Story = { args: { primaryDisabled: true } };

/** The six-step loan application uses the same layout with its own steps. */
export const LoanApplicationSteps: Story = {
  args: {
    steps: [
      { label: "Permissions" },
      { label: "Your income" },
      { label: "What you need" },
      { label: "Co-borrower" },
      { label: "Payment card" },
      { label: "Check and send" },
    ],
    step: 1,
    title: "Your income",
    userName: "María G.",
    onBack: () => {},
  },
};

export const Spanish: Story = {
  args: {
    locale: "es",
    title: "Sus datos",
    description: "Le pedimos esta información para verificar su identidad.",
    primaryLabel: "Continuar",
  },
};
