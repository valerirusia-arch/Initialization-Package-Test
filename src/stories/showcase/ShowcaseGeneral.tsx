// src/stories/showcase/ShowcaseGeneral.tsx
//
// antd "General": Button, Typography, FloatButton (+ icons).

import { Button, Flex, FloatButton, Space, Typography } from "antd";
import {
  CommentOutlined, CustomerServiceOutlined, DownloadOutlined, SearchOutlined, StarOutlined,
} from "@ant-design/icons";
import { Demo, Section } from "./ShowcaseKit";
import { w480 } from "./ShowcaseKit.styles";

const { Title, Text, Link, Paragraph } = Typography;

export function ShowcaseGeneral() {
  return (
    <>
      <Section title="Button — types">
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="text">Text</Button>
        <Button type="link">Link</Button>
      </Section>

      <Section title="Button — variants & colours (v5.21+/v6 API)">
        <Button color="primary" variant="solid">Solid</Button>
        <Button color="primary" variant="outlined">Outlined</Button>
        <Button color="primary" variant="dashed">Dashed</Button>
        <Button color="primary" variant="filled">Filled</Button>
        <Button color="primary" variant="text">Text</Button>
        <Button color="primary" variant="link">Link</Button>
        <Button color="danger" variant="solid">Danger solid</Button>
        <Button color="danger" variant="outlined">Danger outlined</Button>
      </Section>

      <Section title="Button — states, sizes, shapes, icons">
        <Button type="primary" danger>Danger</Button>
        <Button type="primary" loading>Loading</Button>
        <Button type="primary" disabled>Disabled</Button>
        <Button type="primary" size="large">Large</Button>
        <Button type="primary" size="small">Small</Button>
        <Button type="primary" shape="round">Round</Button>
        <Button type="primary" shape="circle" icon={<SearchOutlined />} aria-label="Search" />
        <Button icon={<DownloadOutlined />}>With icon</Button>
        <Button type="primary" ghost>Ghost</Button>
        <Space.Compact>
          <Button>Left</Button>
          <Button>Middle</Button>
          <Button>Right</Button>
        </Space.Compact>
      </Section>

      <Section title="Typography — Title, Text, Link, Paragraph">
        <Flex vertical style={w480}>
          <Title level={1}>h1. Title</Title>
          <Title level={2}>h2. Title</Title>
          <Title level={3}>h3. Title</Title>
          <Title level={4}>h4. Title</Title>
          <Title level={5}>h5. Title</Title>
          <Paragraph>
            Paragraph text. <Text strong>strong</Text>, <Text italic>italic</Text>,{" "}
            <Text underline>underline</Text>, <Text delete>delete</Text>, <Text mark>mark</Text>,{" "}
            <Text code>code</Text>, <Text keyboard>keyboard</Text>.
          </Paragraph>
          <Paragraph ellipsis={{ rows: 2, expandable: "collapsible" }}>
            Long paragraph that collapses after two rows. Change a token and check the colour of the
            expand link, the text and the surrounding spacing. Long paragraph that collapses after two
            rows. Long paragraph that collapses after two rows. Long paragraph that collapses after
            two rows.
          </Paragraph>
          <Paragraph copyable editable>Copyable and editable text</Paragraph>
        </Flex>
        <Demo label="Semantic text colours">
          <Space wrap>
            <Text>default</Text>
            <Text type="secondary">secondary</Text>
            <Text type="success">success</Text>
            <Text type="warning">warning</Text>
            <Text type="danger">danger</Text>
            <Text disabled>disabled</Text>
            <Link href="#top">link</Link>
          </Space>
        </Demo>
      </Section>

      <Section title="FloatButton — fixed to the bottom-right of the preview">
        <Text type="secondary">Live widgets, bottom-right corner: a group, a tooltip, a badge and back-to-top.</Text>
      </Section>
      <FloatButton.Group shape="circle">
        <FloatButton icon={<CustomerServiceOutlined />} tooltip="FloatButton" />
        <FloatButton icon={<CommentOutlined />} badge={{ count: 3 }} />
        <FloatButton icon={<StarOutlined />} type="primary" />
        <FloatButton.BackTop />
      </FloatButton.Group>
    </>
  );
}
