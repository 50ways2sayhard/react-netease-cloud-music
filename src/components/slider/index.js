import React, { useState, useEffect } from "react";
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";
import { SliderContainer } from "./style";

function Slider(props) {
  const [sliderSwiper, setSliderSwiper] = useState(0);
  const { bannerList } = props;

  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      let newSliderSwiper = new Swiper(".slider-container", {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: { el: ".swiper-pagination" },
      });
      setSliderSwiper(newSliderSwiper);
    }
  }, [bannerList.length, sliderSwiper]);

  return (
    <SliderContainer>
      <div className="before" />
      <div className="slider-container">
        <div className="swiper-wrapper">
          {bannerList.map((slider) => {
            return (
              <div className="swiper-slide" key={slider.imageUrl}>
                <div className="slider-nav">
                  <img
                    src={slider.imageUrl}
                    width="100%"
                    height="100%"
                    alt="Recommend"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="swiper-pagination" />
      </div>
    </SliderContainer>
  );
}

export default React.memo(Slider);
