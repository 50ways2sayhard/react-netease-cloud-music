import PropTypes from "prop-types";
import React from "react";
import { LoadingWrapper } from "./style";

function Loading(props) {
  const { show } = props;
  const display = show ? { display: "block" } : { display: "none" };
  return (
    <LoadingWrapper style={display}>
      <div />
      <div />
    </LoadingWrapper>
  );
}

Loading.propTypes = {
  show: PropTypes.bool,
};

Loading.defaultProps = {
  show: false,
};

export default React.memo(Loading);
