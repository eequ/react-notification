import cn from "classnames";
import { motion } from "framer-motion";
import CloseIcon from "icons/close";
import React from "react";
import ReactDOM from "react-dom";
import { usePrevious, useTimeoutFn } from "react-use";
import { NoticeProps } from "./types";

/**
 * Comoponent that is diplayed inside notifications wrapper.
 */
const Notice: React.FC<NoticeProps> = (props) => {
  const { onClose, duration = 3 } = props;
  const { message, actions, iconNode, children } = props;

  const handleClose = () => {
    if (!duration) {
      // Prevent autoclose if duration is not provided
      return;
    }

    onClose(props.noticeKey);
  };

  /**
   * Hanlde close action via icon click
   */
  const close = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    onClose(props.noticeKey);
  };

  const [, cancel, reset] = useTimeoutFn(handleClose, duration * 1000);

  const prevProps = usePrevious({ duration });
  if (props.duration !== prevProps?.duration) {
    reset();
  }

  const { prefixCls } = props;
  const componentClass = `${prefixCls}-notice`;

  const { closable = true, closeIcon = <CloseIcon /> } = props;
  const closeBtn = closable && (
    <button onClick={close} className={`${componentClass}-close`}>
      <span role="img">{closeIcon}</span>
    </button>
  );

  const { onClick, style } = props;

  const className = cn(componentClass, props.className, "notice", {
    [`${componentClass}-closable`]: closable,
    [`${componentClass}-with-type`]: iconNode,
  });

  const node = (
    <motion.div
      style={style}
      onMouseEnter={cancel}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
      {...motionValues}
    >
      <div className={`${componentClass}-content-wrapper`}>
        <div className={`${componentClass}-header`}>
          {iconNode}
          <h4 className={`${componentClass}-message`}>{message}</h4>

          {closeBtn}
        </div>

        <div className={`${componentClass}-content`}>
          <p className={`${componentClass}-description`}>{children}</p>

          {actions ? (
            <div className={`${componentClass}-actions`}>{actions}</div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );

  if (props.holder) {
    return ReactDOM.createPortal(node, props.holder);
  }

  return node;
};

const motionValues = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.1 } },
  layout: true,
};

export default Notice;
