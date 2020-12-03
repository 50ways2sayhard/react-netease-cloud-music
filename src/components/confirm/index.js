import React, {
  PureComponent,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { ConfirmWrapper } from "./style";

const Confirm = React.forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const { text, cancelBtnText, confirmBtnText } = props;
  const { handleConfirm } = props;

  const confirmRef = useRef();

  useImperativeHandle(ref, () => ({
    show: () => setShow(true),
  }));

  return (
    <CSSTransition nodeRef={confirmRef} timeout={300} appear={true} in={show}>
      <ConfirmWrapper
        ref={confirmRef}
        style={{ display: show ? "block" : "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="confirm_content">
            <p className="text">{text}</p>
            <div className="operate">
              <div className="operate_btn left" onClick={() => setShow(false)}>
                {cancelBtnText}
              </div>
              <div
                className="operate_btn"
                onClick={() => {
                  setShow(false);
                  handleConfirm();
                }}
              >
                {confirmBtnText}
              </div>
            </div>
          </div>
        </div>
      </ConfirmWrapper>
    </CSSTransition>
  );
});

Confirm.defaultProps = {
  text: "确定?",
  cancelBtnText: "取消",
  confirmBtnText: "确定",
  handleConfirm: () => {},
};

Confirm.propTypes = {
  text: PropTypes.string,
  cancelBtnText: PropTypes.string,
  confirmBtnText: PropTypes.string,
  handleConfirm: PropTypes.func,
};

export default React.memo(Confirm);
