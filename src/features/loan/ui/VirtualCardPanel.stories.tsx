import type { Meta, StoryObj } from "@storybook/react-vite";
import VirtualCardPanel from "./VirtualCardPanel";

const meta: Meta<typeof VirtualCardPanel> = {
  title: "Loan/VirtualCardPanel",
  component: VirtualCardPanel,
  args: {
    brand: "Mastercard",
    number: "5200 8282 8282 8210",
    expiry: "11/2028",
    cvv: "•••",
    balance: 760,
  },
};
export default meta;

type Story = StoryObj<typeof VirtualCardPanel>;

export const Borrower: Story = {};

/** The co-borrower never sees card information — PROJECT.md §4.3. */
export const CoBorrowerCannotView: Story = { args: { canView: false } };

export const PartlySpent: Story = { args: { balance: 0 } };
