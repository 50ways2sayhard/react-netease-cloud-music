import produce from "immer";
import { playMode } from "../../../api/config";
import { findIndex } from "../utils";
import * as actionTypes from "./constants";

const defaultState = {
  fullScreen: false,
  playing: false,
  sequencePlayList: [],
  playList: [],
  mode: playMode.sequence,
  showPlayList: false,
  currentIndex: -1,
  currentSong: {},
};

export default produce((draft, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      draft.currentSong = action.data;
      break;
    case actionTypes.SET_FULL_SCREEN:
      draft.fullScreen = action.data;
      break;
    case actionTypes.SET_PLAYING_STATE:
      draft.playing = action.data;
      break;
    case actionTypes.SET_SEQUECE_PLAYLIST:
      draft.sequencePlayList = action.data;
      break;
    case actionTypes.SET_PLAYLIST:
      draft.playList = action.data;
      break;
    case actionTypes.SET_CURRENT_INDEX:
      draft.currentIndex = action.data;
      break;
    case actionTypes.SET_SHOW_PLAYLIST:
      draft.showPlayList = action.data;
      break;
    case actionTypes.SET_PLAY_MODE:
      draft.mode = action.data;
      break;
    case actionTypes.DELETE_SONG:
      const playList = draft.playList.filter(
        (item) => item.id !== action.data.id
      );
      const sequencePlayList = draft.sequencePlayList.filter(
        (item) => item.id !== action.data.id
      );
      const newIdx = findIndex(draft.currentSong, sequencePlayList);
      draft.currentIndex = newIdx === -1 ? draft.currentIndex - 1 : newIdx;
      draft.playList = playList;
      draft.sequencePlayList = sequencePlayList;
      break;
    default:
      break;
  }
}, defaultState);
