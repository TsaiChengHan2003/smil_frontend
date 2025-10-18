import { toast } from "react-toastify";
import { SET_DATA } from "../redux/dataTable/separateModalDataTableAction";

/**
 * 用於搜索列表的 API 函式 並且會將搜索參數轉換成 API 需要的格式
 * @param {Function} searchListApiFunc - 搜索列表的 API 函式
 * @param {Array} inputColumnsArray - 表單輸入欄位配置 searchType: like=模糊查詢, equal=完全相等查詢, custom=自定義查詢(會被包在外部), labelLike=可選性的label 模糊查詢
 * @param {Function} getValues - 獲取表單值的函式
 * @param {Object} state - 表格狀態
 * @param {Function} dispatch - 分派動作的函式
*/

export const fetchDataBySearchBar = async ({
  searchListApiFunc,
  inputColumnsArray = [],
  getValues = () => {},
  state,
  dispatch,
  noDefaultPageParams = false,
  noPagination = false,
  neededSearchParams = {},
}) => {
  const searchListParam = inputColumnsArray
    .filter(item => item.searchType === "like")
    .map(item => ({
      name: item.registerName,
      value: getValues(item.registerName),
    }))
    .filter(item => item.value !== null || item.value !== undefined || item.value !== "")
    .filter(item => item.value);

  const labelSelectParam = inputColumnsArray
    .filter(item => item.searchType === "labelLike")
    .map(item => ({
      name: getValues(item.labelRegisterName),
      value: getValues(item.registerName),
    }))
    .filter(item => item.value !== null || item.value !== undefined || item.value !== "")
    .filter(item => item.value);

  // 等於完全相等查詢參數
  const equalsSearchListParam = inputColumnsArray
    .filter(item => item.searchType === "equal")
    .map(item => ({
      name: item.registerName,
      value: getValues(item.registerName),
    }))
    .filter(item => item.value !== null || item.value !== undefined || item.value !== "")
    .filter(item => item.value);

  // 自定義搜索參數
  const customSearchListParam = inputColumnsArray
    .filter(item => item.searchType === "custom")
    .reduce((acc, item) => {
      const value = getValues(item.registerName);

      if (value !== undefined && value !== "") {
        acc[item.registerName] = value;
      }
      return acc;
    }, {});

  let defaultParams = {};

  if (noPagination) {
    defaultParams = { globalValue: getValues("globalValue"), };
  } else {
    defaultParams = {
      globalValue: getValues("globalValue"),
      searchList: [...searchListParam, ...labelSelectParam],
      equalsSearchList: equalsSearchListParam,
      inputPage: noDefaultPageParams ? null : state.page || 1,
      inputPageRowSize: noDefaultPageParams ? null : state.pageRowSize || 10,
    };
  }

  const params = {
    ...defaultParams,
    ...customSearchListParam,
  };

  try {
    const response = await searchListApiFunc(neededSearchParams ? { ...neededSearchParams, ...params } : params);

    dispatch({ type: SET_DATA, payload: response });
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

export const fetchDataToRefresh = async ({
  searchListApiFunc,
  state,
  dispatch,
  noDefaultPageParams = false,
  noPagination = false,
  neededSearchParams = {},
}) => {
  let defaultParams = {};

  if (noPagination) {
    defaultParams = {};
  } else {
    defaultParams = {
      inputPage: noDefaultPageParams ? null : state.page,
      inputPageRowSize: noDefaultPageParams ? null : state.pageRowSize,
    };
  }

  const params = { ...defaultParams, };

  try {
    const response = await searchListApiFunc(neededSearchParams ? { ...neededSearchParams, ...params } : params);

    dispatch({ type: SET_DATA, payload: response });
  } catch (error) {
    toast.error(error.message);
  }
};