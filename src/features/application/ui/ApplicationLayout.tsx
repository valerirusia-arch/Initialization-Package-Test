// src/features/application/ui/ApplicationLayout.tsx
//
// The loan application wizard's chrome. Same shared WizardLayout as
// registration, bound to APPLICATION_STEPS — one layout, two step lists.

import type { WizardLayoutProps } from "../../../shared/ui/WizardLayout";
import WizardLayout from "../../../shared/ui/WizardLayout";
import { APPLICATION_STEPS } from "./applicationSteps";

export type ApplicationLayoutProps = Omit<WizardLayoutProps, "steps">;

export default function ApplicationLayout(props: ApplicationLayoutProps) {
  return <WizardLayout {...props} steps={APPLICATION_STEPS} />;
}
