// reducer.js
import { ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, SET_IS_MODAL_SHOW, SET_IS_MODAL_CLOSE, SET_IS_DELETE_MODAL_SHOW, SET_IS_DELETE_MODAL_CLOSE, TOGGLE_ACTIVE, REVIEW_ITEM, SET_IS_CONFIRM_MODAL_SHOW, SET_IS_CONFIRM_MODAL_CLOSE, CONFIRM_ITEM, REJECT_ITEM, TOGGLE_STATE, SET_IS_SUB_MODAL_COMPONENT_OPEN, SET_IS_SUB_MODAL_COMPONENT_CLOSE, SET_IS_SUB_MODAL_SHOW, SET_IS_SUB_MODAL_CLOSE, SET_IS_SUB_DELETE_MODAL_SHOW, SET_IS_SUB_DELETE_MODAL_CLOSE, TOGGLE_CHANGE_STATUS, SET_DATA, TOGGLE_ENABLE, TOGGLE_REVIEW, SET_PAGE, SET_PAGE_SIZE, SET_ROW_AND_CONDITION, SET_ON_SEARCH_FUNC_PARAM } from "./separateModalDataTableAction";

export const separateModalDataTableInitialState = {
  data: [],                   // 列表資料
  pageRowSize: 10,            // 紀錄顯示給使用者之每頁顯示筆數
  pageCount: 0,               // 紀錄顯示給使用者之總共頁數
  count: 0,                   // 紀錄顯示給使用者之資料總筆數
  page: 1,                    // 紀錄顯示給使用者之目前於第幾頁
  sno: 0,                     // 紀錄顯示給使用者之id
  status: 1,                  // 有一些的data會根據使用者傳的狀態去顯示不同的欄位 就使用此參數
  onClickFunction: () => {},  // 儲存要發送之API
  isModalShow: null,          // 決定顯示  之彈窗
  isConfirmModalShow: false,  // 決定顯示 是否要(確認 / 撤回 / 刪除) 之彈窗
  isDeleteModalShow: false,   // 是否顯示刪除 之彈窗
  isSubModalComponentOpen: false, // 是否顯示子原件視窗
  isSubModalShow: false,          // 是否顯示子原件彈窗
  isSubDeleteModalShow: false,    // 是否顯示子原件刪除 之彈窗
  inputArray: [],             // 新增/編輯/刪除 之彈窗 需要顯示的欄位
  labelNeeded: false,         // 是否需要顯示label
  functionType: "",           // 新增/編輯/刪除
  functionName: "",           // 功能名稱
  dispatch: () => {},         // 發送action
  onSearchFunc: () => {},
  row: null,                 // 新增/編輯/刪除 之彈窗 需要顯示的資料
  disabled: false,           // 新增/編輯/刪除 之彈窗 是否禁用
  formMethod: {              // useForm 方法
    register: () => {},
    setValue: () => {},
    watch: () => {},
  },
};

export function separateModalDataTableReducer(state = separateModalDataTableInitialState, action) {
  switch (action.type) {
    case SET_DATA:
      return {
        ...state,
        data: action.payload.data,
        pageRowSize: action.payload.pageRowSize,
        pageCount: action.payload.pageCount,
        count: action.payload.count,
        page: action.payload.page,
        sno: (action.payload.page - 1) * action.payload.pageRowSize,
        status: action.payload.status,
      };

    case ADD_ITEM:
      return {
        ...state,
        data: [action.payload, ...state.data]
      };

    case UPDATE_ITEM:
      return {
        ...state,
        data: state.data.map(item => item.id === action.payload.id ? action.payload.updateData : item),
      };

    case DELETE_ITEM:
      return {
        ...state,
        data: state.data.filter(item => item.id !== action.payload),
      };

    case SET_IS_MODAL_SHOW:
      return {
        ...state,
        isModalShow: action.payload.isModalShow,
        row: action.payload.row,
        functionType: action.payload.functionType,
        disabled: action.payload.disabled,
        inputArray: action.payload.inputArray,
        onClickFunction: action.payload.onClickFunction,
      };

    case SET_IS_MODAL_CLOSE:
      return {
        ...state,
        isModalShow: false,
        row: null,
        type: null,
        disabled: false,
        inputArray: [],
        onClickFunction: () => {},
      };

    case SET_IS_SUB_MODAL_COMPONENT_OPEN:
      return {
        ...state,
        isSubModalComponentOpen: true,
      };

    case SET_IS_SUB_MODAL_COMPONENT_CLOSE:
      return {
        ...state,
        isSubModalComponentOpen: false,
      };

    case SET_IS_SUB_MODAL_SHOW:
      return {
        ...state,
        isSubModalShow: true,
        row: action.payload.row,
        functionType: action.payload.functionType,
        disabled: action.payload.disabled,
        inputArray: action.payload.inputArray,
        onClickFunction: action.payload.onClickFunction,
      };

    case SET_IS_SUB_MODAL_CLOSE:
      return {
        ...state,
        isSubModalShow: false,
        row: null,
        functionType: null,
        disabled: false,
        inputArray: [],
        onClickFunction: () => {},
      };

    case SET_IS_SUB_DELETE_MODAL_SHOW:
      return {
        ...state,
        isSubDeleteModalShow: true,
        row: action.payload.row,
        functionType: action.payload.type,
        onClickFunction: action.payload.onClickFunction,
      };

    case SET_IS_SUB_DELETE_MODAL_CLOSE:
      return {
        ...state,
        isSubDeleteModalShow: false,
        row: null,
        functionType: null,
        onClickFunction: () => {},
      };

    case SET_IS_DELETE_MODAL_SHOW:
      return {
        ...state,
        isDeleteModalShow: true,
        row: action.payload.row,
        functionType: action.payload.type,
        onClickFunction: action.payload.onClickFunction,
      };

    case SET_ROW_AND_CONDITION:
      return {
        ...state,
        row: action.payload.row,
        disabled: action.payload.disabled,
      };

    case SET_IS_DELETE_MODAL_CLOSE:
      return {
        ...state,
        isDeleteModalShow: false,
        row: null,
        functionType: null,
        onClickFunction: () => {},
      };

    case SET_IS_CONFIRM_MODAL_SHOW:
      return {
        ...state,
        isConfirmModalShow: true,
        row: action.payload.row,
        functionType: action.payload.functionType,
        onClickFunction: action.payload.onClickFunction,
      };

    case SET_IS_CONFIRM_MODAL_CLOSE:
      return {
        ...state,
        isConfirmModalShow: false,
        row: null,
        functionType: null,
        onClickFunction: () => {},
      };

    case REJECT_ITEM:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ? { ...item, status: "已" + state.functionType } : item),
      };

    case TOGGLE_ENABLE:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ? { ...item, is_enable: item.is_enable ? 0 : 1 } : item),
      };

    case TOGGLE_ACTIVE:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ? { ...item, isActive: item.isActive ? 0 : 1 } : item),
      };

    case TOGGLE_REVIEW:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ? { ...item, status: item.status === 1 ? 2 : 1 } : item),
      };

    case TOGGLE_CHANGE_STATUS:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ?
            { ...item, status: item.status === 1 ? 0 : 1 } :
            item),
      };

    case CONFIRM_ITEM:
      console.log(action.payload);
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ? { ...item, status: "已" + state.functionType } : item),
      };

    case TOGGLE_STATE:
      return {
        ...state,
        data: state.data.map(item =>
          item.id === action.payload ? { ...item, state: item.state === 1 ? 0 : 1 } : item),
      };

    case SET_PAGE:
      return { ...state, page: action.payload };

    case SET_PAGE_SIZE:
      return { ...state, pageRowSize: action.payload };

    case SET_ON_SEARCH_FUNC_PARAM:
      return { ...state, onSearchFunc: action.payload };

    default:
      return state;
  }
}