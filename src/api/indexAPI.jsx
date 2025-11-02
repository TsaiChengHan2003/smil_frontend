import API from "./API";

const IndexAPI = {
  // 查詢首頁輪播照片
  getCarouselPhotos: () => API.get("/homepage/photos"),
};

export default IndexAPI;