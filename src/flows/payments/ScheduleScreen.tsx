// src/flows/payments/ScheduleScreen.tsx — /payments/schedule
//
// The full schedule. Generated when the loan is funded, first payment within
// 45 days of approval, then the 1st of each month (WBS).

import { useNavigate } from "@tanstack/react-router";
import { Alert, Card, Flex, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import ScheduleTable from "../../features/payments/ui/ScheduleTable";
import DateText from "../../shared/ui/DateText";
import { usePortal } from "../usePortal";
import { LATE_FEE, LOAN, SCHEDULE } from "../portalMocks";

export default function ScheduleScreen() {
  const navigate = useNavigate();
  const portal = usePortal("payments");

  const rows = SCHEDULE.map((row) =>
    row.status === "Overdue" ? { ...row, fee: LATE_FEE.amount } : row
  );

  return (
    <CustomerShell {...portal} width="wide">
      <Flex vertical gap={24}>
        <Flex vertical gap={8}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Repayment schedule
          </Typography.Title>
          <Typography.Text type="secondary">
            {LOAN.termMonths} payments, starting{" "}
            <DateText value={LOAN.firstPaymentDue} format="long" />, then the 1st
            of each month.
          </Typography.Text>
        </Flex>

        <Alert
          type="warning"
          showIcon
          title="One payment is late"
          description="A late fee was added on the 16th day. Paying it now stops anything else being added."
          action={
            <Typography.Link onClick={() => navigate({ to: "/payments/make" })}>
              Pay now
            </Typography.Link>
          }
        />

        <Card styles={{ body: { padding: 0 } }}>
          <ScheduleTable rows={rows} nextKey="3" />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
