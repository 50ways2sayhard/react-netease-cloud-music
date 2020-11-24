import BScroll from "better-scroll";
import PropTypes from "prop-types";
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react";
import { ScrollContainer } from "./style";

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
    bScroll.on("scrollEnd", () => {
      if (bScroll.y <= bScroll.maxScrollY + 100) pullUp();
    });
    return () => bScroll.off("scrollEnd");
  }, [pullUp, bScroll]);

  // handle pull down
  useEffect(() => {
    if (!bScroll || !pullDown) return;
    bScroll.on("touchEnd", (pos) => {
      if (pos.y > 50) pullDown();
    });
    return () => bScroll.off("touchEnd");
  }, [pullDown, bScroll]);

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

  return (
    <ScrollContainer ref={scrollContainerRef}>{props.children}</ScrollContainer>
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