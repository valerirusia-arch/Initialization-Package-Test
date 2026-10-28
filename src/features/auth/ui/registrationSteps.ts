// src/features/auth/ui/registrationSteps.ts
//
// The registration wizard's spine. One list, used by the step rail, by the
// mobile "Step n of 6" label, and by every screen that needs to say where it is.
//
// Each step is its own ROUTE (PROJECT.md §4.1), not local state: the WBS
// requires borrowers to move back and forth and to resume after a technical
// failure, and a route is the only step you can actually return to.
//
// Lowercase filename on purpose — a list, not a component.

export const REGISTRATION_STEPS = [
  { key: "details", label: "Your details", path: "/auth/register" },
  { key: "identity", label: "Address & SSN", path: "/auth/register/identity" },
  { key: "security", label: "Password", path: "/auth/register/security" },
  { key: "terms", label: "Terms", path: "/auth/register/terms" },
  { key: "verify-email", label: "Confirm email", path: "/auth/register/verify-email" },
  { key: "verify-phone", label: "Confirm phone", path: "/auth/register/verify-phone" },
] as const;

export type RegistrationStepKey = (typeof REGISTRATION_STEPS)[number]["key"];

export const stepIndex = (key: RegistrationStepKey) =>
  REGISTRATION_STEPS.findIndex((s) => s.key === key);
