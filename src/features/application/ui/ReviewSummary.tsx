// src/features/application/ui/ReviewSummary.tsx
//
// "Check and send": everything the applicant entered, grouped, each group with
// a way back to the step that owns it.
//
// The "Change" link per section is the point. A review screen with no way to
// fix what it shows is a formality; this one is the last place someone can
// catch a wrong SSN digit before a hard credit inquiry runs on it.
//
// Reused on the application status screen, where the same summary is shown
// without the Change links (nothing is editable once it is with underwriting).

import { Descriptions, Divider, Flex, Typography } from "antd";
import { getStyles } from "./ReviewSummary.styles";

export type ReviewItem = { label: string; value: React.ReactNode };

export type ReviewSection = {
  key: string;
  title: string;
  items: ReviewItem[];
  /** Omit to render the section read-only. */
  onChange?: () => void;
};

export type ReviewSummaryProps = {
  sections: ReviewSection[];
  changeLabel?: string;
};

export default function ReviewSummary({
  sections,
  changeLabel = "Change",
}: ReviewSummaryProps) {
  const styles = getStyles();

  return (
    <Flex vertical>
      {sections.map((section, i) => (
        <div key={section.key}>
          {i > 0 && <Divider />}
          <Flex align="center" justify="space-between" gap={12}>
            <Typography.Title level={5} style={styles.sectionTitle}>
              {section.title}
            </Typography.Title>
            {section.onChange && (
              <Typography.Link onClick={section.onChange}>
                {changeLabel}
                <span style={styles.srOnly}> {section.title}</span>
              </Typography.Link>
            )}
          </Flex>
          <Descriptions column={1} colon={false} size="small">
            {section.items.map((item) => (
              <Descriptions.Item key={item.label} label={item.label}>
                {item.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      ))}
    </Flex>
  );
}
