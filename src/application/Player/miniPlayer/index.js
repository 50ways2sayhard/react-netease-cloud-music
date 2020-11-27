import PropTypes from "prop-types";
import React, { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { getName } from "../../../api/utils";
import ProgressCircle from "../../../components/progress-circle";
import { MiniPlayerContainer } from "./style";

function MiniPlayer(props) {
  const { song, fullScreen, toggleFullScreen, playing, percent } = props;
  const { clickPlaying, setFullScreen } = props;
  const playerRef = useRef();
  return (
    <CSSTransition
      nodeRef={playerRef}
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        playerRef.current.style.display = "flex";
      }}
      onExited={() => {
        playerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer
        ref={playerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className={`play ${playing ? "" : "pause"}`}
              src={song.al.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i
                className="iconfont icon-mini icon-pause"
                onClick={(e) => clickPlaying(e, false)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="icon-mini iconfont icon-play"
                onClick={(e) => clickPlaying(e, true)}
              >
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
}

MiniPlayer.propTypes = {
  song: PropTypes.object,
  fullScreen: PropTypes.bool,
  playing: PropTypes.bool,
  percent: PropTypes.number,
  toggleFullScreen: PropTypes.func,
  clickPlaying: PropTypes.func,
  setFullScreen: PropTypes.func,
};

MiniPlayer.defaultProps = {
  fullScreen: false,
  playing: false,
  percent: 0,
  toggleFullScreen: () => {},
  clickPlaying: () => {},
  setFullScreen: () => {},
};

export default React.memo(MiniPlayer);
