import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import SongList from "./SongList";
import { ListItem } from "./style";

function RankListItem(props) {
  const { item } = props;
  const history = useHistory();

  const enterDetail = useCallback((detail) => {
    history.push(`/rank/${detail.id}`);
  }, []);

  return (
    <ListItem
      key={item.coverImgId}
      tracks={item.tracks}
      onClick={() => enterDetail(item)}
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
