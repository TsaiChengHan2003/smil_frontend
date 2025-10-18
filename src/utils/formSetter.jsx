import { urlToFile } from "./blobformatter";

/**
 * 設定表單值
 * @param {Object} data - 表單數據
 * @param {Function} setValue - 設定表單值的函式
 * @param {Array} jsonParseParamArray - 需要進行 JSON.parse 的參數名稱陣列 通常用於inputType: "multipleDate"、"singleMultipleDate" 等欄位
 * @param {Array} imageDataUrlArray - 需要進行 changeImageDataUrlToFileArray 由於後端統一採覆蓋的方式儲存 所以一拿到資料統一轉File
 */
export const formSetter = async (data, setValue, jsonParseParamArray = [], imageDataUrlArray = []) => {
  Object.keys(data).forEach(async key => {
    if (jsonParseParamArray.includes(key)) {
      setValue(key, JSON.parse(data[key]));
    } else if (imageDataUrlArray.includes(key)) {
      const fileArray = await Promise.all(data[key].map(url => urlToFile(url)));

      setValue(key, fileArray);
    } else {
      setValue(key, data[key]);
    }
  });
};

// 重置表單
export const formReset = (reset, defaultValues = {}) => {
  reset(defaultValues);
};