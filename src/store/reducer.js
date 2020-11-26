import { combineReducers } from "redux";
import { reducer as albumReducer } from "../application/Album/store";
import { reducer as rankReducer } from "../application/Rank/store";
import { reducer as recommendReducer } from "../application/Recommend/store";
import { reducer as singersReducer } from "../application/Singers/store";

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer,
  album: albumReducer,
});
