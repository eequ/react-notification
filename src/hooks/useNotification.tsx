import { useRef } from "react";
import Notification from "../Notification";
import {
  ArgsProps,
  callbackParams,
  HolderReadyCallback,
  NoticeContent,
  NotificationInstance,
  NotificationVariants,
} from "../types";
import useAddNotification from "./useAddNotification";

type getNotificationInstanceType = (
  args: ArgsProps,
  callback: (params: callbackParams) => void
) => void;
type getNoticePropsType = (args: ArgsProps, prefixCls: string) => NoticeContent;

const createUseNotification = (
  getNotificationInstance: getNotificationInstanceType,
  getNoticeProps: getNoticePropsType
) => {
  const useNotification = (): [NotificationVariants, React.ReactElement] => {
    // We create a proxy to handle delay created instance
    let innerInstance: NotificationInstance | null = null;
    const proxy = {
      add: (
        noticeProps: NoticeContent,
        holderCallback?: HolderReadyCallback
      ) => {
        innerInstance?.component.add(noticeProps, holderCallback);
      },
    } as Notification;

    const [addNotification, holder] = useAddNotification(proxy);

    const notify = (args: ArgsProps) => {
      getNotificationInstance(args, ({ prefixCls, instance }) => {
        innerInstance = instance;
        addNotification(getNoticeProps(args, prefixCls));
      });
    };

    // Fill functions
    const hookApiRef = useRef<any>({});

    hookApiRef.current.open = notify;

    ["success", "info", "warning", "error"].forEach((type) => {
      hookApiRef.current[type] = (args: ArgsProps) =>
        hookApiRef.current.open({ ...args, type });
    });

    return [hookApiRef.current, holder];
  };

  return useNotification;
};

export default createUseNotification;
