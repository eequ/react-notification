import React, { useRef, useState } from "react";
import Notice from "../Notice";
import Notification from "../Notification";
import { HolderReadyCallback, NoticeContent, NoticeFunc } from "../types";

type HookType = [NoticeFunc, React.ReactElement];

/**
 * Hook that returns function for creating a new notification
 *
 * @param instance {Notification} - Notification instance
 */
const useAddNotification = (instance: Notification): HookType => {
  const createdRef = useRef<Record<React.Key, React.ReactElement>>({});
  const [elements, setElements] = useState<React.ReactElement[]>([]);

  const holderCallback: HolderReadyCallback = (div, props) => {
    const { key } = props;

    if (div && !createdRef.current[key]) {
      const noticeEle = <Notice {...props} holder={div} />;
      createdRef.current[key] = noticeEle;
      setElements((originElements) => [...originElements, noticeEle]);
    }
  };

  const addNotification = (noticeProps: NoticeContent) =>
    instance.add(noticeProps, holderCallback);

  return [addNotification, <>{elements}</>];
};

export default useAddNotification;
