import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { HEADER_HEIGHT } from "../../api/config";
import { isEmptyObject } from "../../api/utils";
import style from "../../assets/global-style";
import Header from "../../components/header";
import Loading from "../../components/loading";
import MusicNote from "../../components/music-note";
import Scroll from "../../components/scroll";
import { selectPlayingSongsCount } from "../Player/store/selectors";
import SongsList from "../SongList";
import Cover from "./Cover";
import { changeEnterLoading, getAlbumList } from "./store/actionCreators";
import { selectAlbumState } from "./store/selectors";
import { Container } from "./style";

function Album(props) {
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false); //是否跑马灯
  const [showStatus, setShowStatus] = useState(true);
  const container = useRef();
  const headerEl = useRef();
  const musicNoteRef = useRef();
  const albumId = props.match.params.id;

  // redux
  const { currentAlbum, enterLoading } = useSelector(selectAlbumState);
  const playing = useSelector(selectPlayingSongsCount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeEnterLoading(true));
    dispatch(getAlbumList(albumId));
  }, []);

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 滑过顶部的高度开始变化
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbum.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
      }
    },
    [currentAlbum]
  );

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
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
      <Container ref={container} playing={playing}>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        />
        <Scroll bounceTop={false} onScroll={handleScroll}>
          <div>
            {!isEmptyObject(currentAlbum) ? <Cover album={currentAlbum} /> : ""}
            {!isEmptyObject(currentAlbum) ? (
              <SongsList
                tracks={currentAlbum.tracks}
                subscribedCount={currentAlbum.subscribedCount}
                showBackground={true}
                showCollect={true}
                musicAnimation={musicAnimation}
              />
            ) : (
              ""
            )}
          </div>
        </Scroll>
        <Loading show={enterLoading} />
        <MusicNote ref={musicNoteRef} />
      </Container>
    </CSSTransition>
  );
}

export default React.memo(Album);
