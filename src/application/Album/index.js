import React, { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import Header from "../../components/header";
import { Container } from "./style";

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const container = useRef();
  const headerEL = useRef();

  const handleBack = () => {
    setShowStatus(false);
  };

  return (
    <CSSTransition
      nodeRef={container}
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container ref={container}>
        <Header ref={headerEL} title="返回" handleClick={handleBack} />
      </Container>
    </CSSTransition>
  );
}

export default React.memo(Album);
