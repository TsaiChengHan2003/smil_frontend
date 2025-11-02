import API from "./API";

const IndexAPI = {
  // 查詢首頁輪播照片
  getCarouselPhotos: () => API.get("/v1/homepage/photos"),
};

export default IndexAPI;