import axios from "./config";

export const getBannerRequest = () => {
  return axios.get("/banner");
};

export const getRecommendListRequest = () => {
  return axios.get("/personalized");
};

export const getHotSingerListRequest = (count, limit = 50) => {
  return axios.get("/top/artists", {
    params: { offset: count * limit, limit },
  });
};

export const getSingerListRequest = (
  category,
  area,
  alpha,
  count,
  limit = 30
) => {
  return axios.get("/artist/list", {
    params: {
      type: category,
      area,
      initial: alpha.toLowerCase(),
      limit,
      offset: count * limit,
    },
  });
};

export const getRankListRequest = () => {
  return axios.get("/toplist/detail");
};

export const getAlbumDetailRequest = (id) => {
  return axios.get("/playlist/detail", { params: { id } });
};

export const getSingerInfoRequest = (id) => {
  return axios.get("/artists", { params: { id } });
};

export const getLyricRequest = (id) => {
  return axios.get("/lyric", { params: { id } });
};
