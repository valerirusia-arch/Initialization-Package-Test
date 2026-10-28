import type { Meta, StoryObj } from "@storybook/react-vite";
import DocumentList from "./DocumentList";

const meta: Meta<typeof DocumentList> = {
  title: "Loan/DocumentList",
  component: DocumentList,
  args: {
    documents: [
      { key: "d1", name: "Credit authorization", signedOn: "2026-10-14", size: "180 KB" },
      { key: "d2", name: "Electronic disclosures", signedOn: "2026-10-14", size: "96 KB" },
      { key: "d3", name: "Loan agreement", signedOn: "2026-10-22", size: "240 KB" },
      { key: "d4", name: "Truth in Lending disclosure", signedOn: "2026-10-22", size: "88 KB" },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof DocumentList>;

export const Signed: Story = {};

/** Empty states carry the next thing that will happen — never a bare "No data". */
export const NothingYet: Story = { args: { documents: [] } };

export const Spanish: Story = { args: { locale: "es-US" } };
