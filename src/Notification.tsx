import cn from "classnames";
import { AnimatePresence } from "framer-motion";
import React, { Component, ReactText } from "react";
import ReactDOM from "react-dom";
import useAddNotification from "./hooks/useAddNotification";
import Notice from "./Notice";
import {
  HolderReadyCallback,
  NoticeContent,
  NoticeProps,
  NotificationInstance,
  NotificationProps,
  NotificationState,
} from "./types";

/**
 * Create unique id
 */
let seed = 0;
const now = Date.now();

function getUuid() {
  const id = seed;
  seed += 1;
  return `eetu_${now}_${id}`;
}

class Notification extends Component<NotificationProps, NotificationState> {
  /**
   * Define declarationn type for `newInstance` static class function.
   */
  static newInstance: (
    properties: NotificationProps,
    callback: (instance: NotificationInstance) => void
  ) => void;

  /**
   * Default pros for Notification wrapper
   */
  static defaultProps = { prefixCls: "notification" };

  /**
   * Component state that stores array of notices
   */
  state: NotificationState = {
    notices: [],
  };

  /**
   * Add function that will create a new notification based on
   * provided content and
   *
   * @param originNotice {NoticeContent}
   * @param holderCallback {HolderReadyCallback}
   */
  add = (originNotice: NoticeContent, holderCallback?: HolderReadyCallback) => {
    const key = originNotice.key || getUuid();
    const notice: NoticeContent & {
      key: React.Key;
      userPassKey?: React.Key;
    } = { ...originNotice, key };

    this.setState(({ notices }) => {
      const noticeKeys = notices.map(({ notice }) => notice.key);
      const noticeIndex = noticeKeys.indexOf(key);
      const updatedNotices = notices.slice(0);

      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, { notice, holderCallback });
      } else {
        const { maxCount } = this.props;

        if (maxCount && notices.length >= maxCount) {
          updatedNotices.shift();
        }

        updatedNotices.push({ notice, holderCallback });
      }

      return { notices: updatedNotices };
    });
  };

  /**
   * Remove a notice from state based on its key
   *
   * @param removeKey {string | number} - notice's unique key
   */
  remove = (removeKey: React.Key) => {
    this.setState(({ notices }) => ({
      notices: notices.filter(({ notice: { key, userPassKey } }) => {
        const mergedKey = userPassKey || key;

        return mergedKey !== removeKey;
      }),
    }));
  };

  noticePropsMap: Record<
    React.Key,
    {
      props: NoticeProps & { key: ReactText };
      holderCallback?: HolderReadyCallback;
    }
  > = {};

  render() {
    const { notices } = this.state;
    const { prefixCls, className, closeIcon, style } = this.props;

    const noticeKeys: React.Key[] = [];

    notices.forEach(({ notice, holderCallback }) => {
      const { key, userPassKey, content } = notice;

      const handleOnClose = (noticeKey: React.Key) => {
        this.remove(noticeKey);
        // Calling `onClose()` provided function
        notice.onClose?.();
      };

      const noticeProps = {
        prefixCls,
        closeIcon,
        ...notice,
        key,
        noticeKey: userPassKey || key,
        onClose: handleOnClose,
        children: content,
      } as NoticeProps & { key: ReactText };

      noticeKeys.push(key);
      this.noticePropsMap[key] = { props: noticeProps, holderCallback };
    });

    return (
      <div style={style} className={cn(prefixCls, className)}>
        <AnimatePresence initial={false}>
          {noticeKeys.map((key) => {
            const { props, holderCallback } = this.noticePropsMap[key];

            if (holderCallback) {
              return (
                <div
                  key={key}
                  className={cn(`${prefixCls}-hook-holder`)}
                  ref={(div) => {
                    if (typeof key === "undefined") {
                      return;
                    }

                    if (div) {
                      holderCallback(div, props);
                    }
                  }}
                />
              );
            }

            return <Notice key={key} {...props} />;
          })}
        </AnimatePresence>
      </div>
    );
  }
}

/**
 * Notification exposed function that creates a new instance of Notifications.
 *
 * It accepts a callback that return a object with exposed API.
 *
 * @param properties - Overwrie default props for the instance.
 * @param callback - It will return the notification instance.
 */
Notification.newInstance = (properties, callback) => {
  const { getContainer, ...props } = properties || {};

  // Create a new div element that will serve as the parent
  const div = document.createElement("div");

  if (getContainer) {
    // Extract the container within the instance will be created.
    const root = getContainer();
    root.appendChild(div);
  } else {
    // Fallback will append parent directly to the DOM body.
    document.body.appendChild(div);
  }

  /**
   * Prevent ref being called multiple times.
   */
  let called = false;
  const ref = (notification: Notification) => {
    if (called) {
      return;
    }

    called = true;

    // Calling callback function with Notification props
    callback({
      component: notification,
      notice: notification.add,
      remove: notification.remove,
      /**
       * Calling `destroy()` function will retult
       * into unmounting Notification (including it's child)
       */
      destroy: () => {
        ReactDOM.unmountComponentAtNode(div);
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      },
      // Hooks
      useNotification() {
        return useAddNotification(notification);
      },
    });
  };

  // Render Notification with ReactDOM
  ReactDOM.render(<Notification {...props} ref={ref} />, div);
};

export default Notification;
