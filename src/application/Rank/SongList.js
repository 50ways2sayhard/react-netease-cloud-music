import PropTypes from "prop-types";
import React from "react";
import { SongList as SongListContainer } from "./style";

function SongList(props) {
  const { songs } = props;
  return songs.length ? (
    <SongListContainer>
      {songs.map((item, idx) => (
        <li key={idx}>
          {idx + 1}. {item.first} - {item.second}
        </li>
      ))}
    </SongListContainer>
  ) : null;
}

SongList.propTypes = {
  songs: PropTypes.array,
};

export default React.memo(SongList);
