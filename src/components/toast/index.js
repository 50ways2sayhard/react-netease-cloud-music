import PropTypes from "prop-types";
import React, { useImperativeHandle, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { ToastWrapper } from "./style";

const Toast = React.forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState("");
  const wrapperRef = useRef();
  const { text } = props;

  useImperativeHandle(ref, () => ({
    show() {
      if (timer) clearTimeout(timer);
      setShow(true);
      setTimer(setTimeout(() => setShow(false), 3000));
    },
  }));

  return (
    <CSSTransition
      nodeRef={wrapperRef}
      in={show}
      timeout={300}
      classNames="drop"
      unmountOnExit
    >
      <ToastWrapper ref={wrapperRef}>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  );
});

Toast.propTypes = {
  text: PropTypes.string,
};

export default React.memo(Toast);
