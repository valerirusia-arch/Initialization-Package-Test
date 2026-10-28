// src/stories/showcase/ShowcaseLayout.tsx
//
// antd "Layout": Layout (Header/Sider/Content/Footer), Grid (Row/Col + the
// breakpoint hook), Flex, Space, Divider, Splitter, Masonry, Affix.

import { useRef, useState } from "react";
import {
  Affix, Button, Col, Divider, Flex, Grid, Layout, Masonry, Row, Space, Splitter, Tag, Typography, theme,
} from "antd";
import { Demo, Section } from "./ShowcaseKit";
import {
  getStyles, layoutBox, masonryBox, scrollBox, scrollFiller, splitterBox,
} from "./ShowcaseKit.styles";
import { masonryItems } from "./showcaseData";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

export function ShowcaseLayout() {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  const screens = Grid.useBreakpoint();
  const activeBreakpoints = Object.entries(screens).filter(([, on]) => on).map(([bp]) => bp);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [affixed, setAffixed] = useState<boolean | undefined>(false);

  return (
    <>
      <Section block title="Layout — Header, Sider, Content, Footer">
        <Layout style={{ ...layoutBox, ...styles.outlined }}>
          <Header style={styles.bar}>Header</Header>
          <Layout>
            <Sider width={140} style={styles.panelAlt}>Sider</Sider>
            <Content style={styles.tint}>Content</Content>
          </Layout>
          <Footer>Footer</Footer>
        </Layout>
      </Section>

      <Section block title="Grid — Row / Col (24 columns), gutter, responsive">
        <div>
          <Row gutter={[16, 16]}>
            <Col span={24}><div style={styles.colBlock}>span 24</div></Col>
            <Col span={12}><div style={styles.colBlockAlt}>span 12</div></Col>
            <Col span={12}><div style={styles.colBlock}>span 12</div></Col>
            <Col span={8}><div style={styles.colBlockAlt}>span 8</div></Col>
            <Col span={8}><div style={styles.colBlock}>span 8</div></Col>
            <Col span={8}><div style={styles.colBlockAlt}>span 8</div></Col>
            <Col xs={24} md={12} lg={6}><div style={styles.colBlock}>responsive</div></Col>
            <Col xs={24} md={12} lg={6}><div style={styles.colBlockAlt}>responsive</div></Col>
            <Col xs={24} md={12} lg={6}><div style={styles.colBlock}>responsive</div></Col>
            <Col xs={24} md={12} lg={6}><div style={styles.colBlockAlt}>responsive</div></Col>
          </Row>
        </div>
        <Demo label="Grid.useBreakpoint() — active breakpoints in this preview">
          <Space wrap>
            {activeBreakpoints.map((bp) => <Tag key={bp} color="processing">{bp}</Tag>)}
          </Space>
        </Demo>
      </Section>

      <Section title="Flex & Space">
        <Demo label="Flex gap 8 / vertical gap 4">
          <Flex gap={8}>
            <Tag>a</Tag><Tag>b</Tag><Tag>c</Tag>
          </Flex>
        </Demo>
        <Demo label="Space size small / middle / large">
          <Space size="small"><Tag>1</Tag><Tag>2</Tag></Space>
          <Space size="middle"><Tag>1</Tag><Tag>2</Tag></Space>
          <Space size="large"><Tag>1</Tag><Tag>2</Tag></Space>
        </Demo>
        <Demo label="Space with separator">
          <Space separator={<Divider orientation="vertical" />}>
            <Text>one</Text><Text>two</Text><Text>three</Text>
          </Space>
        </Demo>
      </Section>

      <Section block title="Divider">
        <div>
          <Divider>Plain</Divider>
          <Divider titlePlacement="start">Start</Divider>
          <Divider titlePlacement="end">End</Divider>
          <Divider dashed>Dashed</Divider>
          <Space>
            <Text>vertical</Text><Divider orientation="vertical" /><Text>divider</Text>
          </Space>
        </div>
      </Section>

      <Section block title="Splitter — drag the handle">
        <Splitter style={{ ...splitterBox, ...styles.outlined }}>
          <Splitter.Panel defaultSize="40%" min="20%" max="70%"><div style={styles.panel}>Panel 1</div></Splitter.Panel>
          <Splitter.Panel><div style={styles.panelAlt}>Panel 2</div></Splitter.Panel>
        </Splitter>
      </Section>

      <Section block title="Masonry">
        <div style={masonryBox}>
          <Masonry
            columns={3}
            gutter={12}
            items={masonryItems.map((i) => ({ key: i.key, data: i.height }))}
            itemRender={({ data }) => <div style={{ ...styles.panel, height: data }}>{data}px</div>}
          />
        </div>
      </Section>

      <Section title="Affix — pins to the top while its container scrolls (scroll the box)">
        {/* data-showcase-scroll: this box scrolls on purpose (that's the Affix demo),
            so the smoke test doesn't report it as clipped content. */}
        <div ref={scrollRef} style={{ ...scrollBox, ...styles.outlined, width: 360 }} data-showcase-scroll="">
          <div style={scrollFiller}>
            <Affix target={() => scrollRef.current} offsetTop={8} onChange={setAffixed}>
              <Button type="primary">{affixed ? "Pinned" : "Scroll me"}</Button>
            </Affix>
          </div>
        </div>
      </Section>
    </>
  );
}
