import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef
} from "react";
import { prefixStyle } from "../../api/utils";
import { Container } from "./style";

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef();
  const ICON_NUMBER = 3;
  const transform = prefixStyle("transform");

  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    const tempNode = document.createElement("div");
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  };

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let node = createNode('<div class="iconfont">&#xe642;</div>');
      iconsRef.current.appendChild(node);
    }

    let domArray = [].slice.call(iconsRef.current.children);
    domArray.forEach((item) => {
      item.running = false;
      item.addEventListener("transitionend", function () {
        this.style.display = "none";
        this.style[transform] = "translate3d(0, 0, 0)";
        this.running = false;

        const icon = this.querySelector("div");
        icon.style[transform] = "translate3d(0, 0, 0)";
      });
    }, false);
  }, []);

  const startAnimation = ({ x, y }) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      const domArray = [].slice.call(iconsRef.current.children);
      const item = domArray[i];
      if (item.running === false) {
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.display = "inline-block";

        setTimeout(() => {
          item.running = true;
          item.style[transform] = "translate3d(0, 750px, 0)";
          const icon = item.querySelector("div");
          icon.style[transform] = "translate3d(-40px, 0, 0)";
        }, 20);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  return <Container ref={iconsRef} />;
});

export default React.memo(MusicNote);
