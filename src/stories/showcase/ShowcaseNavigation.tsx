// src/stories/showcase/ShowcaseNavigation.tsx
//
// antd "Navigation": Anchor, Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs.

import { Anchor, Breadcrumb, Button, Dropdown, Menu, Pagination, Steps, Tabs } from "antd";
import {
  AppstoreOutlined, DownOutlined, HomeOutlined, MailOutlined, SettingOutlined, UserOutlined,
} from "@ant-design/icons";
import { Demo, Section } from "./ShowcaseKit";
import { w200, w260, w320, w480 } from "./ShowcaseKit.styles";

const menuItems = [
  { key: "a", icon: <MailOutlined />, label: "Nav one" },
  { key: "b", icon: <AppstoreOutlined />, label: "Nav two" },
  { key: "c", icon: <SettingOutlined />, label: "Nav three", disabled: true },
];

const nestedMenu = [
  { key: "m1", icon: <MailOutlined />, label: "Group one" },
  {
    key: "m2",
    icon: <AppstoreOutlined />,
    label: "Group two",
    children: [
      { key: "m2a", label: "Item A" },
      { key: "m2b", label: "Item B" },
    ],
  },
  { key: "m3", icon: <SettingOutlined />, label: "Group three" },
];

const dropdownItems = [
  { key: "1", label: "Action one", icon: <UserOutlined /> },
  { key: "2", label: "Action two" },
  { type: "divider" as const },
  { key: "3", label: "Danger action", danger: true },
];

export function ShowcaseNavigation() {
  return (
    <>
      <Section title="Breadcrumb">
        <Breadcrumb items={[{ title: <HomeOutlined /> }, { title: "Section" }, { title: "Page" }]} />
        <Breadcrumb separator=">" items={[{ title: "Home", href: "#top" }, { title: "List", href: "#top" }, { title: "Detail" }]} />
      </Section>

      <Section title="Menu — horizontal, vertical (inline with submenu), dark">
        <Demo label="Horizontal">
          <Menu mode="horizontal" selectedKeys={["a"]} items={menuItems} style={w480} />
        </Demo>
        <Demo label="Inline (vertical) with submenu, open">
          <Menu mode="inline" defaultSelectedKeys={["m2a"]} defaultOpenKeys={["m2"]} items={nestedMenu} style={w200} />
        </Demo>
        <Demo label="Dark theme">
          <Menu mode="inline" theme="dark" defaultSelectedKeys={["m1"]} items={nestedMenu} style={w200} />
        </Demo>
      </Section>

      <Section title="Dropdown">
        <Dropdown menu={{ items: dropdownItems }}>
          <Button>Hover: Dropdown <DownOutlined /></Button>
        </Dropdown>
        <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
          <Button>Click: Dropdown <DownOutlined /></Button>
        </Dropdown>
        <Demo label="Rendered open (no click needed)">
          <Dropdown._InternalPanelDoNotUseOrYouWillBeFired menu={{ items: dropdownItems }} />
        </Demo>
      </Section>

      <Section title="Steps">
        <Demo label="Horizontal, small">
          <Steps size="small" current={1} style={w320} items={[{ title: "Start" }, { title: "Doing" }, { title: "Done" }]} />
        </Demo>
        <Demo label="With status and description">
          <Steps
            current={1}
            status="error"
            style={w480}
            items={[
              { title: "Finished", content: "Description" },
              { title: "Failed", content: "Description" },
              { title: "Waiting", content: "Description" },
            ]}
          />
        </Demo>
        <Demo label="Vertical">
          <Steps orientation="vertical" size="small" current={1} items={[{ title: "One" }, { title: "Two" }, { title: "Three" }]} />
        </Demo>
      </Section>

      <Section title="Tabs">
        <Demo label="Line (default)">
          <Tabs
            defaultActiveKey="1"
            style={w320}
            items={[
              { key: "1", label: "Tab one", children: "One" },
              { key: "2", label: "Tab two", children: "Two" },
              { key: "3", label: "Disabled", disabled: true },
            ]}
          />
        </Demo>
        <Demo label="Card">
          <Tabs
            type="card"
            defaultActiveKey="1"
            style={w320}
            items={[
              { key: "1", label: "Tab one", children: "One" },
              { key: "2", label: "Tab two", children: "Two" },
            ]}
          />
        </Demo>
        <Demo label="Left position">
          <Tabs
            tabPlacement="start"
            defaultActiveKey="1"
            style={w260}
            items={[
              { key: "1", label: "Tab one", children: "One" },
              { key: "2", label: "Tab two", children: "Two" },
            ]}
          />
        </Demo>
      </Section>

      <Section title="Pagination">
        <Demo label="Default"><Pagination defaultCurrent={3} total={120} /></Demo>
        <Demo label="Size changer + quick jumper"><Pagination defaultCurrent={1} total={500} showSizeChanger showQuickJumper /></Demo>
        <Demo label="Simple / small"><Pagination simple defaultCurrent={2} total={50} /></Demo>
        <Demo label="Small"><Pagination size="small" defaultCurrent={1} total={50} /></Demo>
      </Section>

      <Section title="Anchor">
        <Anchor affix={false} items={[
          { key: "top", href: "#top", title: "Back to top" },
          { key: "sub", href: "#top", title: "Section", children: [{ key: "child", href: "#top", title: "Subsection" }] },
        ]} />
      </Section>
    </>
  );
}
