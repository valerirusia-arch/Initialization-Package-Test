import type { Meta, StoryObj } from "@storybook/react-vite";
import ReviewSummary from "./ReviewSummary";
import MaskedValue from "../../../shared/ui/MaskedValue";
import Money from "../../../shared/ui/Money";
import StatusTag from "../../../shared/ui/StatusTag";

const sections = [
  {
    key: "you",
    title: "About you",
    onChange: () => {},
    items: [
      { label: "Name", value: "María González" },
      { label: "Date of birth", value: "14 March 1991" },
      { label: "Social Security number", value: <MaskedValue value="123-45-6789" kind="ssn" /> },
      { label: "Address", value: "48 Hyde Park Ave, Boston, MA 02130" },
    ],
  },
  {
    key: "income",
    title: "Your income",
    onChange: () => {},
    items: [
      { label: "Annual income", value: <Money amount={38400} hideCents /> },
      { label: "Document", value: "paystub-october.pdf" },
    ],
  },
  {
    key: "loan",
    title: "What you need",
    onChange: () => {},
    items: [
      { label: "USCIS service", value: "N-400 — Application for Naturalization" },
      { label: "Loan amount", value: <Money amount={760} hideCents /> },
      { label: "Rate", value: "1% APR" },
    ],
  },
  {
    key: "co",
    title: "Co-borrower",
    onChange: () => {},
    items: [
      { label: "Name", value: "Alvaro García" },
      { label: "Invitation", value: <StatusTag kind="invitation" status="Pending" /> },
    ],
  },
];

const meta: Meta<typeof ReviewSummary> = {
  title: "Application/ReviewSummary",
  component: ReviewSummary,
  args: { sections },
};
export default meta;

type Story = StoryObj<typeof ReviewSummary>;

export const BeforeSending: Story = {};

/** On the status screen nothing is editable, so no Change links are rendered. */
export const ReadOnly: Story = {
  args: { sections: sections.map((s) => ({ ...s, onChange: undefined })) },
};

export const Spanish: Story = {
  args: {
    changeLabel: "Cambiar",
    sections: [
      {
        key: "you",
        title: "Sobre usted",
        onChange: () => {},
        items: [
          { label: "Nombre", value: "María González" },
          { label: "Dirección", value: "48 Hyde Park Ave, Boston, MA 02130" },
        ],
      },
    ],
  },
};
