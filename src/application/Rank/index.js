import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { renderRoutes } from "react-router-config";
import Loading from "../../components/loading";
import Scroll from "../../components/scroll";
import { EnterLoading } from "../Singers/style";
import RankList from "./RankList";
import { getRankList } from "./store/actionCreators";
import { selectRankState } from "./store/selector";
import { Container } from "./style";
import { filterOfficialAndGlobalRankList } from "./utils";

function Rank(props) {
  const { rankList, loading } = useSelector(selectRankState);
  const dispatch = useDispatch();

  const fetchRankList = useCallback(() => {
    dispatch(getRankList());
  }, [dispatch]);

  useEffect(() => {
    if (!rankList.length) fetchRankList();
  }, []);

  const [officialList, globalList] = filterOfficialAndGlobalRankList(rankList);
  let displayStyle = loading ? { display: "none" } : { display: "block" };

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="official" style={displayStyle}>
            {" "}
            官方榜{" "}
          </h1>
          <RankList list={officialList} />
          <h1 className="global" style={displayStyle}>
            {" "}
            全球榜{" "}
          </h1>
          <RankList list={globalList} global={true} />
        </div>
        <EnterLoading>
          <Loading show={loading} />
        </EnterLoading>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  );
}

export default React.memo(Rank);
