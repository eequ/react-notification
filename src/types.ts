import React from "react";
import Notification from "./Notification";

export interface NotificationInstance {
  notice: NoticeFunc;
  remove: (key: React.Key) => void;
  destroy: () => void;
  component: Notification;
  useNotification: () => [NoticeFunc, React.ReactElement];
}

export interface NotificationProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  maxCount?: number;
  closeIcon?: React.ReactNode;
  getContainer?: () => HTMLElement;
}

export interface NotificationState {
  notices: NoticeType[];
}

export interface NoticeProps {
  prefixCls: string;
  style?: React.CSSProperties;
  className?: string;
  duration?: number | null;
  message?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  iconNode?: React.ReactNode;
  actions?: React.ReactNode;
  updateMark?: string;
  noticeKey: React.Key;
  closeIcon?: React.ReactNode;
  closable?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClose?: (key: React.Key) => void;
  holder?: HTMLDivElement;
}

export interface NoticeContent
  extends Omit<
    NoticeProps,
    "prefixCls" | "children" | "noticeKey" | "onClose"
  > {
  prefixCls?: string;
  key?: React.Key;
  updateMark?: string;
  content?: React.ReactNode;
  onClose?: () => void;
}

export type NoticeFunc = (noticeProps: NoticeContent) => void;
export type HolderReadyCallback = (
  div: HTMLDivElement,
  noticeProps: NoticeProps & { key: React.Key }
) => void;

export interface NoticeType {
  notice: NoticeContent & { userPassKey?: React.Key };
  holderCallback?: HolderReadyCallback;
}

export type callbackParams = {
  prefixCls: string;
  instance: NotificationInstance;
};

export type NotificationPlacement =
  | "topLeft"
  | "topRight"
  | "topCenter"
  | "bottomLeft"
  | "bottomRight"
  | "bottomCenter";

export enum NotificationPlacementEnum {
  topLeft = "topLeft",
  topRight = "topRight",
  topCenter = "topCenter",
  bottomLeft = "bottomLeft",
  bottomRight = "bottomRight",
  bottomCenter = "bottomCenter",
}

export type NotificationType = "success" | "info" | "error" | "warning";

export interface ArgsProps {
  message: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  key?: string;
  onClose?: () => void;
  duration?: number | null;
  icon?: React.ReactNode;
  placement?: NotificationPlacement;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  /**
   * @deprecated Use exposed methods instead
   **/
  readonly type?: NotificationType;
  onClick?: () => void;
  top?: number;
  bottom?: number;
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
  closable?: boolean;
}

export interface NotificationVariants {
  success: (args: ArgsProps) => void;
  error: (args: ArgsProps) => void;
  info: (args: ArgsProps) => void;
  warning: (args: ArgsProps) => void;
  open: (args: ArgsProps) => void;
}

export interface ConfigProps {
  duration?: number;
  prefixCls?: string;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  closeIcon?: React.ReactNode;
}

export interface NotificationApi extends NotificationVariants {
  close: (key: string) => void;
  config: (options: ConfigProps) => void;
  destroy: () => void;

  useNotification: () => [NotificationVariants, React.ReactElement];
}
