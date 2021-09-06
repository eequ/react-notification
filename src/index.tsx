import cn from "classnames";
import notificationIcons from "icons/notificationIcons";
import React, { createElement } from "react";
import createUseNotification from "./hooks/useNotification";
import Notification from "./Notification";
import "./style.css";
import {
  ArgsProps,
  callbackParams,
  ConfigProps,
  NotificationApi,
  NotificationInstance,
  NotificationPlacement,
  NotificationType,
} from "./types";

const notificationInstance: Record<string, Promise<NotificationInstance>> = {};

const defaultMessage: Record<NotificationType, string> = {
  ["info"]: "Info",
  ["error"]: "Error",
  ["success"]: "Success",
  ["warning"]: "Warning",
};

let defaultDuration = 4.5;
let defaultPrefixCls = "eequ-notification";
let defaultPlacement: NotificationPlacement = "topCenter";
let defaultGetContainer: () => HTMLElement;

/**
 * Callback that allows default values to be overwrited.
 *
 * @param options {ConfigProps} - Values for replacing default config
 */
const setNotificationConfig = (options: ConfigProps) => {
  const { duration, placement, getContainer, prefixCls } = options;

  if (prefixCls !== undefined) {
    defaultPrefixCls = prefixCls;
  }
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
};

/**
 * It will create a new notification instance
 * or use the cheched one if already exists.
 *
 * @param args
 * @param callback
 */
const getNotificationInstance = (
  args: ArgsProps,
  callback: (params: callbackParams) => void
) => {
  const { placement = defaultPlacement, getContainer = defaultGetContainer } =
    args;
  const outerPrefixCls = args.prefixCls || defaultPrefixCls;
  const prefixCls = `${outerPrefixCls}-notice`;

  // Build common cacheKey based on prefixCls and position
  const cacheKey = `${outerPrefixCls}-${placement}`;

  // Check if the instace already exists and use it if so
  const cacheInstance = notificationInstance[cacheKey];
  if (cacheInstance) {
    Promise.resolve(cacheInstance).then((instance) =>
      callback({ prefixCls, instance })
    );

    return;
  }

  // Create a new notification instance based on key value.
  notificationInstance[cacheKey] = new Promise((resolve) => {
    const notificationClass = `${outerPrefixCls}-${placement}`;

    Notification.newInstance(
      {
        prefixCls: outerPrefixCls,
        className: notificationClass,
        getContainer,
      },
      (instance) => {
        resolve(instance);
        callback({ prefixCls, instance });
      }
    );
  });
};

const getNoticeProps = (args: ArgsProps, prefixCls: string) => {
  const duration =
    args.duration === undefined ? defaultDuration : args.duration;

  let iconNode: React.ReactNode = null;
  const iconClassName = cn(
    `${prefixCls}-icon`,
    `${prefixCls}-icon-${args.type}`
  );
  if (args.icon) {
    iconNode = <span className={iconClassName}>{args.icon}</span>;
  } else if (args.type) {
    const iconElement = createElement(notificationIcons[args.type] || null);
    iconNode = <span className={iconClassName}>{iconElement}</span>;
  }

  const { key, className, style = {} } = args;
  const { content, closable, onClose, onClick } = args;
  const { type, message = defaultMessage[type], filled = true } = args;

  const actions = args.actions ? (
    <div className={`${prefixCls}-action`}>{args.actions}</div>
  ) : null;

  return {
    key,
    type,
    filled,
    actions,
    iconNode,
    message,
    content,
    onClose,
    onClick,
    style,
    className,
    duration,
    closable,
  };
};

const notice = (args: ArgsProps) =>
  getNotificationInstance(args, ({ prefixCls, instance }) => {
    instance.notice(getNoticeProps(args, prefixCls));
  });

const api = {
  open: notice,
  close(key: string) {
    Object.keys(notificationInstance).forEach((cacheKey) =>
      Promise.resolve(notificationInstance[cacheKey]).then((instance) => {
        instance.remove(key);
      })
    );
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach((cacheKey) => {
      Promise.resolve(notificationInstance[cacheKey]).then((instance) => {
        instance.destroy();
      });

      delete notificationInstance[cacheKey];
    });
  },
} as NotificationApi;

const types = ["success", "info", "error", "warning"] as const;

types.forEach(
  (type) => (api[type] = (args: ArgsProps) => api.open({ ...args, type }))
);

api.useNotification = createUseNotification(
  getNotificationInstance,
  getNoticeProps
);

export const notification = api as NotificationApi;

export default notification;
