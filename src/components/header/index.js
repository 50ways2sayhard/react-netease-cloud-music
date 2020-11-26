import PropTypes from "prop-types";
import React from "react";
import { HeaderContainer } from "./style";

const Header = React.forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props;
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>
        &#xe655;
      </i>
      <div className="Marquee">
        <h1 className={isMarquee ? "text" : ""}>{title}</h1>
      </div>
    </HeaderContainer>
  );
});

Header.defaultProps = {
  handleClick: () => {},
  title: "标题",
  isMarquee: false,
};

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool,
};

export default React.memo(Header);
