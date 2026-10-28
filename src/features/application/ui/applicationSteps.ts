// src/features/application/ui/applicationSteps.ts
//
// The loan application wizard's spine, same pattern as the registration one:
// every step is its own route so it can be returned to and resumed. The WBS
// requires both ("move back and force through the application process", and
// resuming after a technical failure).

export const APPLICATION_STEPS = [
  { key: "consents", label: "Permissions", path: "/application/consents" },
  { key: "income", label: "Your income", path: "/application/income" },
  { key: "details", label: "What you need", path: "/application/details" },
  { key: "co-borrower", label: "Co-borrower", path: "/application/co-borrower" },
  { key: "card", label: "Payment card", path: "/application/card" },
  { key: "review", label: "Check and send", path: "/application/review" },
] as const;

export type ApplicationStepKey = (typeof APPLICATION_STEPS)[number]["key"];

export const appStepIndex = (key: ApplicationStepKey) =>
  APPLICATION_STEPS.findIndex((s) => s.key === key);
