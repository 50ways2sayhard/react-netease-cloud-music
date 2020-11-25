import {
    getHotSingerListRequest,
    getSingerListRequest
} from "../../../api/request";
import * as actionTypes from "./constants";
import { selectPageCount, selectSingerList } from "./selectors";

export const changeSingerList = (data) => ({
  type: actionTypes.CHANGE_SINGER_LIST,
  data,
});

export const changePageCount = (data) => ({
  type: actionTypes.CHANGE_PAGE_COUNT,
  data,
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const changePullUpLoading = (data) => ({
  type: actionTypes.CHANGE_PULLUP_LOADING,
  data,
});

export const changePullDownLoading = (data) => ({
  type: actionTypes.CHANGE_PULLDOWN_LOADING,
  data,
});

/**
 * 加载更多热门歌手
 * @returns {Function} thunk 后续处理的闭包
 */
export function refreshMoreHotSingerList() {
  return (dispatch, getState) => {
    const pageCount = selectPageCount(getState());
    const singerList = selectSingerList(getState());
    getHotSingerListRequest(pageCount)
      .then((res) => {
        const data = [...singerList, ...res.artists];
        dispatch(changeSingerList(data));
        dispatch(changePullUpLoading(false));
      })
      .catch(() => console.error("热门歌手数据获取失败"));
  };
}

/**
 * 第一次加载对应类型歌手
 * @param {string} category 歌手类型
 * @param {string} area 歌手所在地区
 * @param {string} alpha 首字母类型
 * @returns {Function} thunk 后续处理的闭包
 */
export function getSingerList(category, area, alpha) {
  return (dispatch) => {
    getSingerListRequest(category, area, alpha, 0)
      .then((res) => {
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.log("歌手数据获取失败");
      });
  };
}

/**
 * 加载更多歌手
 * @param {} category
 * @param {} alpha
 */
export function refreshMoreSingerList(category, area, alpha) {
  return (dispatch, getState) => {
    const pageCount = selectPageCount(getState());
    const singerList = selectSingerList(getState());
    getSingerListRequest(category, area, alpha, pageCount)
      .then((res) => {
        const data = [...singerList, ...res.artists];
        dispatch(changeSingerList(data));
        dispatch(changePullUpLoading(false));
      })
      .catch(() => {
        console.log("歌手数据获取失败");
      });
  };
}

export function getHotSingerList() {
  return (dispatch) => {
    getHotSingerListRequest(0)
      .then((res) => {
        const data = res.artists;
        dispatch(changeSingerList(data));
        dispatch(changeEnterLoading(false));
        dispatch(changePullDownLoading(false));
      })
      .catch(() => {
        console.error("热门歌手数据获取失败");
      });
  };
}
