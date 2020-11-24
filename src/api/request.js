import axios from "./config";

export const getBannerRequest = () => {
  return axios.get("/banner");
};

export const getRecommendListRequest = () => {
  return axios.get("/personalized");
};

export const getHotSingerListRequest = (count) => {
  return axios.get("/top/artists", { params: { offset: count } });
};

export const getSingerListRequest = (category, area, alpha, count) => {
  return axios.get("/artist/list", {
    params: {
      type: category,
      area,
      initial: alpha.toLowerCase(),
      offset: count,
    },
  });
};
