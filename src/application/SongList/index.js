import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { getCount, getName } from "../../api/utils";
import {
    changeCurrentIndex,
    changePlayList,
    changeSequencePlayList
} from "../Player/store/actionCreators";
import { SongItem, SongList } from "./style";

const SongsList = React.forwardRef((props, refs) => {
  const { tracks, subscribedCount, showBackground, showCollect } = props;
  const { musicAnimation } = props;
  const dispatch = useDispatch();

  const selectItem = (e, index) => {
    dispatch(changePlayList(tracks));
    dispatch(changeSequencePlayList(tracks));
    dispatch(changeCurrentIndex(index));
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  return (
    <SongList ref={refs} showBackground={showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            {" "}
            播放全部 <span className="sum">(共 {tracks.length})</span>
          </span>
        </div>
        {showCollect ? (
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span>收藏 ({getCount(subscribedCount)})</span>
          </div>
        ) : null}
      </div>
      <SongItem>
        {tracks.map((item, index) => (
          <li key={index} onClick={(e) => selectItem(e, index)}>
            <span className="index">{index + 1}</span>
            <div className="info">
              <span>{item.name}</span>
              <span>
                {getName(item.ar)} - {item.al.name}
              </span>
            </div>
          </li>
        ))}
      </SongItem>
    </SongList>
  );
});

SongsList.defaultProps = {
  showBackground: true,
  tracks: [],
  subscribedCount: 0,
  showCollect: true,
  musicAnimation: () => {},
};

SongsList.propTypes = {
  tracks: PropTypes.array,
  subscribedCount: PropTypes.number,
  showBackground: PropTypes.bool,
  showCollect: PropTypes.bool,
  musicAnimation: PropTypes.func,
};

export default React.memo(SongsList);
