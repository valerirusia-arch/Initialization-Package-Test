// src/stories/showcase/ShowcaseDataDisplay.tsx
//
// antd "Data Display": Avatar, Badge, Calendar, Card, Carousel, Collapse,
// Descriptions, Empty, Image, Listy, Popover, Progress, QRCode, Statistic,
// Table, Tag, Timeline, Tooltip, Tree.
// (List is deprecated since antd 6.6 — Listy replaces it; see the coverage
// script's ALLOWED_GAPS.)

import {
  Avatar, Badge, Button, Calendar, Card, Carousel, Collapse, Descriptions, Empty, Image, Listy,
  Popover, Progress, QRCode, Statistic, Table, Tag, Timeline, Tooltip, Tree, Typography, theme,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Demo, Section } from "./ShowcaseKit";
import { getStyles, w160, w200, w240, w260, w320 } from "./ShowcaseKit.styles";
import { countdownTarget, listyItems, listyManyItems, tableRows, treeData } from "./showcaseData";

const { Link } = Typography;

export function ShowcaseDataDisplay() {
  const { token } = theme.useToken();
  const styles = getStyles(token);
  // Built from the live token so the placeholder actually changes with the theme.
  const imageSrc = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="${token.colorPrimary}"/></svg>`
  )}`;

  return (
    <>
      <Section title="Avatar, Badge, Tag">
        <Avatar icon={<UserOutlined />} />
        <Avatar shape="square" style={{ backgroundColor: token.colorPrimary }}>DK</Avatar>
        <Avatar.Group max={{ count: 3 }}>
          <Avatar>A</Avatar><Avatar>B</Avatar><Avatar>C</Avatar><Avatar>D</Avatar>
        </Avatar.Group>
        <Badge count={5}><Avatar shape="square" icon={<UserOutlined />} /></Badge>
        <Badge dot><Avatar shape="square" icon={<UserOutlined />} /></Badge>
        <Badge status="success" text="Success" />
        <Badge status="error" text="Error" />
        <Badge.Ribbon text="Ribbon"><Card size="small" style={w160}>Card with ribbon</Card></Badge.Ribbon>
        <Tag color="processing">processing</Tag>
        <Tag color="success">success</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="error">error</Tag>
        <Tag color="default">default</Tag>
        <Tag variant="outlined">outlined</Tag>
        <Tag closable>closable</Tag>
        <Tag.CheckableTag checked>checkable</Tag.CheckableTag>
      </Section>

      <Section title="Statistic, Progress">
        <Statistic title="Active loans" value={1128} />
        <Statistic title="Balance" value={93.12} precision={2} prefix="$" />
        <Statistic.Timer type="countdown" title="Countdown" value={countdownTarget} />
        <div style={w200}><Progress percent={60} /></div>
        <div style={w200}><Progress percent={100} /></div>
        <div style={w200}><Progress percent={40} status="exception" /></div>
        <div style={w200}><Progress percent={50} status="active" /></div>
        <div style={w200}><Progress percent={60} steps={5} /></div>
        <Progress type="circle" percent={72} size={64} />
        <Progress type="circle" percent={100} size={64} />
        <Progress type="dashboard" percent={60} size={64} />
      </Section>

      <Section title="Card, Descriptions">
        <Card title="Card" extra={<Link href="#top">More</Link>} style={w260}>Card body content.</Card>
        <Card size="small" hoverable style={w200}>
          <Card.Meta avatar={<Avatar icon={<UserOutlined />} />} title="Card.Meta" description="Hoverable, small" />
        </Card>
        <Card loading style={w200} />
        <Descriptions
          title="Descriptions"
          size="small"
          column={1}
          bordered
          style={w260}
          items={[
            { key: "1", label: "Name", children: "OPA LMS" },
            { key: "2", label: "Status", children: <Tag color="success">live</Tag> },
          ]}
        />
      </Section>

      <Section title="Table — sort, selection, expandable, empty, small">
        <Table
          size="small"
          style={w320}
          pagination={false}
          rowSelection={{ type: "checkbox" }}
          columns={[
            { title: "Name", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
            { title: "Status", dataIndex: "status", render: (s: string) => <Tag color={s === "active" ? "success" : "default"}>{s}</Tag> },
            { title: "Amount", dataIndex: "amount", align: "right", sorter: (a, b) => a.amount - b.amount },
          ]}
          dataSource={tableRows}
        />
        <Table
          size="small"
          style={w320}
          pagination={{ pageSize: 2, size: "small" }}
          expandable={{ expandedRowRender: (r) => `Details for ${r.name}` }}
          columns={[
            { title: "Name", dataIndex: "name" },
            { title: "Amount", dataIndex: "amount", align: "right" },
          ]}
          dataSource={tableRows}
        />
        <Table size="small" style={w260} pagination={false} columns={[{ title: "Empty", dataIndex: "x" }]} dataSource={[]} />
        <Table size="small" style={w260} pagination={false} loading columns={[{ title: "Loading", dataIndex: "x" }]} dataSource={[]} />
      </Section>

      <Section title="Listy (replaces List in antd 6.6+)">
        <Demo label="All rows (virtual off) — every item visible">
          <div style={w240}>
            <Listy
              items={listyItems}
              rowKey="id"
              virtual={false}
              itemRender={(item) => <div style={styles.tint}>{item.label}</div>}
            />
          </div>
        </Demo>
        <Demo label="Virtual, 50 rows in 160px — scrolls on purpose">
          {/* data-showcase-scroll: scrolling IS the demo, so the smoke test skips it. */}
          <div style={w240} data-showcase-scroll="">
            <Listy
              items={listyManyItems}
              rowKey="id"
              height={160}
              itemRender={(item) => <div style={styles.tint}>{item.label}</div>}
            />
          </div>
        </Demo>
      </Section>

      <Section title="Collapse, Timeline, Tree, Calendar">
        <div style={w260}>
          <Collapse items={[{ key: "1", label: "Panel one", children: "Content one" }, { key: "2", label: "Panel two", children: "Content two" }]} />
        </div>
        <Timeline
          items={[
            { content: "Created" },
            { content: "In review", color: "green" },
            { content: "Blocked", color: "red" },
          ]}
        />
        <Tree defaultExpandAll treeData={treeData} style={w200} />
        <Tree checkable defaultExpandAll defaultCheckedKeys={["0-0"]} treeData={treeData} style={w200} />
        <div style={w320}><Calendar fullscreen={false} /></div>
      </Section>

      <Section title="Carousel, Image, QRCode, Empty">
        <div style={w260}>
          <Carousel autoplay>
            {["Slide 1", "Slide 2", "Slide 3"].map((s) => (
              <div key={s}><div style={styles.carouselSlide}>{s}</div></div>
            ))}
          </Carousel>
        </div>
        <Image width={120} src={imageSrc} />
        <QRCode value="https://example.com" size={96} />
        <QRCode value="https://example.com" size={96} status="expired" onRefresh={() => {}} />
        <Empty />
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Simple empty" />
      </Section>

      <Section title="Tooltip, Popover (hover / click to check)">
        <Tooltip title="Tooltip text"><Button>Hover: Tooltip</Button></Tooltip>
        <Tooltip title="Top left" placement="topLeft"><Button>Placement</Button></Tooltip>
        <Popover content="Popover content" title="Popover"><Button>Hover: Popover</Button></Popover>
        <Popover content="Click popover" title="Popover" trigger="click"><Button>Click: Popover</Button></Popover>
      </Section>

      <Section title="Tooltip, Popover — rendered open (no hover needed)">
        <Demo label="Tooltip">
          <Tooltip._InternalPanelDoNotUseOrYouWillBeFired title="Tooltip text" />
        </Demo>
        <Demo label="Tooltip, coloured">
          <Tooltip._InternalPanelDoNotUseOrYouWillBeFired title="Primary tooltip" color={token.colorPrimary} />
        </Demo>
        <Demo label="Popover">
          <Popover._InternalPanelDoNotUseOrYouWillBeFired title="Popover" content="Popover content" />
        </Demo>
      </Section>

    </>
  );
}
