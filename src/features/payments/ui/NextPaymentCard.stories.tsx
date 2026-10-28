import type { Meta, StoryObj } from "@storybook/react-vite";
import NextPaymentCard from "./NextPaymentCard";

const meta: Meta<typeof NextPaymentCard> = {
  title: "Payments/NextPaymentCard",
  component: NextPaymentCard,
  args: {
    amount: 63.65,
    dueDate: "2027-04-01",
    onPay: () => {},
    onPayExtra: () => {},
  },
};
export default meta;

type Story = StoryObj<typeof NextPaymentCard>;

export const Upcoming: Story = {};

/** 5% of the instalment is $3.18, which is less than the $5.00 cap. */
export const OverdueWithFee: Story = {
  args: {
    overdue: true,
    dueDate: "2027-03-01",
    fee: 3.18,
    feeReason:
      "The payment was more than 15 days late, so a fee of 5% of the instalment was added. That is less than the $5.00 cap, so $3.18 was charged.",
  },
};

export const OverdueNoFeeYet: Story = {
  args: { overdue: true, dueDate: "2027-03-01" },
};

export const PaidOff: Story = { args: { paidOff: true } };

export const Spanish: Story = { args: { locale: "es-US" } };
