import PropTypes from "prop-types";
import React from "react";
import SongList from "./SongList";
import { ListItem } from "./style";
import { filterRankTypeIdx } from "./utils";

function RankListItem(props) {
  const { item } = props;

  const enterDetail = (name) => {
    const idx = filterRankTypeIdx(name);
    if (idx === null) {
      alert("暂无相关数据");
      return;
    }
  };

  return (
    <ListItem
      key={item.coverImgId}
      tracks={item.tracks}
      onClick={() => enterDetail(item.name)}
    >
      <div className="img_wrapper">
        <img src={item.coverImgUrl} alt="" />
        <div className="decorate" />
        <span className="update_frequecy">{item.updateFrequency}</span>
      </div>
      <SongList songs={item.tracks} />
    </ListItem>
  );
}

RankListItem.propTypes = {
  item: PropTypes.object,
};

export default React.memo(RankListItem);
