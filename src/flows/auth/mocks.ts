// src/flows/auth/mocks.ts
//
// Mock data for the Auth flow screens. Designer-owned, inline-equivalent — it
// lives in one file only because six screens share it (PROJECT.md §7).
//
// None of this is a source of truth. The real lists come from the back end:
// OPA is licensed in a specific set of states (NMLS #2269750), and some
// countries of origination are excluded. The shapes are what matter here.

/** A short stand-in for the licensed-states list. Real list is BE-owned. */
export const SUPPORTED_STATES = [
  { value: "CT", label: "Connecticut" },
  { value: "MA", label: "Massachusetts" },
  { value: "NH", label: "New Hampshire" },
  { value: "NY", label: "New York" },
  { value: "RI", label: "Rhode Island" },
  { value: "VT", label: "Vermont" },
];

/**
 * Countries of origination. The real list excludes some countries — the
 * exclusion is applied by the back end, so the UI simply renders what it gets.
 */
export const COUNTRIES = [
  { value: "BR", label: "Brazil" },
  { value: "CV", label: "Cabo Verde" },
  { value: "CO", label: "Colombia" },
  { value: "DO", label: "Dominican Republic" },
  { value: "SV", label: "El Salvador" },
  { value: "GT", label: "Guatemala" },
  { value: "HT", label: "Haiti" },
  { value: "HN", label: "Honduras" },
  { value: "MX", label: "Mexico" },
  { value: "VN", label: "Viet Nam" },
];

/** Already masked — the screens never hold a real address or number. */
export const MOCK_APPLICANT = {
  firstName: "María",
  lastName: "González",
  maskedEmail: "m•••a@example.com",
  maskedPhone: "(•••) •••-4821",
};

/** Communication preferences. SMS and email are both offered (WBS). */
export const CONTACT_CHANNELS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message (SMS)" },
];
