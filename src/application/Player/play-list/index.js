import PropTypes from "prop-types";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { playMode } from "../../../api/config";
import { getName, prefixStyle } from "../../../api/utils";
import Scroll from "../../../components/scroll";
import {
  changeCurrentIndex,
  changeCurrentSong,
  changePlayingState,
  changePlayList,
  changeSequencePlayList,
  changeShowPlaylist,
  deleteSong,
} from "../store/actionCreators";
import { selectPlayerState } from "../store/selectors";
import {
  ListContent,
  ListHeader,
  PlayListWrapper,
  ScrollWrapper,
} from "./style";
import Confirm from "../../../components/confirm";

function PlayList(props) {
  const { changeMode } = props;

  const {
    showPlayList,
    mode,
    playList,
    currentSong,
    currentIndex,
  } = useSelector(selectPlayerState);
  const dispatch = useDispatch();
  const playListRef = useRef();
  const listWrapperRef = useRef();

  const [isShow, setIsShow] = useState(false);

  const confirmRef = useRef();

  const togglePlayList = useCallback(
    (data) => {
      dispatch(changeShowPlaylist(data));
    },
    [dispatch]
  );

  const getPlayMode = useCallback(() => {
    let content, text;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
      text = "循环播放";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <span className="text" onClick={(e) => changeMode(e)}>
          {text}
        </span>
      </div>
    );
  }, [mode, changeMode]);

  const getCurrentIcon = useCallback(
    (item) => {
      const current = currentSong.id === item.id;
      const className = current ? "icon-play" : "";
      const content = current ? "&#xe6e3;" : "";
      return (
        <i
          className={`current iconfont ${className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    },
    [currentSong.id]
  );

  const handleChangeCurrentIndex = useCallback(
    (index) => {
      if (currentIndex === index) return;
      dispatch(changeCurrentIndex(index));
    },
    [currentIndex, dispatch]
  );

  const handleShowClear = () => {
    confirmRef.current.show();
  };

  const handleConfirmClear = useCallback(() => {
    dispatch(changePlayList([]));
    dispatch(changeSequencePlayList([]));
    dispatch(changeCurrentIndex(-1));
    dispatch(changeShowPlaylist(false));
    dispatch(changeCurrentSong({}));
    dispatch(changePlayingState(false));
  }, [dispatch]);

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

  const [startY, setStartY] = useState(0);
  const [initialed, setIntialed] = useState(false);
  const [distance, setDistance] = useState(0);
  const [canTouch, setCanTouch] = useState(true);

  const listContentRef = useRef();

  const handleTouchStart = useCallback(
    (e) => {
      if (!canTouch || initialed) return;
      setDistance(0);
      listWrapperRef.current.style.transition = "";
      setStartY(e.nativeEvent.touches[0].pageY);
      setIntialed(true);
    },
    [canTouch, initialed]
  );
  const handleTouchMove = useCallback(
    (e) => {
      if (!canTouch || !initialed) return;
      const distance = e.nativeEvent.touches[0].pageY - startY;
      if (distance < 0) return;
      setDistance(distance);
      listWrapperRef.current.style[
        transform
      ] = `translate3d(0, ${distance}px, 0)`;
    },
    [canTouch, initialed]
  );
  const handleTouchEnd = useCallback(
    (e) => {
      setIntialed(false);
      if (distance >= 150) dispatch(changeShowPlaylist(false));
      else {
        listWrapperRef.current.style.transition = "all 0.3s";
        listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
      }
    },
    [dispatch, transform, distance]
  );
  const handleScroll = (pos) => {
    const state = pos.y === 0;
    setCanTouch(state);
  };

  return (
    <CSSTransition
      nodeRef={playListRef}
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnter}
      onEntering={onEntering}
      onExiting={onExiting}
      onExited={onExited}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow ? { display: "block" } : { display: "none" }}
        onClick={() => togglePlayList(false)}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScoll={(pos) => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {playList.map((item, index) => (
                  <li
                    className="item"
                    key={item.id}
                    onClick={() => {
                      handleChangeCurrentIndex(index);
                    }}
                  >
                    {getCurrentIcon(item)}
                    <span className="text">
                      {item.name} - {getName(item.ar)}
                    </span>
                    <span className="like">
                      <i className="iconfont">&#xe601;</i>
                    </span>
                    <span
                      className="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteSong(item));
                      }}
                    >
                      <i className="iconfont">&#xe63d;</i>
                    </span>
                  </li>
                ))}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text="是否删除全部？"
          handleConfirm={handleConfirmClear}
        />
      </PlayListWrapper>
    </CSSTransition>
  );
}

PlayList.propTypes = {
  changeMode: PropTypes.func,
};

PlayList.defaultProps = {
  changeMode: () => {},
};

export default React.memo(PlayList);
