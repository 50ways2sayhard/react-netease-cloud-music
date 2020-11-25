import React from "react";
import LazyLoad from "react-lazyload";
import { getCount } from "../../api/utils";
import collection from "../../assets/collection.png";
import { List, ListItem, ListWrapper } from "./style";

function RecommendList(props) {
  const { recommendList } = props;
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {recommendList.map((item, idx) => (
          <ListItem key={item.id}>
            <div className="img_wrapper">
              <div className="decorate" />
              <LazyLoad
                placeholder={
                  <img
                    width="100%"
                    height="100%"
                    src={collection}
                    alt="music"
                  />
                }
              >
                <img
                  src={item.picUrl + "?param=300x300"}
                  width="100%"
                  height="100%"
                  alt={item.name}
                />
              </LazyLoad>
              <div className="play_count">
                <i className="iconfont play">&#xe885;</i>
                <span className="count">{getCount(item.playCount)}</span>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </ListWrapper>
  );
}

export default React.memo(RecommendList);
