import PropTypes from "prop-types";
import React from "react";
import RankListItem from "./RankListItem";
import { List } from "./style";

function RankList(props) {
  const { global, list } = props;
  return (
    <List globalRank={global}>
      {list.map((item) => (
        <RankListItem item={item} key={item.id} />
      ))}
    </List>
  );
}

RankList.propTypes = {
  global: PropTypes.bool,
  list: PropTypes.array,
};

RankList.defaultProps = {
  global: false,
  list: [],
};

export default React.memo(RankList);
