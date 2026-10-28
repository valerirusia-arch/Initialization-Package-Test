import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import AuthCard from "./AuthCard";

const meta: Meta<typeof AuthCard> = {
  title: "Auth/AuthCard",
  component: AuthCard,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Sign in",
    locale: "en",
    onLocaleChange: () => {},
    onSupport: () => {},
    primaryLabel: "Sign in",
  },
};
export default meta;

type Story = StoryObj<typeof AuthCard>;

export const SignIn: Story = {
  args: {
    children: (
      <Form layout="vertical">
        <Form.Item label="Email address" required>
          <Input autoComplete="username" />
        </Form.Item>
        <Form.Item label="Password" required>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item>
          <Checkbox>Keep me signed in on this device</Checkbox>
        </Form.Item>
      </Form>
    ),
    footer: (
      <>
        <Button type="link">Forgot your password?</Button>
        <Button type="link">Create an account</Button>
      </>
    ),
  },
};

export const SignInFailed: Story = {
  args: {
    children: (
      <Alert
        type="error"
        showIcon
        title="That email and password do not match"
        description="You have 3 attempts left before we lock the account."
      />
    ),
  },
};

export const CheckYourEmail: Story = {
  args: {
    title: "Check your email",
    description:
      "If that address is registered with us, we have sent a link to reset your password. The link works for 24 hours.",
    primaryLabel: undefined,
    children: null,
    footer: <Button type="link">Back to sign in</Button>,
  },
};

export const Spanish: Story = {
  args: {
    locale: "es",
    title: "Iniciar sesión",
    primaryLabel: "Iniciar sesión",
    children: (
      <Form layout="vertical">
        <Form.Item label="Correo electrónico" required>
          <Input />
        </Form.Item>
        <Form.Item label="Contraseña" required>
          <Input.Password />
        </Form.Item>
      </Form>
    ),
    footer: <Button type="link">¿Olvidó su contraseña?</Button>,
  },
};
