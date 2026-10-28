import type { Meta, StoryObj } from "@storybook/react-vite";
import { Flex, Typography } from "antd";
import StatusTag from "./StatusTag";
import { STATUS, type StatusKind } from "./statusMeta";

const meta: Meta<typeof StatusTag> = {
  title: "Shared/StatusTag",
  component: StatusTag,
};
export default meta;

type Story = StoryObj<typeof StatusTag>;

/** Every vocabulary at once — this is the sheet to check after a token change. */
function AllOf({ kind }: { kind: StatusKind }) {
  return (
    <Flex vertical gap={8}>
      <Typography.Text type="secondary">{kind}</Typography.Text>
      <Flex wrap gap={8}>
        {Object.keys(STATUS[kind]).map((s) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <StatusTag key={s} kind={kind as any} status={s as any} />
        ))}
      </Flex>
    </Flex>
  );
}

export const AllVocabularies: Story = {
  render: () => (
    <Flex vertical gap={24}>
      {(Object.keys(STATUS) as StatusKind[]).map((k) => (
        <AllOf key={k} kind={k} />
      ))}
    </Flex>
  ),
};

export const Application: Story = {
  args: { kind: "application", status: "Under review" },
};

export const Approved: Story = {
  args: { kind: "application", status: "Approved" },
};

export const Declined: Story = {
  args: { kind: "application", status: "Declined" },
};

export const Overdue: Story = {
  args: { kind: "payment", status: "Overdue" },
};
