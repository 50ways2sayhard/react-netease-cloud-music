import styled from "styled-components";
import style from "../../assets/global-style";

export const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  > h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
  .Marquee {
    width: 100%;
    height: 35px;
    overflow: hidden;
    position: relative;
    white-space: nowrap;
  }
  .text {
    position: absolute;
    animation: marquee 10s linear infinite;
  }
  @keyframes marquee {
    from {
      left: 100%;
    }
    to {
      left: -100%;
    }
  }
  @keyframes marquee {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;
