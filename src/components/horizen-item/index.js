import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import Scroll from "../scroll";
import { List, ListItem } from "./style";

function Horizen(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;
  const Category = useRef(null);

  useEffect(() => {
    let categoryDOM = Category.current;
    let tagElements = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElements).forEach((elem) => (totalWidth += elem.offsetWidth));
    categoryDOM.style.width = totalWidth + "px";
  }, []);

  return (
    <Scroll direction="horizental">
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map((item) => (
            <ListItem
              key={item.key}
              className={`${oldVal === item.key ? "selected" : ""}`}
              onClick={() => {
                if (handleClick) handleClick(item.key);
              }}
            >
              {item.name}
            </ListItem>
          ))}
        </List>
      </div>
    </Scroll>
  );
}

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
};

Horizen.defaultProps = {
  list: [],
  oldVal: "",
  title: "",
  handleClick: null,
};

export default React.memo(Horizen);
