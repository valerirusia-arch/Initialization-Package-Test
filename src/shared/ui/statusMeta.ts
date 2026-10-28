// src/shared/ui/statusMeta.ts
//
// THE status vocabulary. One mapping, one place — so "Approved" is never two
// different greens in two different screens (DESIGN.md §6).
//
// The labels are exactly the ones in PROJECT.md §5. The values are antd Tag
// presets, not colours: a preset resolves to colorSuccess / colorWarning /
// colorError / colorPrimary from the theme, which is why this file needs no hex
// and still tracks a token change.
//
// Lowercase filename on purpose: it is a map, not a component, so
// check-stories.mjs correctly skips it.

export const STATUS = {
  application: {
    Draft: "default",
    "In progress": "processing",
    Submitted: "processing",
    "Under review": "processing",
    "Pending action": "warning",
    Approved: "success",
    Declined: "error",
    Withdrawn: "default",
  },
  invitation: {
    Pending: "processing",
    Accepted: "success",
    Expired: "warning",
    Replaced: "default",
  },
  payment: {
    Scheduled: "default",
    Pending: "processing",
    Succeeded: "success",
    Failed: "error",
    Refunded: "default",
    Reversed: "warning",
    Overdue: "error",
  },
  loan: {
    Approved: "success",
    Funded: "success",
    Active: "processing",
    Cancelled: "default",
    "Paid off": "success",
    "Past due": "warning",
    Default: "error",
    Accelerated: "error",
  },
  /** Internal users only — a borrower never sees why a check failed. */
  verification: {
    Passed: "success",
    Failed: "error",
    Pending: "processing",
    "Manual review": "warning",
  },
} as const;

export type StatusKind = keyof typeof STATUS;
export type StatusOf<K extends StatusKind> = keyof (typeof STATUS)[K];
