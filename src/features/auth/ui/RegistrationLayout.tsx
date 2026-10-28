// src/features/auth/ui/RegistrationLayout.tsx
//
// The registration wizard's chrome. The layout itself is shared with the loan
// application wizard (src/shared/ui/WizardLayout.tsx) — this file only binds it
// to REGISTRATION_STEPS, so the two wizards can never drift apart visually.

import type { WizardLayoutProps } from "../../../shared/ui/WizardLayout";
import WizardLayout from "../../../shared/ui/WizardLayout";
import { REGISTRATION_STEPS } from "./registrationSteps";

export type RegistrationLayoutProps = Omit<WizardLayoutProps, "steps">;

export default function RegistrationLayout(props: RegistrationLayoutProps) {
  return <WizardLayout {...props} steps={REGISTRATION_STEPS} />;
}
