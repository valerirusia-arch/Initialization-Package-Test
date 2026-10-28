// src/features/auth/ui/checkPassword.ts
//
// The password requirements, as data. Its own file because
// react-refresh/only-export-components forbids exporting a plain function
// beside a component — the same reason ThemeContext.ts is split from
// ThemeProvider.tsx.
//
// This is NOT validation in the Dev sense: no Zod, no schema, nothing a form
// submits against. It is the copy a person reads while they type, and the
// screen uses it only to decide whether the Continue button is live.

export type PasswordRule = { label: string; passed: boolean };

export function checkPassword(value: string): PasswordRule[] {
  return [
    { label: "At least 12 characters", passed: value.length >= 12 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(value) },
    { label: "One lowercase letter", passed: /[a-z]/.test(value) },
    { label: "One number", passed: /\d/.test(value) },
    { label: "One symbol, like ! or #", passed: /[^A-Za-z0-9]/.test(value) },
  ];
}

export const passwordMeetsRules = (value: string) =>
  checkPassword(value).every((r) => r.passed);
