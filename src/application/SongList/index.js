import PropTypes from "prop-types";
import React from "react";
import { getCount } from "../../api/utils";
import { SongItem, SongList } from "./style";
import { getName } from "./utils";

const SongsList = React.forwardRef((props, refs) => {
  const { tracks, subscribedCount, showBackground, showCollect } = props;
  return (
    <SongList ref={refs} showBackground={showBackground}>
      <div className="first_line">
        <div className="play_all">
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
});

SongsList.defaultProps = {
  showBackground: true,
  tracks: [],
  subscribedCount: 0,
  showCollect: true,
};

SongsList.propTypes = {
  tracks: PropTypes.array,
  subscribedCount: PropTypes.number,
  showBackground: PropTypes.bool,
  showCollect: PropTypes.bool,
};

export default React.memo(SongsList);
