// src/flows/portalMocks.ts
//
// Mock data shared by the customer portal flows. Designer-owned.
//
// The numbers are real-shaped: OPA lends at 1% APR for USCIS fees, repayment
// starts within 45 days of approval and falls on the 1st of each month, over
// twelve months. $760 over 12 months at 1% is $63.65 a month — which also
// makes the late fee $3.18 (5% of the instalment, since that is less than the
// $5.00 cap). Mock data that does not add up teaches a designer the wrong
// thing about the screen.

/** USCIS services OPA lends for. Predefined by the back end, not configurable. */
export const USCIS_OPTIONS = [
  {
    value: "n400",
    title: "N-400 — Application for Naturalization",
    description: "The main application to become a US citizen.",
    amount: 760,
  },
  {
    value: "n400-reduced",
    title: "N-400 with a reduced fee",
    description: "If your household income qualifies you for the reduced USCIS fee.",
    amount: 380,
  },
  {
    value: "n600",
    title: "N-600 — Certificate of Citizenship",
    description: "If you are already a citizen through a parent and need the certificate.",
    amount: 1170,
  },
];

export const LOAN = {
  amount: 760,
  unusedBalance: 760,
  apr: 1,
  termMonths: 12,
  monthlyPayment: 63.65,
  totalRepayable: 763.8,
  outstanding: 636.5,
  firstPaymentDue: "2027-01-01",
  nextPaymentDue: "2027-04-01",
  status: "Funded" as const,
};

export const LATE_FEE = {
  amount: 3.18,
  chargedOn: "2027-03-16",
  reason: "5% of the unpaid instalment, which is less than the $5.00 cap.",
};

/** Twelve instalments, first on the 1st of the month after funding. */
export const SCHEDULE = Array.from({ length: 12 }, (_, i) => {
  const due = new Date(Date.UTC(2027, i, 1)).toISOString().slice(0, 10);
  const status =
    i < 2 ? ("Succeeded" as const) : i === 2 ? ("Overdue" as const) : ("Scheduled" as const);
  return { key: String(i + 1), number: i + 1, due, amount: LOAN.monthlyPayment, status };
});

export const PAYMENT_HISTORY = [
  { key: "p3", date: "2027-03-02", amount: 63.65, status: "Failed" as const, method: "Visa •4242" },
  { key: "p2", date: "2027-02-01", amount: 63.65, status: "Succeeded" as const, method: "Visa •4242" },
  { key: "p1", date: "2027-01-01", amount: 63.65, status: "Succeeded" as const, method: "Visa •4242" },
];

export const SAVED_CARD = {
  brand: "Visa",
  number: "4111 1111 1111 4242",
  expiry: "08/2029",
  active: true,
  addedBy: "you" as const,
};

export const VIRTUAL_CARD = {
  brand: "Mastercard",
  number: "5200 8282 8282 8210",
  expiry: "11/2028",
  cvv: "•••",
  balance: 760,
};

export const APPLICATION = {
  id: "10042",
  status: "Under review" as const,
  submittedOn: "2026-10-14",
  service: "N-400 — Application for Naturalization",
  amount: 760,
  coBorrower: {
    name: "Alvaro García",
    email: "alvaro@example.com",
    invitationStatus: "Pending" as const,
    invitedOn: "2026-10-14",
    expiresOn: "2026-10-19",
  },
};

export const DOCUMENTS = [
  { key: "d1", name: "Credit authorization", signedOn: "2026-10-14", size: "180 KB" },
  { key: "d2", name: "Electronic disclosures", signedOn: "2026-10-14", size: "96 KB" },
  { key: "d3", name: "Loan agreement", signedOn: "2026-10-22", size: "240 KB" },
  { key: "d4", name: "Truth in Lending disclosure", signedOn: "2026-10-22", size: "88 KB" },
];

/** Income documents the applicant uploaded. */
export const INCOME_DOCUMENT_TYPES = [
  { value: "paystub", label: "Pay stub" },
  { value: "tax-return", label: "Tax return" },
  { value: "benefits", label: "Benefits letter" },
  { value: "employer-letter", label: "Letter from your employer" },
  { value: "bank", label: "Bank statement" },
];
