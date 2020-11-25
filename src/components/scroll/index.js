import BScroll from "better-scroll";
import PropTypes from "prop-types";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from "react";
import { debounce } from "../../api/utils";
import Loading from "../loading";
import LoadingV2 from "../loading-v2";
import { PullDownLoading, PullUpLoading, ScrollContainer } from "./style";

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();
  const scrollContainerRef = useRef();
  const {
    direction,
    click,
    refresh,
    pullUpLoading,
    pullDownLoading,
    bounceTop,
    bounceBottom,
  } = props;
  const { pullUp, pullDown, onScroll } = props;

  const pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 0.3);
  }, [pullUp]);

  const pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 0.3);
  }, [pullDown]);

  // initial
  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
    });
    setBScroll(scroll);
    return () => setBScroll(null);
  }, []);
  // to prevent scroll freeze
  useEffect(() => {
    if (refresh && bScroll) bScroll.refresh();
  });

  // register scroll event
  useEffect(() => {
    if (!bScroll || !onScroll) return;
    bScroll.on("scroll", (scroll) => onScroll(scroll));
    return () => bScroll.off("scroll");
  }, [bScroll, onScroll]);

  // handle scroll to bottom
  useEffect(() => {
    if (!bScroll || !pullUp) return;
    const handlePullUp = () => {
      if (bScroll.y <= bScroll.maxScrollY + 100) pullUpDebounce();
    };
    bScroll.on("scrollEnd", handlePullUp);
    return () => bScroll.off("scrollEnd", handlePullUp);
  }, [pullUp, bScroll, pullUpDebounce]);

  // handle pull down
  useEffect(() => {
    if (!bScroll || !pullDown) return;
    const handlePullDown = (pos) => {
      if (pos.y > 50) pullDownDebounce();
    };
    bScroll.on("touchEnd", handlePullDown);
    return () => bScroll.off("touchEnd", handlePullDown);
  }, [pullDown, bScroll, pullDownDebounce]);

  // expose methods
  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll: () => {
      if (bScroll) return bScroll;
    },
  }));

  const PullUpdisplayStyle = pullUpLoading
    ? { display: "" }
    : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading
    ? { display: "" }
    : { display: "none" };

  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
      <PullUpLoading style={PullUpdisplayStyle}>
        <Loading show={pullUpLoading} />
      </PullUpLoading>
      <PullDownLoading style={PullDowndisplayStyle}>
        <LoadingV2 />
      </PullDownLoading>
    </ScrollContainer>
  );
});

Scroll.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizental"]),
  click: PropTypes.bool,
  refresh: PropTypes.bool,
  onScroll: PropTypes.func,
  pullUp: PropTypes.func,
  pullDown: PropTypes.func,
  pullUpLoading: PropTypes.bool,
  pullDownLoading: PropTypes.bool,
  bounceTop: PropTypes.bool,
  bounceBottom: PropTypes.bool,
};

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUploading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
};

export default Scroll;
