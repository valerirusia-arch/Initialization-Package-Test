// src/stories/showcase/ShowcaseDataEntry.tsx
//
// antd "Data Entry": AutoComplete, Cascader, Checkbox, ColorPicker, DatePicker,
// Form, Input (+ Password/Search/TextArea/OTP), InputNumber, Mentions, Radio,
// Rate, Select, Slider, Switch, TimePicker, Transfer, TreeSelect, Upload,
// Segmented.

import { useState } from "react";
import {
  AutoComplete, Button, Cascader, Checkbox, ColorPicker, DatePicker, Form, Input, InputNumber,
  Mentions, Radio, Rate, Segmented, Select, Slider, Space, Switch, TimePicker, Transfer,
  TreeSelect, Upload, theme,
} from "antd";
import { InboxOutlined, StarOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Demo, Section } from "./ShowcaseKit";
import { panelSlot, panelSlotMedium, panelSlotNarrow, w200, w220, w260 } from "./ShowcaseKit.styles";
import { cascaderOptions, selectOptions, transferData, treeData } from "./showcaseData";

const { RangePicker } = DatePicker;
const { Dragger } = Upload;

export function ShowcaseDataEntry() {
  const { token } = theme.useToken();
  const [target, setTarget] = useState<string[]>(["1"]);

  return (
    <>
      <Section title="Input — variants, sizes, status">
        <Input placeholder="Outlined (default)" style={w200} />
        <Input variant="filled" placeholder="Filled" style={w200} />
        <Input variant="borderless" placeholder="Borderless" style={w200} />
        <Input placeholder="Large" size="large" style={w200} />
        <Input placeholder="Small" size="small" style={w200} />
        <Input placeholder="Error" status="error" style={w200} />
        <Input placeholder="Warning" status="warning" style={w200} />
        <Input placeholder="Disabled" disabled style={w200} />
        <Input placeholder="With prefix" prefix={<UserOutlined />} allowClear style={w200} />
        <Space.Compact style={w260}>
          <Space.Addon>https://</Space.Addon>
          <Input placeholder="With addons" />
          <Space.Addon>.com</Space.Addon>
        </Space.Compact>
      </Section>

      <Section title="Input — Password, Search, TextArea, OTP">
        <Input.Password placeholder="Password" style={w200} />
        <Input.Search placeholder="Search" enterButton style={w220} />
        <Input.TextArea placeholder="Textarea" rows={2} style={w220} />
        <Input.TextArea placeholder="Textarea with count" rows={2} showCount maxLength={60} style={w220} />
        <Demo label="Input.OTP"><Input.OTP length={4} /></Demo>
      </Section>

      <Section title="InputNumber, Slider, Rate, Switch">
        <InputNumber defaultValue={10} />
        <InputNumber defaultValue={1000} prefix="$" status="error" />
        <InputNumber defaultValue={3} disabled />
        <div style={w200}><Slider defaultValue={40} /></div>
        <div style={w200}><Slider range defaultValue={[20, 60]} /></div>
        <Rate defaultValue={3} character={<StarOutlined />} />
        <Rate defaultValue={2} allowHalf disabled />
        <Switch defaultChecked />
        <Switch size="small" />
        <Switch loading defaultChecked />
        <Switch disabled />
      </Section>

      <Section title="Select, AutoComplete, Cascader, TreeSelect, Mentions">
        <Select style={w200} placeholder="Select" options={selectOptions} />
        <Select style={w200} mode="multiple" defaultValue={["1", "2"]} options={selectOptions} />
        <Select style={w200} mode="tags" placeholder="Tags" />
        <Select style={w200} placeholder="Error" status="error" options={selectOptions} />
        <Select style={w200} placeholder="Disabled" disabled options={selectOptions} />
        <Select style={w200} placeholder="Loading" loading options={selectOptions} />
        <Select style={w200} showSearch placeholder="Searchable" options={selectOptions} />
        <AutoComplete style={w200} placeholder="AutoComplete" options={selectOptions} />
        <Cascader style={w200} placeholder="Cascader" options={cascaderOptions} />
        <TreeSelect style={w200} placeholder="TreeSelect" treeData={treeData} treeDefaultExpandAll />
        <TreeSelect style={w200} placeholder="Multiple, checkable" treeData={treeData} treeCheckable />
        <Mentions style={w220} placeholder="Type @ to mention" options={[{ value: "denys", label: "denys" }]} />
      </Section>

      <Section title="Pickers — DatePicker, RangePicker, TimePicker, ColorPicker">
        <DatePicker />
        <DatePicker picker="month" />
        <DatePicker showTime />
        <DatePicker status="error" placeholder="Error" />
        <DatePicker disabled placeholder="Disabled" />
        <RangePicker />
        <TimePicker />
        <ColorPicker defaultValue={token.colorPrimary} showText />
      </Section>

      <Section title="Dropdown panels — rendered open (no click needed)">
        {/* (Mentions has no static panel: its list only opens after typing "@".
            The interactive Mentions above covers it.) */}
        {/* antd's own static panels (the same ones its Theme Editor uses) — so a
            token change on the popup surface is visible while scanning. The
            click-to-open versions above stay as the "real" interaction. */}
        <Demo label="Select">
          <Select._InternalPanelDoNotUseOrYouWillBeFired options={selectOptions} value="2" style={w200} />
        </Demo>
        <Demo label="AutoComplete">
          <AutoComplete._InternalPanelDoNotUseOrYouWillBeFired options={selectOptions} style={w200} />
        </Demo>
        <Demo label="Cascader">
          <Cascader._InternalPanelDoNotUseOrYouWillBeFired options={cascaderOptions} style={w200} />
        </Demo>
        <Demo label="TreeSelect">
          <TreeSelect._InternalPanelDoNotUseOrYouWillBeFired treeData={treeData} treeDefaultExpandAll style={w200} />
        </Demo>
      </Section>

      {/* block = one panel per row. Picker panels are much wider than the inputs
          they hang from (and ColorPicker's is centred under its swatch), so side
          by side they spill over each other as soon as tokens grow. */}
      <Section block title="Picker panels — rendered open (no click needed)">
        <Demo label="DatePicker">
          <div style={panelSlot}>
            <DatePicker._InternalPanelDoNotUseOrYouWillBeFired />
          </div>
        </Demo>
        <Demo label="TimePicker">
          {/* Each panel is wider than the input it hangs from: the slot reserves
              its width so it doesn't spill over the next one. */}
          <div style={panelSlotNarrow}>
            <TimePicker._InternalPanelDoNotUseOrYouWillBeFired />
          </div>
        </Demo>
        <Demo label="ColorPicker">
          <div style={panelSlotMedium}>
            <ColorPicker._InternalPanelDoNotUseOrYouWillBeFired defaultValue={token.colorPrimary} />
          </div>
        </Demo>
      </Section>

      <Section title="RangePicker panel — rendered open (two months, so it gets its own row)">
        <DatePicker._InternalRangePanelDoNotUseOrYouWillBeFired />
      </Section>

      <Section title="Selection controls — Checkbox, Radio, Segmented">
        <Checkbox defaultChecked>Checkbox</Checkbox>
        <Checkbox indeterminate>Indeterminate</Checkbox>
        <Checkbox disabled>Disabled</Checkbox>
        <Checkbox.Group options={["One", "Two", "Three"]} defaultValue={["One"]} />
        <Radio.Group defaultValue="a" options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />
        <Radio.Group defaultValue="a" optionType="button" options={[{ value: "a", label: "Left" }, { value: "b", label: "Right" }]} />
        <Radio.Group defaultValue="a" optionType="button" buttonStyle="solid" options={[{ value: "a", label: "Solid" }, { value: "b", label: "Buttons" }]} />
        <Radio disabled>Disabled radio</Radio>
        <Segmented options={["Daily", "Weekly", "Monthly"]} />
        <Segmented options={["On", "Off"]} disabled />
      </Section>

      <Section title="Form — vertical with validation, horizontal, disabled">
        <Form layout="vertical" style={w260} requiredMark>
          <Form.Item label="Name" required><Input placeholder="Jane Doe" /></Form.Item>
          <Form.Item label="Email" validateStatus="error" help="Looks invalid">
            <Input placeholder="jane@x" />
          </Form.Item>
          <Form.Item label="Plan" validateStatus="warning" help="Almost full">
            <Select options={selectOptions} placeholder="Select" />
          </Form.Item>
          <Form.Item label="Saved" validateStatus="success" hasFeedback>
            <Input placeholder="Done" />
          </Form.Item>
          <Button type="primary">Submit</Button>
        </Form>
        <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ width: 360 }}>
          <Form.Item label="Username"><Input /></Form.Item>
          <Form.Item label="Agree" valuePropName="checked"><Checkbox>I agree</Checkbox></Form.Item>
        </Form>
        <Form layout="vertical" disabled style={w200}>
          <Form.Item label="Disabled form"><Input placeholder="Disabled" /></Form.Item>
        </Form>
      </Section>

      <Section title="Upload — button, dragger, picture list; Transfer">
        <Upload beforeUpload={() => false}><Button icon={<UploadOutlined />}>Upload</Button></Upload>
        <Upload
          beforeUpload={() => false}
          listType="picture"
          defaultFileList={[{ uid: "1", name: "photo.png", status: "done" }]}
        >
          <Button icon={<UploadOutlined />}>Picture list</Button>
        </Upload>
        <div style={{ width: 280 }}>
          <Dragger beforeUpload={() => false}>
            <Space orientation="vertical" size={4}>
              <InboxOutlined />
              <span>Click or drag a file here</span>
            </Space>
          </Dragger>
        </div>
        <Transfer
          dataSource={transferData}
          targetKeys={target}
          onChange={(keys) => setTarget(keys as string[])}
          render={(item) => item.title}
          titles={["Source", "Target"]}
          // Width only. A fixed height clipped the list as soon as a token made rows
          // taller ("5 items", 2 visible) — exactly what this page must reveal.
          // Widened 200 -> 240: at this project's larger base font the header
          // ("Source" + the n/m counter) no longer fits 200px. Giving the
          // component room is the fix the smoke test asks for — not a smaller test.
          styles={{ section: { width: 240, height: "auto" } }}
        />
      </Section>
    </>
  );
}
