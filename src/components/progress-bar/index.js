import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { prefixStyle } from "../../api/utils";
import { ProgressBarWrapper } from "./style";

function ProgressBar(props) {
  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();
  const [touch, setTouch] = useState({});
  const { percent } = props;
  const { percentChange } = props;

  const progressBtnWidth = 8;
  const transform = prefixStyle("transform");

  const _offset = (offsetWidth) => {
    progress.current.style.width = `${offsetWidth}px`;
    progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const curPercent = progress.current.clientWidth / barWidth;
    percentChange(curPercent);
  };

  const progressTouchStart = (e) => {
    setTouch({
      initiated: true,
      startX: e.touches[0].pageX,
      left: progress.current.clientWidth,
    });
  };

  const progressTouchMove = (e) => {
    if (!touch.initiated) return;
    const deltaX = e.touches[0].pageX - touch.startX;
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };

  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  };

  const progressClick = (e) => {
    const rect = progressBar.current.getBoundingClientRect();
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    _changePercent();
  };

  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      const offsetWidth = percent * barWidth;
      progress.current.style.width = `${offsetWidth}px`;
      progressBtn.current.style[
        transform
      ] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
  }, [percent]);

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick}>
        <div className="progress" ref={progress} />
        <div
          className="progress-btn-wrapper"
          ref={progressBtn}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn" />
        </div>
      </div>
    </ProgressBarWrapper>
  );
}

ProgressBar.propTypes = {
  percent: PropTypes.number,
  percentChange: PropTypes.func,
};

ProgressBar.defaultProps = {
  percent: 0,
  percentChange: () => {},
};

export default React.memo(ProgressBar);
