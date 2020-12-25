import animations from "create-keyframe-animation";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { playMode } from "../../../api/config";
import { formatPlayTime, getName, prefixStyle } from "../../../api/utils";
import ProgressBar from "../../../components/progress-bar";
import {
  Bottom,
  CDWrapper,
  LyricContainer,
  LyricWrapper,
  Middle,
  NormalPlayerContainer,
  Operators,
  ProgressWrapper,
  Top,
} from "./style";
import Scroll from "../../../components/scroll";

function NormalPlayer(props) {
  const {
    song,
    fullScreen,
    toggleFullScreen,
    playing,
    percent,
    duration,
    currentTime,
    mode,
    currentLineNum,
    currentPlayingLyric,
    currentLyric,
  } = props;
  const {
    clickPlaying,
    onProgressChange,
    handleNext,
    handlePrev,
    changeMode,
    togglePlayList,
  } = props;
  const playerRef = useRef();
  const cdWrapperRef = useRef();
  const cdWrapperInnerRef = useRef();
  const currentState = useRef();
  const lyricContainerRef = useRef();
  const lyricScrollRef = useRef();
  const lyricLineRefs = useRef([]);

  const transform = prefixStyle("transform");

  useEffect(() => {
    if (!lyricScrollRef.current) return;
    const bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 5) {
      const lineEl = lyricLineRefs.current[currentLineNum - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentLineNum]);

  const enter = () => {
    playerRef.current.style.display = "block";
    const { x, y, scale } = _getPosAndScale();
    const animation = {
      0: { transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` },
      60: { transform: `translate3d(0, 0, 0) scale(1.1)` },
      100: { transform: "translate3d(0, 0, 0) scale(1)" },
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear",
      },
    });
    animations.runAnimation(cdWrapperRef.current, "move");
  };

  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth / width;

    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return { x, y, scale };
  };

  const afterEnter = () => {
    animations.unregisterAnimation("move");
    cdWrapperRef.current.style.animation = "";
  };

  const leave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDOM = cdWrapperRef.current;
    cdWrapperDOM.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    cdWrapperDOM.style[
      transform
    ] = `translated3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDOM = cdWrapperRef.current;
    cdWrapperDOM.style.transition = "";
    cdWrapperDOM.style[transform] = "";
    playerRef.current.style.display = "none";
  };

  const getPlayMode = useCallback(() => {
    if (mode === playMode.sequence) return "&#xe625;";
    else if (mode === playMode.loop) return "&#xe653;";
    else return "&#xe61b;";
  }, [mode]);

  const toggleCurrentState = useCallback(() => {
    if (currentState.current !== "lyric") currentState.current = "lyric";
    else currentState.current = "";
  }, []);

  return (
    <CSSTransition
      nodeRef={playerRef}
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={playerRef}>
        <div className="background">
          <img
            src={song.al.picUrl + "?param=300x300"}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer" />
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <h1 className="title">{song.name}</h1>
          <h1 className="subtitle">{getName(song.ar)}</h1>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            timeout={400}
            nodeRef={cdWrapperInnerRef}
            className="fade"
            in={currentState.current !== "lyric"}
          >
            <CDWrapper
              ref={cdWrapperInnerRef}
              style={{
                visibility:
                  currentState.current !== "lyric" ? "visible" : "hidden",
              }}
            >
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : "pause"}`}
                  src={song.al.picUrl + "?param=400x400"}
                  alt=""
                />
              </div>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition
            nodeRef={lyricContainerRef}
            timeout={400}
            className="fade"
            in={currentState.current === "lyric"}
          >
            <LyricContainer ref={lyricContainerRef}>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  className="lyric_wrapper"
                  style={{
                    visibility:
                      currentState.current === "lyric" ? "visible" : "hidden",
                  }}
                >
                  {currentLyric ? (
                    currentLyric.lines.map((item, idx) => {
                      lyricLineRefs.current[idx] = React.createRef();
                      return (
                        <p
                          className={`text ${
                            currentLineNum === idx ? "current" : ""
                          }`}
                          key={item + idx}
                          ref={lyricLineRefs.current[idx]}
                        >
                          {item.txt}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text pure">纯音乐，请欣赏。</p>
                  )}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              <ProgressBar percent={percent} percentChange={onProgressChange} />
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              />
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={(e) => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe723;" : "&#xe731;",
                }}
              />
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right" onClick={() => togglePlayList(true)}>
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
}

NormalPlayer.defaultProps = {
  fullScreen: false,
  playing: false,
  percent: 0,
  duration: 0,
  currentTime: 0,
  mode: 0,
  currentLyric: { lines: [] },
  currentLineNum: 0,
  currentPlayingLyric: "",
  toggleFullScreen: () => {},
  clickPlaying: () => {},
  onProgressChange: () => {},
  handleNext: () => {},
  handlePrev: () => {},
  changeMode: () => {},
  togglePlayList: () => {},
};

NormalPlayer.propTypes = {
  song: PropTypes.object,
  fullScreen: PropTypes.bool,
  playing: PropTypes.bool,
  percent: PropTypes.number,
  duration: PropTypes.number,
  currentTime: PropTypes.number,
  mode: PropTypes.number,
  currentLyric: PropTypes.object,
  currentLineNum: PropTypes.number,
  currentPlayingLyric: PropTypes.string,

  toggleFullScreen: PropTypes.func,
  clickPlaying: PropTypes.func,
  onProgressChange: PropTypes.func,
  handleNext: PropTypes.func,
  handlePrev: PropTypes.func,
  changeMode: PropTypes.func,
  togglePlayList: PropTypes.func,
};

export default React.memo(NormalPlayer);
