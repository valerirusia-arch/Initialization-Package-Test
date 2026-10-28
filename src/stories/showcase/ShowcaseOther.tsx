// src/stories/showcase/ShowcaseOther.tsx
//
// antd "Other" + the glue components: ConfigProvider, Watermark, BorderBeam.

import { Button, ConfigProvider, Flex, Input, Watermark, BorderBeam, Card, theme } from "antd";
import { Demo, Section } from "./ShowcaseKit";
import { getStyles, w200, w260 } from "./ShowcaseKit.styles";

export function ShowcaseOther() {
  const { token } = theme.useToken();
  const styles = getStyles(token);

  return (
    <>
      <Section title="Watermark">
        <Watermark content="Watermark">
          <div style={{ ...styles.outlined, height: 120, width: 260 }} />
        </Watermark>
      </Section>

      <Section title="ConfigProvider — nested provider (componentSize)">
        <Demo label="componentSize=&quot;small&quot; inherited by everything inside">
          <ConfigProvider componentSize="small">
            <Flex gap={8}>
              <Input placeholder="Small input" style={w200} />
              <Button type="primary">Small</Button>
            </Flex>
          </ConfigProvider>
        </Demo>
        <Demo label="componentDisabled">
          <ConfigProvider componentDisabled>
            <Flex gap={8}>
              <Input placeholder="Disabled by provider" style={w200} />
              <Button>Disabled</Button>
            </Flex>
          </ConfigProvider>
        </Demo>
      </Section>

      <Section title="BorderBeam (antd 6.6+)">
        <BorderBeam>
          <Card size="small" style={w260}>Card wrapped in an animated border beam.</Card>
        </BorderBeam>
      </Section>
    </>
  );
}
