import type { Meta, StoryObj } from "@storybook/react-vite";
import PasswordRules from "./PasswordRules";

const meta: Meta<typeof PasswordRules> = {
  title: "Auth/PasswordRules",
  component: PasswordRules,
};
export default meta;

type Story = StoryObj<typeof PasswordRules>;

/** What someone sees before typing: the whole list, nothing failed yet. */
export const Empty: Story = { args: { value: "" } };

export const PartlyMet: Story = { args: { value: "paseocitizen" } };

export const AlmostThere: Story = { args: { value: "PaseoCitizen1" } };

export const AllMet: Story = { args: { value: "PaseoCitizen1!" } };
