import type { Meta, StoryObj } from "@storybook/react-vite";
import ScheduleTable from "./ScheduleTable";
import type { ScheduleRow } from "./ScheduleTable";

const rows: ScheduleRow[] = Array.from({ length: 12 }, (_, i) => ({
  key: String(i + 1),
  number: i + 1,
  due: new Date(Date.UTC(2027, i, 1)).toISOString().slice(0, 10),
  amount: 63.65,
  status: i < 2 ? "Succeeded" : i === 2 ? "Overdue" : "Scheduled",
  fee: i === 2 ? 3.18 : undefined,
}));

const meta: Meta<typeof ScheduleTable> = {
  title: "Payments/ScheduleTable",
  component: ScheduleTable,
  args: { rows, nextKey: "3" },
};
export default meta;

type Story = StoryObj<typeof ScheduleTable>;

export const WithAnOverduePayment: Story = {};

export const AllPaid: Story = {
  args: {
    rows: rows.map((r) => ({ ...r, status: "Succeeded", fee: undefined })),
    nextKey: undefined,
  },
};

export const NothingPaidYet: Story = {
  args: {
    rows: rows.map((r) => ({ ...r, status: "Scheduled", fee: undefined })),
    nextKey: "1",
  },
};

export const Loading: Story = { args: { rows: [], loading: true } };

export const Spanish: Story = { args: { locale: "es-US" } };
