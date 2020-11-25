import produce from "immer";
import * as actionTypes from "./constants";

const defaultState = {
  rankList: [],
  loading: true,
};

export default produce((draft, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_RANK_LIST:
      draft.rankList = action.data;
      break;
    case actionTypes.CHANGE_LOADING:
      draft.loading = action.loading;
      break;
  }
}, defaultState);
