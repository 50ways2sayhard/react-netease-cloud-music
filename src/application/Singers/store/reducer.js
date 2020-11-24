import produce from "immer";
import * as actionTypes from "./constants";

const defaultState = {
  singerList: [],
  enterLoading: true,
  pullUpLoading: false,
  pullDownLoading: false,
  pageCount: 0,
};

export default produce((draft, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SINGER_LIST:
      draft.singerList = action.data;
      break;
    case actionTypes.CHANGE_PAGE_COUNT:
      draft.pageCount = action.data;
      break;
    case actionTypes.CHANGE_ENTER_LOADING:
      draft.enterLoading = action.data;
      break;
    case actionTypes.CHANGE_PULLUP_LOADING:
      draft.pullUpLoading = action.data;
      break;
    case actionTypes.CHANGE_PULLDOWN_LOADING:
      draft.pullDownLoading = action.data;
      break;
  }
}, defaultState);
