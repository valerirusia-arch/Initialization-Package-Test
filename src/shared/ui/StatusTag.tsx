// src/shared/ui/StatusTag.tsx
//
// Every status in the product renders through this component. Colour never
// carries the meaning alone — the word is always in the tag (DESIGN.md §7).

import { Tag } from "antd";
import { STATUS, type StatusKind, type StatusOf } from "./statusMeta";

type Props = {
  [K in StatusKind]: {
    /** Which vocabulary this status belongs to (PROJECT.md §5). */
    kind: K;
    status: StatusOf<K>;
  };
}[StatusKind];

export default function StatusTag(props: Props) {
  const { kind, status } = props;
  const color = (STATUS[kind] as Record<string, string>)[status as string];
  return <Tag color={color}>{String(status)}</Tag>;
}
