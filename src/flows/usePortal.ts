// src/flows/usePortal.ts
//
// The chrome every signed-in customer screen shares: the top-bar nav, the
// language switch and the support link. Thirty-odd screens would otherwise
// repeat the same eight lines, and the day the nav changes we would be editing
// thirty files.
//
// Design Mode only: local UI state (`useState`) and navigation
// (`useNavigate`). No fetching, no store — spread the result into
// <CustomerShell {...portal}>.
//
// NOTE ON THE NAV: in production it reflects the borrower's stage — you do not
// have "My loan" before you are approved. Here every entry is reachable so the
// whole site can be clicked through for review, which is the point of a
// navigable prototype.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export type PortalKey = "application" | "loan" | "payments" | "documents";

const NAV: { key: PortalKey; label: string; to: string }[] = [
  { key: "application", label: "My application", to: "/application/status" },
  { key: "loan", label: "My loan", to: "/loan" },
  { key: "payments", label: "Payments", to: "/payments" },
  { key: "documents", label: "Documents", to: "/loan/documents" },
];

/**
 * The chrome a wizard step needs: language, support, account — but NO top-bar
 * nav. A half-finished application is not somewhere to wander away from by
 * accident, so WizardLayout does not take nav at all.
 */
export function useWizardChrome() {
  const navigate = useNavigate();
  const [locale, setLocale] = useState<"en" | "es">("en");

  return {
    locale,
    onLocaleChange: setLocale,
    userName: "María G.",
    onAccount: (action: "profile" | "logout") =>
      navigate({ to: action === "profile" ? "/profile" : "/auth/login" }),
    onSupport: () => navigate({ to: "/support" }),
  };
}

/** The full portal chrome: everything above plus the top-bar navigation. */
export function usePortal(activeKey?: PortalKey) {
  const navigate = useNavigate();
  const chrome = useWizardChrome();

  return {
    ...chrome,
    nav: NAV.map(({ key, label }) => ({ key, label })),
    activeKey,
    onNavigate: (key: string) => {
      const entry = NAV.find((n) => n.key === key);
      if (entry) navigate({ to: entry.to });
    },
  };
}
