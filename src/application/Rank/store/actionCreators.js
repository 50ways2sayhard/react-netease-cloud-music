import { getRankListRequest } from "../../../api/request";
import * as actionTypes from "./constants";

const changeRankList = (data) => ({
  type: actionTypes.CHANGE_RANK_LIST,
  data,
});

const changeLoading = (data) => ({
  type: actionTypes.CHANGE_LOADING,
  data,
});

export const getRankList = () => {
  return (dispatch) => {
    getRankListRequest().then((res) => {
      let list = res && res.list;
      dispatch(changeRankList(list));
      dispatch(changeLoading(false));
    });
  };
};
