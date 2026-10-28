// src/stories/showcase/ShowcaseFeedback.tsx
//
// antd "Feedback": Alert, Drawer, Modal, message, notification, Popconfirm,
// Result, Skeleton, Spin, Tour. Every overlay appears twice: rendered OPEN
// (so a token change on popup surfaces is visible while scanning) and behind a
// trigger button (the real interaction). The buttons need antd's <App>
// (ShowcaseFrame provides it).

import { useRef, useState } from "react";
import {
  Alert, App, Button, Drawer, Flex, Modal, Popconfirm, Result, Skeleton, Spin, Tour, message as staticMessage,
  notification as staticNotification,
} from "antd";
import { Demo, Section } from "./ShowcaseKit";
import { w200, w240, w320 } from "./ShowcaseKit.styles";

// antd's static panels: the overlay surface rendered inline, already open. They
// are what antd's own Theme Editor uses to preview overlays. The `_Internal…`
// name is antd's warning that the API may change between majors — fine for a
// theme-check page (the coverage check and smoke test will flag it if it does).
const ModalPanel = Modal._InternalPanelDoNotUseOrYouWillBeFired;
const DrawerPanel = Drawer._InternalPanelDoNotUseOrYouWillBeFired;
const PopconfirmPanel = Popconfirm._InternalPanelDoNotUseOrYouWillBeFired;
const TourPanel = Tour._InternalPanelDoNotUseOrYouWillBeFired;
const NotificationPanel = staticNotification._InternalPanelDoNotUseOrYouWillBeFired;
const MessagePanel = staticMessage._InternalPanelDoNotUseOrYouWillBeFired;

export function ShowcaseFeedback() {
  const { message, notification, modal } = App.useApp();
  const [drawer, setDrawer] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [tour, setTour] = useState(false);
  const tourAnchor = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Section block title="Alert">
        <div>
          <Alert type="info" title="Info" showIcon />
          <Alert type="success" title="Success" showIcon />
          <Alert type="warning" title="Warning" showIcon closable />
          <Alert type="error" title="Error" description="With a description underneath." showIcon />
          <Alert type="info" banner title="Banner alert" />
          <Alert type="error" title="With action" showIcon action={<Button size="small" danger>Retry</Button>} />
        </div>
      </Section>

      <Section title="Result">
        <Result status="success" title="Success" subTitle="A themed result block" style={w320} />
        <Result status="error" title="Error" subTitle="Something failed" style={w320} />
        <Result status="404" title="404" subTitle="Page not found" style={w320} />
      </Section>

      <Section title="Skeleton, Spin">
        <div style={w240}><Skeleton active /></div>
        <Skeleton.Avatar active />
        <Skeleton.Button active />
        <Skeleton.Input active />
        <Skeleton.Image active />
        <Spin size="small" />
        <Spin />
        <Spin size="large" />
        <Spin description="Loading…">
          <div style={w200}>Content behind a spinner</div>
        </Spin>
      </Section>

      <Section title="Overlays — rendered open (no click needed)">
        <Demo label="Modal">
          <ModalPanel title="Modal title" style={w320}>Themed modal content.</ModalPanel>
        </Demo>
        <Demo label="Modal.confirm">
          <ModalPanel type="confirm" title="Confirm this?" style={w320}>Static confirm dialog.</ModalPanel>
        </Demo>
        <Demo label="Drawer">
          <DrawerPanel title="Drawer" style={w320}>Themed drawer content.</DrawerPanel>
        </Demo>
        <Demo label="Popconfirm">
          <PopconfirmPanel title="Delete this item?" description="This cannot be undone." />
        </Demo>
        <Demo label="Tour step">
          <TourPanel title="Tour step" description="A step of a product tour." current={0} total={3} style={w320} />
        </Demo>
        <Demo label="notification">
          <NotificationPanel type="info" title="Notification" description="Themed notification" style={w320} />
        </Demo>
        <Demo label="message">
          <Flex vertical gap={8}>
            <MessagePanel type="success" content="Success message" />
            <MessagePanel type="error" content="Error message" />
            <MessagePanel type="loading" content="Loading message" />
          </Flex>
        </Demo>
      </Section>

      <Section title="Overlays — click to check the real interaction">
        <Button onClick={() => message.success("Themed message")}>Message</Button>
        <Button onClick={() => notification.info({ title: "Notification", description: "Themed notification" })}>Notification</Button>
        <Button onClick={() => modal.confirm({ title: "Confirm?", content: "Static modal (modal.confirm)" })}>Static modal</Button>
        <Button onClick={() => setDialog(true)}>Modal</Button>
        <Button onClick={() => setDrawer(true)}>Drawer</Button>
        <Popconfirm title="Confirm this?"><Button>Popconfirm</Button></Popconfirm>
        <Button ref={tourAnchor} onClick={() => setTour(true)}>Tour</Button>
      </Section>

      <Modal title="Modal" open={dialog} onOk={() => setDialog(false)} onCancel={() => setDialog(false)}>
        Themed modal content.
      </Modal>
      <Drawer title="Drawer" open={drawer} onClose={() => setDrawer(false)}>
        Themed drawer content.
      </Drawer>
      <Tour
        open={tour}
        onClose={() => setTour(false)}
        steps={[{ title: "Tour step", description: "Points at the button that opened it.", target: () => tourAnchor.current as HTMLElement }]}
      />
    </>
  );
}
