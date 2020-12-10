import { NotificationType } from "types";
import AlertIcon from "./alert";
import CheckIcon from "./check";
import ErrorIcon from "./error";
import InfoIcon from "./info";

type IconType = () => JSX.Element;

const notificationIcons: Record<NotificationType, IconType> = {
  error: ErrorIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertIcon,
};

export default notificationIcons;
