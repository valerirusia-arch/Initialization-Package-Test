import type { Meta, StoryObj } from "@storybook/react-vite";
import DocumentUpload from "./DocumentUpload";

const types = [
  { value: "paystub", label: "Pay stub" },
  { value: "tax-return", label: "Tax return" },
  { value: "benefits", label: "Benefits letter" },
  { value: "employer-letter", label: "Letter from your employer" },
  { value: "bank", label: "Bank statement" },
];

const meta: Meta<typeof DocumentUpload> = {
  title: "Application/DocumentUpload",
  component: DocumentUpload,
  args: { types, documents: [] },
};
export default meta;

type Story = StoryObj<typeof DocumentUpload>;

/** Nothing chosen yet: the picker is off and the screen says why. */
export const NothingChosen: Story = {};

export const TypeChosen: Story = { args: { selectedType: "paystub" } };

export const OneUploaded: Story = {
  args: {
    selectedType: "paystub",
    documents: [{ key: "1", name: "paystub-october.pdf", type: "Pay stub", size: "412 KB" }],
  },
};

export const SeveralUploaded: Story = {
  args: {
    selectedType: "tax-return",
    documents: [
      { key: "1", name: "paystub-october.pdf", type: "Pay stub", size: "412 KB" },
      { key: "2", name: "tax-return-2026.pdf", type: "Tax return", size: "1.2 MB" },
    ],
  },
};

export const TooLarge: Story = {
  args: {
    selectedType: "bank",
    error: "That file is larger than 10 MB. Try a photo of just the page we need.",
  },
};
