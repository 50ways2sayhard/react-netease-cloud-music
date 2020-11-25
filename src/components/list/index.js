import React, { useCallback } from "react";
import LazyLoad from "react-lazyload";
import { useHistory } from "react-router";
import { getCount } from "../../api/utils";
import collection from "../../assets/collection.png";
import { List, ListItem, ListWrapper } from "./style";

function RecommendList(props) {
  const { recommendList } = props;
  const history = useHistory();
  const enterDetail = useCallback(
    (id) => {
      history.push(`/recommend/${id}`);
    },
    [history]
  );
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {recommendList.map((item) => (
          <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
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
