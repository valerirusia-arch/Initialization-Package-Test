import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, Flex, Form, Input, Steps, Typography } from "antd";
import CustomerShell from "./CustomerShell";
import DisplayTitle from "./DisplayTitle";

const meta: Meta<typeof CustomerShell> = {
  title: "Shared/CustomerShell",
  component: CustomerShell,
  parameters: { layout: "fullscreen" },
  args: {
    nav: [
      { key: "loan", label: "My loan" },
      { key: "payments", label: "Payments" },
      { key: "help", label: "Help" },
    ],
    activeKey: "loan",
    locale: "en",
    onLocaleChange: () => {},
    userName: "María G.",
    onSupport: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof CustomerShell>;

/** Signed out: no account menu, no nav — the auth screens use this. */
export const SignedOut: Story = {
  args: {
    nav: [],
    userName: undefined,
    primaryAction: { label: "Continue" },
    children: (
      <Card>
        <DisplayTitle level={2}>Create your account</DisplayTitle>
        <Typography.Paragraph type="secondary">
          We ask for this information to check your identity. Your progress is
          saved at every step.
        </Typography.Paragraph>
        <Form layout="vertical">
          <Form.Item label="First name" required>
            <Input />
          </Form.Item>
          <Form.Item label="Email address" required help="We will send you a code to confirm it.">
            <Input />
          </Form.Item>
        </Form>
      </Card>
    ),
  },
};

/** The wizard: vertical step rail on the left, one card on the right. */
export const ApplicationWizard: Story = {
  args: {
    nav: [],
    primaryAction: { label: "Continue" },
    secondaryAction: { label: "Back" },
    children: (
      <Flex gap={32} align="start" wrap>
        <Steps
          orientation="vertical"
          current={2}
          style={{ minWidth: 200, flex: "0 0 auto" }}
          items={[
            { title: "Your details" },
            { title: "Consents" },
            { title: "Income" },
            { title: "Loan details" },
            { title: "Co-borrower" },
            { title: "Payment card" },
            { title: "Review" },
          ]}
        />
        <Card style={{ flex: "1 1 320px" }}>
          <Typography.Title level={4} style={{ marginTop: 0 }}>
            Your income
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            Tell us what you earn in a year, then upload one document that shows
            it — a pay stub, a tax return or a benefits letter.
          </Typography.Paragraph>
          <Form layout="vertical">
            <Form.Item label="Annual income" required help="Before taxes, in US dollars.">
              <Input prefix="$" />
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    ),
  },
};

/** Signed in, wide: the loan dashboard. */
export const SignedInWide: Story = {
  args: {
    width: "wide",
    activeKey: "payments",
    children: (
      <Card>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Repayment schedule
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Your payments are due on the 1st of each month.
        </Typography.Paragraph>
      </Card>
    ),
  },
};

/** Spanish — longer nav labels and a longer button are the real stress here. */
export const Spanish: Story = {
  args: {
    locale: "es",
    nav: [
      { key: "loan", label: "Mi préstamo" },
      { key: "payments", label: "Pagos" },
      { key: "help", label: "Ayuda" },
    ],
    primaryAction: { label: "Continuar" },
    children: (
      <Card>
        <DisplayTitle level={2}>Su solicitud fue enviada</DisplayTitle>
        <Typography.Paragraph type="secondary">
          Revisaremos su solicitud y le avisaremos por correo electrónico y
          mensaje de texto.
        </Typography.Paragraph>
      </Card>
    ),
  },
};
