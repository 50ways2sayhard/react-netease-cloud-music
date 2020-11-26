import PropTypes from "prop-types";
import React from "react";
import { Menu, TopDesc } from "./style";

function Cover(props) {
  const { album } = props;
  return (
    <div>
      <TopDesc background={album.coverImgUrl}>
        <div className="background">
          <div className="filter" />
        </div>
        <div className="img_wrapper">
          <div className="decorate" />
          <img src={album.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {Math.floor(album.subscribedCount / 1000) / 10} 万
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{album.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={album.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{album.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    </div>
  );
}

Cover.propTypes = {
  album: PropTypes.object,
};

export default React.memo(Cover);
