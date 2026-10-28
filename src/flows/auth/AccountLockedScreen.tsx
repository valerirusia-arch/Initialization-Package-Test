// src/flows/auth/AccountLockedScreen.tsx
//
// Route: /auth/account-locked
//
// A locked account is the clearest dead end in the product, so this screen
// exists purely to not be one: it says what happened, that nothing was lost,
// and gives two ways forward — reset the password, or call a number that is
// printed on the screen rather than hidden behind a "contact us" link.
//
// It never says whether the email address exists. The lock state must not
// become a way to probe who banks with OPA.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button, Flex, Result, Typography } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import AuthCard from "../../features/auth/ui/AuthCard";

export default function AccountLockedScreen() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");

  return (
    <AuthCard
      title="We locked this account"
      description="There were too many sign-in attempts, so we locked the account to keep it safe. Nothing in your application has been lost."
      locale={locale}
      onLocaleChange={setLocale}
      primaryLabel="Reset my password"
      onPrimary={() => navigate({ to: "/auth/forgot-password" })}
      footer={
        <Button type="link" onClick={() => navigate({ to: "/auth/login" })}>
          Back to sign in
        </Button>
      }
    >
      <Result
        status="warning"
        title="Two ways to get back in"
        subTitle="Reset your password, or call us and we will unlock it with you."
        extra={
          <Flex vertical align="center" gap={4}>
            <Flex align="center" gap={8}>
              <PhoneOutlined />
              <Typography.Text strong copyable>
                617-404-9797
              </Typography.Text>
            </Flex>
            <Typography.Text type="secondary">
              Monday to Friday, 9am – 5pm Eastern. We speak English and Spanish.
            </Typography.Text>
          </Flex>
        }
      />
    </AuthCard>
  );
}
