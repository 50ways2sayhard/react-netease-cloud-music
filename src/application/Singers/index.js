import React, { useCallback, useEffect, useState } from "react";
import LazyLoad, { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import { alphaTypes, areaTypes, singerTypes } from "../../api/config";
import singer from "../../assets/singer.png";
import Horizen from "../../components/horizen-item";
import Loading from "../../components/loading";
import Scroll from "../../components/scroll";
import { changeEnterLoading } from "../Recommend/store/actionCreators";
import {
    changePageCount,
    changePullDownLoading,
    changePullUpLoading,
    getHotSingerList,
    getSingerList,
    refreshMoreHotSingerList,
    refreshMoreSingerList
} from "./store/actionCreators";
import { selectSingerProps } from "./store/selectors";
import { List, ListContainer, ListItem, NavContainer } from "./style";
import { isHot } from "./utils";

function Singer(props) {
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [alpha, setAlpha] = useState("");
  const {
    singerList,
    pageCount,
    pullUpLoading,
    pullDownLoading,
    enterLoading,
  } = useSelector(selectSingerProps);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHotSingerList());
  }, []);

  const updateSingers = useCallback(
    (category, area, alpha) => {
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList(category, area, alpha));
    },
    [dispatch]
  );

  const handleUpdateCategory = useCallback(
    (val) => {
      setCategory(val);
      updateSingers(val, area, alpha);
    },
    [alpha, area]
  );
  const handleUpdateAlpha = useCallback(
    (val) => {
      setAlpha(val);
      updateSingers(category, area, val);
    },
    [category, area]
  );
  const handleUpdateArea = useCallback(
    (val) => {
      setArea(val);
      updateSingers(category, val, alpha);
    },
    [category, alpha]
  );
  const pullDownRefresh = useCallback(() => {
    dispatch(changePullDownLoading(true));
    dispatch(changePageCount(0));
    if (isHot(category, area, alpha)) dispatch(getHotSingerList());
    else dispatch(getSingerList(category, area, alpha));
  }, [dispatch, category, area, alpha]);
  const pullUpNextPage = useCallback(() => {
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(pageCount + 1));
    if (isHot(category, area, alpha)) dispatch(refreshMoreHotSingerList());
    else dispatch(refreshMoreSingerList(category, area, alpha));
  });

  const renderSingerList = () => {
    return (
      <List>
        {singerList.map((item, index) => {
          return (
            <ListItem key={item.accountId + "" + index}>
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img width="100%" height="100%" src={singer} alt="music" />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <Horizen
          list={singerTypes}
          title="歌手分类（默认热门）:"
          handleClick={handleUpdateCategory}
          oldVal={category}
        />
        <Horizen
          list={areaTypes}
          title="歌手地区:"
          handleClick={handleUpdateArea}
          oldVal={area}
        />
        <Horizen
          list={alphaTypes}
          title="首字母:"
          handleClick={handleUpdateAlpha}
          oldVal={alpha}
        />
      </NavContainer>
      <ListContainer>
        <Scroll
          pullDown={pullDownRefresh}
          pullUp={pullUpNextPage}
          pullDownLoading={pullDownLoading}
          pullUpLoading={pullUpLoading}
          onScroll={forceCheck}
        >
          {renderSingerList()}
        </Scroll>
        <Loading show={enterLoading} />
      </ListContainer>
    </div>
  );
}

export default React.memo(Singer);
