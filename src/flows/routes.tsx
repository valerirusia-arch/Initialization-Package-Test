// src/flows/routes.tsx
//
// DESIGNER-OWNED. The declarative route tree: structure and navigation only.
// There is deliberately no `loader` or `guard` field — there's nowhere to put
// logic, which is what keeps this folder safe to own.
//
// /app/router.tsx consumes this tree generically and builds the real router
// from it. Adding a screen = drop a component in src/flows/<name>/ and add an
// entry here. You never touch /app.
//
// Param syntax is `:id` (readable). The bridge in /app translates it to
// TanStack's `$id` — don't write `$id` here.
//
// This is the CUSTOMER portal. The internal back-office (/staff) is not built
// yet; its screen map is in PROJECT.md §4.5.

import type { ComponentType } from "react";

// Auth
import LoginScreen from "./auth/LoginScreen";
import AccountLockedScreen from "./auth/AccountLockedScreen";
import ForgotPasswordScreen from "./auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./auth/ResetPasswordScreen";
import SetPasswordScreen from "./auth/SetPasswordScreen";
import RegisterDetailsScreen from "./auth/RegisterDetailsScreen";
import RegisterIdentityScreen from "./auth/RegisterIdentityScreen";
import RegisterSecurityScreen from "./auth/RegisterSecurityScreen";
import RegisterTermsScreen from "./auth/RegisterTermsScreen";
import VerifyEmailScreen from "./auth/VerifyEmailScreen";
import VerifyPhoneScreen from "./auth/VerifyPhoneScreen";
import SupportScreen from "./auth/SupportScreen";

// Loan application
import ApplicationStartScreen from "./application/ApplicationStartScreen";
import ConsentsScreen from "./application/ConsentsScreen";
import IncomeScreen from "./application/IncomeScreen";
import LoanDetailsScreen from "./application/LoanDetailsScreen";
import CoBorrowerScreen from "./application/CoBorrowerScreen";
import CardScreen from "./application/CardScreen";
import ReviewScreen from "./application/ReviewScreen";
import SubmittedScreen from "./application/SubmittedScreen";
import StatusScreen from "./application/StatusScreen";
import ApplicationDocumentsScreen from "./application/ApplicationDocumentsScreen";
import AdditionalInfoScreen from "./application/AdditionalInfoScreen";
import WithdrawScreen from "./application/WithdrawScreen";
import UnableToProceedScreen from "./application/UnableToProceedScreen";
import TechnicalErrorScreen from "./application/TechnicalErrorScreen";

// Co-borrower
import InvitationScreen from "./co-borrower/InvitationScreen";
import CoApplicationScreen from "./co-borrower/CoApplicationScreen";

// Loan
import LoanScreen from "./loan/LoanScreen";
import SignAgreementScreen from "./loan/SignAgreementScreen";
import VirtualCardScreen from "./loan/VirtualCardScreen";
import LoanDocumentsScreen from "./loan/LoanDocumentsScreen";
import CancelLoanScreen from "./loan/CancelLoanScreen";

// Payments
import PaymentsOverviewScreen from "./payments/PaymentsOverviewScreen";
import ScheduleScreen from "./payments/ScheduleScreen";
import HistoryScreen from "./payments/HistoryScreen";
import MakePaymentScreen from "./payments/MakePaymentScreen";
import ExtraPaymentScreen from "./payments/ExtraPaymentScreen";
import PaymentResultScreen from "./payments/PaymentResultScreen";
import PaymentMethodsScreen from "./payments/PaymentMethodsScreen";
import UpdateMethodScreen from "./payments/UpdateMethodScreen";
import FeesScreen from "./payments/FeesScreen";

// Profile
import ProfileScreen from "./profile/ProfileScreen";
import EditProfileScreen from "./profile/EditProfileScreen";
import ChangePasswordScreen from "./profile/ChangePasswordScreen";
import NotificationPreferencesScreen from "./profile/NotificationPreferencesScreen";

export type FlowRoute = {
  /** "/" | "loans" | ":id". Nested under the parent's path. */
  path: string;
  /** The screen. Omit on a node that exists purely to group children. */
  component?: ComponentType;
  children?: FlowRoute[];
  /**
   * Design annotation ONLY — grouping/labels for the DevBar and the Flow Map.
   * NOT enforcement: `meta.role: "admin"` restricts nothing.
   * Real role guards are dev's, in /app.
   */
  meta?: {
    role?: string;
    flow?: string;
    label?: string;
    /** Sample values so detail routes are clickable, e.g. { id: "1001" }. */
    sampleParams?: Record<string, string>;
  };
};

const borrower = (flow: string, label: string) => ({
  role: "borrower",
  flow,
  label,
});

export const routes: FlowRoute[] = [
  // The portal's front door.
  {
    path: "/",
    component: LoginScreen,
    meta: borrower("Auth", "Sign in (front door)"),
  },

  // ---------------------------------------------------------------- Auth
  {
    path: "auth",
    meta: { flow: "Auth" },
    children: [
      { path: "login", component: LoginScreen, meta: borrower("Auth", "Sign in") },
      {
        path: "account-locked",
        component: AccountLockedScreen,
        meta: borrower("Auth", "Account locked"),
      },
      {
        path: "forgot-password",
        component: ForgotPasswordScreen,
        meta: borrower("Auth", "Forgot password"),
      },
      {
        path: "reset-password",
        component: ResetPasswordScreen,
        meta: borrower("Auth", "Reset password"),
      },
      {
        path: "set-password",
        component: SetPasswordScreen,
        meta: { role: "co-borrower", flow: "Auth", label: "Set password (invite)" },
      },
      {
        path: "register",
        component: RegisterDetailsScreen,
        meta: borrower("Auth", "Register 1 — Your details"),
        children: [
          {
            path: "identity",
            component: RegisterIdentityScreen,
            meta: borrower("Auth", "Register 2 — Address & SSN"),
          },
          {
            path: "security",
            component: RegisterSecurityScreen,
            meta: borrower("Auth", "Register 3 — Password"),
          },
          {
            path: "terms",
            component: RegisterTermsScreen,
            meta: borrower("Auth", "Register 4 — Terms"),
          },
          {
            path: "verify-email",
            component: VerifyEmailScreen,
            meta: borrower("Auth", "Register 5 — Confirm email"),
          },
          {
            path: "verify-phone",
            component: VerifyPhoneScreen,
            meta: borrower("Auth", "Register 6 — Confirm phone"),
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------- Application
  {
    path: "application",
    component: ApplicationStartScreen,
    meta: borrower("Application", "Start / resume"),
    children: [
      {
        path: "consents",
        component: ConsentsScreen,
        meta: borrower("Application", "Step 1 — Permissions"),
      },
      {
        path: "income",
        component: IncomeScreen,
        meta: borrower("Application", "Step 2 — Your income"),
      },
      {
        path: "details",
        component: LoanDetailsScreen,
        meta: borrower("Application", "Step 3 — What you need"),
      },
      {
        path: "co-borrower",
        component: CoBorrowerScreen,
        meta: borrower("Application", "Step 4 — Co-borrower"),
      },
      {
        path: "card",
        component: CardScreen,
        meta: borrower("Application", "Step 5 — Payment card"),
      },
      {
        path: "review",
        component: ReviewScreen,
        meta: borrower("Application", "Step 6 — Check and send"),
      },
      {
        path: "submitted",
        component: SubmittedScreen,
        meta: borrower("Application", "Sent — confirmation"),
      },
      {
        path: "status",
        component: StatusScreen,
        meta: borrower("Application", "Status"),
      },
      {
        path: "documents",
        component: ApplicationDocumentsScreen,
        meta: borrower("Application", "Application documents"),
      },
      {
        path: "additional-info",
        component: AdditionalInfoScreen,
        meta: borrower("Application", "Send more information"),
      },
      {
        path: "withdraw",
        component: WithdrawScreen,
        meta: borrower("Application", "Withdraw"),
      },
      {
        path: "unable-to-proceed",
        component: UnableToProceedScreen,
        meta: borrower("Application", "Unable to proceed — call us"),
      },
      {
        path: "technical-error",
        component: TechnicalErrorScreen,
        meta: borrower("Application", "Technical error"),
      },
    ],
  },

  // -------------------------------------------------------- Co-borrower
  {
    path: "invitation",
    meta: { flow: "Co-borrower" },
    children: [
      {
        path: ":token",
        component: InvitationScreen,
        meta: {
          role: "co-borrower",
          flow: "Co-borrower",
          label: "Invitation",
          sampleParams: { token: "inv-8213" },
        },
      },
    ],
  },
  {
    path: "co-application",
    component: CoApplicationScreen,
    meta: { role: "co-borrower", flow: "Co-borrower", label: "What is needed from you" },
  },

  // --------------------------------------------------------------- Loan
  {
    path: "loan",
    component: LoanScreen,
    meta: borrower("Loan", "My loan"),
    children: [
      {
        path: "sign",
        component: SignAgreementScreen,
        meta: borrower("Loan", "Sign the agreement"),
      },
      {
        path: "card",
        component: VirtualCardScreen,
        meta: borrower("Loan", "Virtual payment card"),
      },
      {
        path: "documents",
        component: LoanDocumentsScreen,
        meta: borrower("Loan", "My documents"),
      },
      {
        path: "cancel",
        component: CancelLoanScreen,
        meta: borrower("Loan", "Cancel the loan"),
      },
    ],
  },

  // ----------------------------------------------------------- Payments
  {
    path: "payments",
    component: PaymentsOverviewScreen,
    meta: borrower("Payments", "Overview"),
    children: [
      {
        path: "schedule",
        component: ScheduleScreen,
        meta: borrower("Payments", "Repayment schedule"),
      },
      {
        path: "history",
        component: HistoryScreen,
        meta: borrower("Payments", "Payment history"),
      },
      {
        path: "make",
        component: MakePaymentScreen,
        meta: borrower("Payments", "Make a payment"),
      },
      {
        path: "extra",
        component: ExtraPaymentScreen,
        meta: borrower("Payments", "Pay a different amount"),
      },
      {
        path: "fees",
        component: FeesScreen,
        meta: borrower("Payments", "Late fees"),
      },
      {
        path: "methods",
        component: PaymentMethodsScreen,
        meta: borrower("Payments", "My card"),
        children: [
          {
            path: "update",
            component: UpdateMethodScreen,
            meta: borrower("Payments", "Change my card"),
          },
        ],
      },
      {
        path: "result",
        meta: { flow: "Payments" },
        children: [
          {
            path: ":id",
            component: PaymentResultScreen,
            meta: {
              role: "borrower",
              flow: "Payments",
              label: "Payment result",
              sampleParams: { id: "p3" },
            },
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ Profile
  {
    path: "profile",
    component: ProfileScreen,
    meta: borrower("Profile", "My profile"),
    children: [
      {
        path: "edit",
        component: EditProfileScreen,
        meta: borrower("Profile", "Change contact details"),
      },
      {
        path: "change-password",
        component: ChangePasswordScreen,
        meta: borrower("Profile", "Change password"),
      },
      {
        path: "notifications",
        component: NotificationPreferencesScreen,
        meta: borrower("Profile", "How we contact you"),
      },
    ],
  },

  // ------------------------------------------------------------ Support
  {
    path: "support",
    component: SupportScreen,
    meta: borrower("Auth", "Contact us"),
  },
];
