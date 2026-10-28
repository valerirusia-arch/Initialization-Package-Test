// src/shared/ui/DisplayTitle.tsx
//
// The brand's display face (Playfair Display, standing in for Noe Display),
// and the ONLY place it is allowed to appear.
//
// DESIGN.md §3 restricts it to large customer-facing headings on milestone
// screens — welcome, submitted, approved, funded. This component is how that
// restriction is enforced instead of being a convention nobody reads: there is
// no size below 28px to choose, and the back-office shell never imports it.

import { Typography } from "antd";
import { getStyles } from "./DisplayTitle.styles";

export type DisplayTitleProps = {
  children: React.ReactNode;
  /** 1 = the one headline on a milestone screen. 2 = a section within it. */
  level?: 1 | 2;
  align?: "start" | "center";
};

export default function DisplayTitle({
  children,
  level = 1,
  align = "start",
}: DisplayTitleProps) {
  const styles = getStyles(level, align);
  return (
    <Typography.Title level={level} style={styles.title}>
      {children}
    </Typography.Title>
  );
}
