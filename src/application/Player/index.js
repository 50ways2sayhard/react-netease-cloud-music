import userEvent from "@testing-library/user-event";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playMode } from "../../api/config";
import Lyric from "../../api/lyric-parser";
import { getLyricRequest } from "../../api/request";
import { getSongUrl, isEmptyObject } from "../../api/utils";
import Toast from "../../components/toast";
import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import PlayList from "./play-list";
import {
  changeCurrentIndex,
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlayMode,
  changeSequencePlayList,
  changeShowPlaylist,
} from "./store/actionCreators";
import { selectPlayerState } from "./store/selectors";
import { findIndex, shuffle } from "./utils";

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [preSong, setPrevSong] = useState({});
  const [modeText, setModeText] = useState("");
  const [currentPlayingLyric, setCurrentPlayingLyric] = useState("");

  const audioRef = useRef();
  const songReady = useRef();
  const toastRef = useRef();

  const currentLyric = useRef();
  const currentLineNum = useRef(null);

  const {
    fullScreen,
    playing,
    currentIndex,
    currentSong,
    playList,
    mode,
    sequencePlayList,
  } = useSelector(selectPlayerState);
  const dispatch = useDispatch();

  const handleLyric = ({ lineNum, txt }) => {
    if (!currentLyric.current) return;
    currentLineNum.current = lineNum;
    setCurrentPlayingLyric(txt);
  };

  const getLyric = (id) => {
    let lyric = "";
    getLyricRequest(id)
      .then((data) => {
        lyric = data.lrc.lyric;
        if (!lyric) {
          currentLyric.current = null;
          return;
        }
        currentLineNum.current = 0;
        currentLyric.current = new Lyric(lyric, handleLyric);
        currentLyric.current.play();
        currentLyric.current.seek(0);
      })
      .catch(() => {
        songReady.current = true;
        audioRef.current.play();
      });
  };

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !sequencePlayList[currentIndex] ||
      sequencePlayList[currentIndex].id === preSong.id
    )
      return;
    let current = sequencePlayList[currentIndex];
    dispatch(changeCurrentSong(current));
    setPrevSong(current);
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    dispatch(changePlayingState(true));
    getLyric(current.id);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);
  }, [dispatch, currentIndex, preSong.id]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const toggleFullScreen = useCallback(
    (data) => {
      dispatch(changeFullScreen(data));
    },
    [dispatch]
  );

  const clickPlaying = useCallback(
    (e, state) => {
      e.stopPropagation();
      if (currentLyric.current)
        currentLyric.current.togglePlay(currentTime * 1000);
      dispatch(changePlayingState(state));
    },
    [dispatch, currentTime]
  );

  const updateTime = useCallback(
    (e) => {
      setCurrentTime(e.target.currentTime);
    },
    [setCurrentTime]
  );

  const onProgressChange = useCallback(
    (curPercent) => {
      const newTime = curPercent * duration;
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
      if (!playing) dispatch(changePlayingState(true));
      if (currentLyric.current) currentLyric.current.seek(newTime * 1000);
    },
    [setCurrentTime, dispatch, duration, playing]
  );

  const handleLoop = useCallback(() => {
    audioRef.current.currentTime = 0;
    dispatch(changePlayingState(true));
    audioRef.current.play();
  }, [dispatch]);

  const handlePrev = useCallback(() => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) dispatch(changePlayingState(true));
    dispatch(changeCurrentIndex(index));
  }, [dispatch, currentIndex, playing, playList.length]);

  const handleNext = useCallback(() => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = (currentIndex + 1) % playList.length;
    if (!playing) dispatch(changePlayingState(true));
    dispatch(changeCurrentIndex(index));
  }, [dispatch, currentIndex, playList.length, playing]);

  const handleEnd = useCallback(() => {
    if (mode === playMode.loop) handleLoop();
    else handleNext();
  }, [mode, handleLoop, handleNext]);

  const changeMode = useCallback(() => {
    const newMode = (mode + 1) % 3;
    if (newMode === playMode.sequence) {
      dispatch(changeSequencePlayList(playList));
      const index = findIndex(currentSong, sequencePlayList);
      dispatch(changeCurrentIndex(index));
      setModeText("顺序循环");
    } else if (newMode === playMode.loop) {
      dispatch(changeSequencePlayList(sequencePlayList));
      setModeText("单曲循环");
    } else if (newMode === playMode.random) {
      const newPlayList = shuffle(sequencePlayList);
      const index = findIndex(currentSong, newPlayList);
      dispatch(changeSequencePlayList(newPlayList));
      dispatch(changeCurrentIndex(index));
      setModeText("随机播放");
    }
    dispatch(changePlayMode(newMode));
    toastRef.current.show();
  }, [dispatch, mode, currentSong.id]);

  const handleError = () => {
    songReady.current = true;
    alert("播放出错");
  };

  const togglePlayList = useCallback(
    (data) => {
      dispatch(changeShowPlaylist(data));
    },
    [dispatch]
  );

  return (
    <div>
      {!isEmptyObject(currentSong) ? (
        <MiniPlayer
          playing={playing}
          percent={percent}
          song={currentSong}
          fullScreen={fullScreen}
          toggleFullScreen={toggleFullScreen}
          clickPlaying={clickPlaying}
          togglePlayList={togglePlayList}
        />
      ) : null}
      {!isEmptyObject(currentSong) ? (
        <NormalPlayer
          playing={playing}
          song={currentSong}
          fullScreen={fullScreen}
          clickPlaying={clickPlaying}
          currentTime={currentTime}
          duration={duration}
          percent={percent}
          mode={mode}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
          toggleFullScreen={toggleFullScreen}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          changeMode={changeMode}
          togglePlayList={togglePlayList}
        />
      ) : null}
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      />
      <PlayList changeMode={changeMode} />
      <Toast text={modeText} ref={toastRef} />
    </div>
  );
}

export default React.memo(Player);
