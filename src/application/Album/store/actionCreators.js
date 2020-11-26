import { getAlbumDetailRequest } from "../../../api/request";
import * as actionTypes from "./constants";

const changeCurrentAlbum = (data) => ({
  type: actionTypes.CHANGE_CURRENT_ALBUM,
  data,
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const getAlbumList = (id) => {
  return (dispatch) => {
    getAlbumDetailRequest(id)
      .then((res) => {
        const data = res.playlist;
        dispatch(changeCurrentAlbum(data));
        dispatch(changeEnterLoading(false));
      })
      .catch(() => {
        console.log("获取 album 数据失败！");
      });
  };
};
