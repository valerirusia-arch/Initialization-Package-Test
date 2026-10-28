// src/features/payments/ui/ScheduleTable.tsx
//
// The repayment schedule: due dates, amounts, what is paid, what is overdue,
// and any fee that was applied.
//
// The next payment due is marked rather than left for the reader to find — on
// a twelve-row table, "which one is mine this month" is the only question most
// people arrive with.

import { Flex, Table, Tag, Typography } from "antd";
import Money from "../../../shared/ui/Money";
import DateText from "../../../shared/ui/DateText";
import StatusTag from "../../../shared/ui/StatusTag";
import type { STATUS } from "../../../shared/ui/statusMeta";

export type ScheduleRow = {
  key: string;
  number: number;
  due: string;
  amount: number;
  status: keyof (typeof STATUS)["payment"];
  /** A late fee applied to this instalment, if any. */
  fee?: number;
};

export type ScheduleTableProps = {
  rows: ScheduleRow[];
  /** Key of the instalment that is due next. */
  nextKey?: string;
  locale?: string;
  loading?: boolean;
};

export default function ScheduleTable({
  rows,
  nextKey,
  locale,
  loading,
}: ScheduleTableProps) {
  return (
    <Table
      dataSource={rows}
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: "max-content" }}
      rowKey="key"
      columns={[
        {
          title: "Payment",
          dataIndex: "number",
          render: (n: number, row) => (
            <Flex align="center" gap={8}>
              <Typography.Text>{n} of {rows.length}</Typography.Text>
              {row.key === nextKey && <Tag color="processing">Next</Tag>}
            </Flex>
          ),
        },
        {
          title: "Due",
          dataIndex: "due",
          render: (d: string, row) => (
            <DateText
              value={d}
              format="long"
              locale={locale}
              type={row.status === "Overdue" ? "danger" : undefined}
              strong={row.key === nextKey}
            />
          ),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          align: "right",
          render: (a: number, row) => (
            <Money
              amount={a + (row.fee ?? 0)}
              locale={locale}
              type={row.status === "Overdue" ? "danger" : undefined}
            />
          ),
        },
        {
          title: "Late fee",
          dataIndex: "fee",
          align: "right",
          render: (f?: number) =>
            f ? <Money amount={f} locale={locale} type="danger" /> : <Typography.Text type="secondary">—</Typography.Text>,
        },
        {
          title: "Status",
          dataIndex: "status",
          render: (s: ScheduleRow["status"]) => <StatusTag kind="payment" status={s} />,
        },
      ]}
    />
  );
}
