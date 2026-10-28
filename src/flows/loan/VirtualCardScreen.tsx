// src/flows/loan/VirtualCardScreen.tsx — /loan/card
//
// The issued virtual card. Borrower only — the co-borrower has no access to
// card information (PROJECT.md §4.3), which VirtualCardPanel expresses rather
// than this screen branching around it.

import { useState } from "react";
import { Card, Flex, Segmented, Typography } from "antd";
import CustomerShell from "../../shared/ui/CustomerShell";
import VirtualCardPanel from "../../features/loan/ui/VirtualCardPanel";
import { usePortal } from "../usePortal";
import { VIRTUAL_CARD } from "../portalMocks";

export default function VirtualCardScreen() {
  const portal = usePortal("loan");
  const [role, setRole] = useState<"borrower" | "co-borrower">("borrower");

  return (
    <CustomerShell {...portal} width="narrow">
      <Flex vertical gap={24}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Your payment card
        </Typography.Title>

        <VirtualCardPanel
          {...VIRTUAL_CARD}
          canView={role === "borrower"}
          onCopy={() => console.log("copy card number")}
        />

        {role === "borrower" && (
          <Card title="How to use it">
            <Flex vertical gap={8}>
              <Typography.Text type="secondary">
                1. Go to the USCIS payment page for your application.
              </Typography.Text>
              <Typography.Text type="secondary">
                2. Choose to pay by debit or credit card.
              </Typography.Text>
              <Typography.Text type="secondary">
                3. Enter the number, the expiry date and the security code above.
              </Typography.Text>
              <Typography.Text type="secondary">
                The card only works once, for your fee. If the payment does not
                go through, call us before trying again.
              </Typography.Text>
            </Flex>
          </Card>
        )}

        <Card size="small" title="Preview as">
          <Segmented
            value={role}
            onChange={(v) => setRole(v as "borrower" | "co-borrower")}
            options={[
              { label: "Borrower", value: "borrower" },
              { label: "Co-borrower", value: "co-borrower" },
            ]}
          />
        </Card>
      </Flex>
    </CustomerShell>
  );
}
