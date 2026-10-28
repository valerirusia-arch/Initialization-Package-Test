import type { Meta, StoryObj } from "@storybook/react-vite";
import LoanSummary from "./LoanSummary";

const meta: Meta<typeof LoanSummary> = {
  title: "Loan/LoanSummary",
  component: LoanSummary,
  args: {
    status: "Funded",
    amount: 760,
    unusedBalance: 760,
    outstanding: 636.5,
    apr: 1,
    termMonths: 12,
    monthlyPayment: 63.65,
    nextPaymentDue: "2027-04-01",
  },
};
export default meta;

type Story = StoryObj<typeof LoanSummary>;

export const Repaying: Story = {};

/** Just funded: the useful number is what is still on the card. */
export const JustFunded: Story = {
  args: { headline: "unused", status: "Funded", outstanding: 763.8 },
};

export const PastDue: Story = { args: { status: "Past due" } };

export const PaidOff: Story = {
  args: { status: "Paid off", outstanding: 0, unusedBalance: 0 },
};

export const Spanish: Story = { args: { locale: "es-US" } };
