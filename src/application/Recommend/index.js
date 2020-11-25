import React, { useEffect } from "react";
import { forceCheck } from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import RecommendList from "../../components/list";
import Loading from "../../components/loading";
import Scroll from "../../components/scroll";
import Slider from "../../components/slider";
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (!bannerList.length) dispatch(actionTypes.getBannerList());
    if (!recommendList.length) dispatch(actionTypes.getRecommendList());
  }, [dispatch]);

  return (
    <Content>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList} />
          <RecommendList recommendList={recommendList} />
        </div>
      </Scroll>
      <Loading show={loading} />
    </Content>
  );
}

export default React.memo(Recommend);
