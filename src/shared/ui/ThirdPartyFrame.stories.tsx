import type { Meta, StoryObj } from "@storybook/react-vite";
import ThirdPartyFrame from "./ThirdPartyFrame";

const meta: Meta<typeof ThirdPartyFrame> = {
  title: "Shared/ThirdPartyFrame",
  component: ThirdPartyFrame,
  args: {
    provider: "Repay",
    title: "Add your debit card",
    description:
      "We need a US debit card you own, so we can take your monthly payment. The form below is handled by our payment partner — OPA only receives a secure token, never your card number.",
    state: "idle",
  },
};
export default meta;

type Story = StoryObj<typeof ThirdPartyFrame>;

export const CardIdle: Story = {};
export const CardLoading: Story = { args: { state: "loading" } };
export const CardActive: Story = { args: { state: "active" } };
export const CardSaved: Story = { args: { state: "done" } };

/** A failure here must never be a dead end — progress is saved, retry offered. */
export const CardError: Story = { args: { state: "error" } };

export const SigningIdle: Story = {
  args: {
    provider: "DocuSign",
    title: "Sign your credit authorization",
    description:
      "To review your application we need your permission to check your credit. You will sign on DocuSign and come straight back here. Signing takes about two minutes.",
    startLabel: "Continue to DocuSign",
  },
};

export const SigningDone: Story = {
  args: { provider: "DocuSign", title: "Sign your credit authorization", state: "done" },
};
