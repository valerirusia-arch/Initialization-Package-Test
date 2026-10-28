import type { Meta, StoryObj } from "@storybook/react-vite";
import PaymentMethodCard from "./PaymentMethodCard";

const meta: Meta<typeof PaymentMethodCard> = {
  title: "Payments/PaymentMethodCard",
  component: PaymentMethodCard,
  args: {
    brand: "Visa",
    number: "4111 1111 1111 4242",
    expiry: "08/2029",
    active: true,
    onUpdate: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof PaymentMethodCard>;

export const Active: Story = {};
export const NotActive: Story = { args: { active: false } };
export const Expired: Story = { args: { expired: true, expiry: "08/2026" } };
export const ReadOnly: Story = { args: { onUpdate: undefined } };
