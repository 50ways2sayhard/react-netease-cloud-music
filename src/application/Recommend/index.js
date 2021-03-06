import React, { useEffect } from "react";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import { renderRoutes } from "react-router-config";
import RecommendList from "../../components/list";
import Loading from "../../components/loading";
import Scroll from "../../components/scroll";
import Slider from "../../components/slider";
import { selectPlayingSongsCount } from "../Player/store/selectors";
import * as actionTypes from "./store/actionCreators";
import {
    selectBannerList,
    selectLoadingStatus,
    selectRecommendList
} from "./store/selectors";
import { Content } from "./style";

function Recommend(props) {
  const bannerList = useSelector(selectBannerList);
  const recommendList = useSelector(selectRecommendList);
  const loading = useSelector(selectLoadingStatus);
  const playing = useSelector(selectPlayingSongsCount);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!bannerList.length) dispatch(actionTypes.getBannerList());
    if (!recommendList.length) dispatch(actionTypes.getRecommendList());
  }, [dispatch]);

  return (
    <Content playing={playing}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList} />
          <RecommendList recommendList={recommendList} />
        </div>
      </Scroll>
      <Loading show={loading} />
      {renderRoutes(props.route.routes)}
    </Content>
  );
}

export default React.memo(Recommend);
