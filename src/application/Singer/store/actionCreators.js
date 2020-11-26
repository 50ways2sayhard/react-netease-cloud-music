import { getSingerInfoRequest } from "../../../api/request";
import * as actionTypes from "./constants";

const changeArtist = (data) => ({
  type: actionTypes.CHANGE_ARTIST,
  data,
});

const changeSongs = (data) => ({
  type: actionTypes.CHANGE_SONGS_OF_ARTIST,
  data,
});

export const changeLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const getSingerInfo = (id) => {
  return (dispatch) => {
    getSingerInfoRequest(id).then((res) => {
      dispatch(changeArtist(res.artist));
      dispatch(changeSongs(res.hotSongs));
      dispatch(changeLoading(false));
    });
  };
};
