import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { prefixStyle } from "../../../api/utils";
import { changeShowPlaylist } from "../store/actionCreators";
import { selectPlayerState } from "../store/selectors";
import { PlayListWrapper, ScrollWrapper } from "./style";

function PlayList(props) {
  const { showPlayList } = useSelector(selectPlayerState);
  const dispatch = useDispatch();
  const playListRef = useRef();
  const listWrapperRef = useRef();

  const [isShow, setIsShow] = useState(false);

  const togglePlayList = useCallback(
    (data) => {
      dispatch(changeShowPlaylist(data));
    },
    [dispatch]
  );

  const transform = prefixStyle("transform");

  const onEnter = useCallback(() => {
    setIsShow(true);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const onEntering = useCallback(() => {
    listWrapperRef.current.style.transition = "all 0.3s";
    listWrapperRef.current.style[transform] = "translate3d(0, 0, 0)";
  }, [transform]);

  const onExiting = useCallback(() => {
    listWrapperRef.current.style.transition = "all 0.3s";
    listWrapperRef.current.style[transform] = "translate3d(0px, 100%, 0px)";
  }, [transform]);

  const onExited = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = "translate3d(0px, 100%, 0px)";
  }, [transform]);

  return (
    <CSSTransition
      nodeRef={playListRef}
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: "block" } : { display: "none" }}
        onClick={() => togglePlayList(false)}
      >
        <div className="list_wrapper" ref={listWrapperRef}>
          <ScrollWrapper>PlayList</ScrollWrapper>
        </div>
      </PlayListWrapper>
    </CSSTransition>
  );
}

export default React.memo(PlayList);
