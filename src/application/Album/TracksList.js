import PropTypes from "prop-types";
import React from "react";
import { getCount } from "../../api/utils";
import { SongItem, SongList } from "./style";
import { getName } from "./utils";

function TracksList(props) {
  const { tracks, subscribedCount } = props;
  return (
    <SongList>
      <div className="first_line">
        <div className="play_all">
          <i className="iconfont">&#xe6e3;</i>
          <span>
            {" "}
            播放全部 <span className="sum">(共 {tracks.length})</span>
          </span>
        </div>
        <div className="add_list">
          <i className="iconfont">&#xe62d;</i>
          <span>收藏 ({getCount(subscribedCount)})</span>
        </div>
      </div>
      <SongItem>
        {tracks.map((item, index) => (
          <li key={index}>
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
}

TracksList.propTypes = {
  tracks: PropTypes.array,
  subscribedCount: PropTypes.number,
};

TracksList.defaultProps = {
  tracks: [],
  subscribedCount: 0,
};

export default React.memo(TracksList);
