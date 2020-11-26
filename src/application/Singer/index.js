import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { HEADER_HEIGHT } from "../../api/config";
import Header from "../../components/header";
import Loading from "../../components/loading";
import Scroll from "../../components/scroll";
import SongsList from "../SongList";
import { changeLoading, getSingerInfo } from "./store/actionCreators";
import { selectSingerInfo } from "./store/selectors";
import {
    BgLayer,
    CollectButton,
    Container,
    ImgWrapper,
    SongListWrapper
} from "./style";

function Singer(props) {
  const [showStatus, setShowStatus] = useState(true);
  const container = useRef();

  const imageWrapper = useRef();
  const collectButton = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const layer = useRef();
  const header = useRef();

  const initialHeight = useRef(0);

  const { artist, songsOfArtist, loading } = useSelector(selectSingerInfo);
  const dispatch = useDispatch();

  const OFFSET = 5;

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
  }, []);

  useEffect(() => {
    const id = props.match.params.id;
    dispatch(changeLoading(true));
    dispatch(getSingerInfo(id));
  }, []);

  const handleScroll = useCallback((pos) => {
    const height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

    const percent = Math.abs(newY / height);

    if (newY > 0) {
      // 1. 处理往下拉的情况，效果：图片放大，按钮跟着偏移
      imageDOM.style.transform = `scale(${1 + percent})`;
      buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      // 2. 往上滑动，但是遮罩还没超过 Header 部分
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style.opacity = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      // 3. 往上滑动，但是遮罩超过 Header 部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      headerDOM.style.zIndex = 100;
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, []);

  const handleClick = useCallback(() => {
    setShowStatus(false);
  }, []);

  return (
    <CSSTransition
      nodeRef={container}
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container ref={container}>
        <Header ref={header} title={artist.name} handleClick={handleClick} />
        <ImgWrapper bgUrl={artist.picUrl} ref={imageWrapper}>
          <div className="filter" />
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer} />
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList tracks={songsOfArtist} showCollect={false} />
          </Scroll>
        </SongListWrapper>
        <Loading show={loading} />
      </Container>
    </CSSTransition>
  );
}

export default React.memo(Singer);
