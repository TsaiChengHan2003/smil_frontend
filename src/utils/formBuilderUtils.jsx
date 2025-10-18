/* eslint-disable max-len */
import { generateByInputType, generateBySubItem, LabelComponent } from "./formBuilderComponents";

/**
 * FormBuilder - 自定義表單生成器
 *
 * @component
 * @param {Object} props
 * @param {Array} props.inputArray - 表單欄位配置陣列，定義所有要渲染的表單項目
 * @param {Function} props.register - React Hook Form 的 register 函數
 * @param {Function} props.watch - React Hook Form 的 watch 函數，用於監聽表單值變化
 * @param {Function} props.getValues - React Hook Form 的 getValues 函數，用於獲取表單值
 * @param {Function} props.setValue - React Hook Form 的 setValue 函數，用於設置表單值
 * @param {boolean} props.labelNeeded - 是否需要顯示標籤
 * @param {string} [props.labelMinWidth="80px"] - 標籤最小寬度
 * @param {string} [props.labelMaxHeight="20px"] - 標籤最大高度
 * @param {string} [props.flexDirection="row"] - 表單項目排列方向 ("row" | "column")
 * @param {boolean} [props.defaultToday=true] - 日期欄位是否預設今天
 * @param {Object} [props.selectOptions={}] - 下拉選單選項配置
 *
 * @description
 * inputArray 中每個項目的配置選項：
 *
 * 必要屬性：
 * @property {string} inputType - 輸入類型
 * @property {string} registerName - 表單註冊名稱
 *
 * 可選屬性：
 * @property {string} [labelName] - 標籤名稱
 * @property {string} [placeholder] - 預設提示文字
 * @property {string} [validateKey] - 驗證關鍵字，添加必填標記(*)
 * @property {boolean} [disabled] - 是否禁用
 * @property {string} [subItemFlexDirection] - 子項目排列方向 ("row" | "column")
 * @property {string} [leftDescribeText] - 左側描述文字
 * @property {string} [rightDescribeText] - 右側描述文字
 * @property {string} [leftDescribeTextWidth] - 左側描述文字寬度
 * @property {string} [rightDescribeTextWidth] - 右側描述文字寬度
 * @property {string} [hintUnit] - 單位提示文字
 *
 * 特定類型專用屬性：
 * select 類型：
 * @property {Array} [options] - 選項陣列
 * @property {string} [valueKey="value"] - 選項值的鍵名
 * @property {string} [labelKey="label"] - 選項標籤的鍵名
 *
 * checkbox/radio 類型：
 * @property {Array} [checkBoxItems/radioItems] - 選項陣列
 *
 * multipleDate/singleMultipleDate 類型：
 * @property {string} timeRegisterName - 時間註冊名稱
 * @property {string} totalHourRegisterName - 總時數註冊名稱
 * @property {number} maxDate - 最大日期數量
 *
 * @example
 * // 基本文字輸入
 * {
 *   inputType: "text",
 *   registerName: "field_name",
 *   labelName: "欄位名稱",
 *   placeholder: "請輸入",
 * }
 *
 * // 子項目群組
 * {
 *   labelName: "群組標題",
 *   subItemFlexDirection: "column",
 *   subItem: [
 *     {
 *       inputType: "checkbox",
 *       registerName: "checkbox_field",
 *       checkBoxItems: [...]
 *     },
 *     {
 *       inputType: "textarea",
 *       registerName: "memo_field",
 *     }
 *   ]
 * }
 *
 * // 時間範圍
 * {
 *   labelName: "營運時間",
 *   subItem: [{
 *     inputType: "singleMultipleDate",
 *     timeRegisterName: "operation_time",
 *     totalHourRegisterName: "total_hours",
 *     maxDate: 1,
 *     leftDescribeText: "總時數",
 *     leftDescribeTextWidth: "50px",
 *   }]
 * }
 *
 * @returns {JSX.Element} 返回根據配置生成的表單
 */

export function FormBuilder({ inputArray, register, watch, getValues, control, disabled, dataListRegisterName, setValue, divFullWidth, labelNeeded, labelMinWidth = "80px", labelMaxHeight = "20px", flexDirection = "row", itemMarginBottom = "20px", defaultToday = true, selectDropdowns = {}, checkBoxItems = [] }) {
  if (dataListRegisterName) {
    inputArray = inputArray.map(item => ({
      ...item,
      registerName: `${dataListRegisterName}.${item.registerName}`  // 添加 Data 后缀来避免数组形式
    }));
  }

  return (
    <form className="theme-form">
      {inputArray?.map((item, index) => (
        item.inputType === "hr" ? <hr key={index} style={{ margin: "10px 0px", border: "1px solid #ccc" }} /> :
          <div className="form-group" key={index} style={{ marginBottom: itemMarginBottom }}>
            <div className={`d-flex ${flexDirection === "row" ? "" : "flex-column"} ${item.noItemGap ? "" : "gap-2"}`}>
              {labelNeeded ? <LabelComponent item={item} minWidth={labelMinWidth} maxHeight={labelMaxHeight} /> : null}
              {item.subItem ?
                <div className={`d-flex ${item.subItemFlexDirection === "row" ? "" : "flex-column"} ${item.noSubItemGap ? "" : "gap-2"} `} >
                  {generateBySubItem({
                    item: item,
                    register: register,
                    watch: watch,
                    control: control,
                    getValues: getValues,
                    setValue: setValue,
                    disabled: disabled,
                    divFullWidth: divFullWidth,
                    checkBoxItems: checkBoxItems,
                    defaultToday: defaultToday,
                    selectDropdowns: selectDropdowns
                  })}
                </div> :
                generateByInputType({
                  item: item,
                  register: register,
                  watch: watch,
                  getValues: getValues,
                  control: control,
                  setValue: setValue,
                  disabled: disabled,
                  divFullWidth: divFullWidth,
                  checkBoxItems: checkBoxItems,
                  defaultToday: defaultToday,
                  selectDropdowns: selectDropdowns
                })
              }
            </div>
          </div>
      ))}
    </form>
  );
}

export function GridFormBuilder({ gridNumber, inputArray, register, watch, getValues, control, dataListRegisterName, disabled, setValue, divFullWidth, labelNeeded, labelMinWidth = "80px", labelMaxHeight = "20px", flexDirection = "row", defaultToday = true, selectDropdowns = {}, checkBoxItems = [], gridGap = "5px 15px", gridAlignItems = "center", fontSize = "14px" }) {
  if (dataListRegisterName) {
    // 處理當有 dataListRegisterName(陣列型資料之陣列名稱) 時，inputArray 的 subItem 的 labelRegisterName 和 registerName 需要加上 dataListRegisterName
    inputArray = inputArray.map(item => {
      if (item.subItem) {
        return {
          ...item,
          subItem: item.subItem.map(subItem => {
            if (subItem.inputType == "selectedLabelAndText") {
              return {
                ...subItem,
                labelRegisterName: `${dataListRegisterName}.${subItem.labelRegisterName}`,
                registerName: `${dataListRegisterName}.${subItem.registerName}`
              };
            } else {
              return {
                ...subItem,
                registerName: `${dataListRegisterName}.${subItem.registerName}`
              };
            }
          })
        };
      } else {
        return {
          ...item,
          registerName: `${dataListRegisterName}.${item.registerName}`
        };
      }
    });
  }
  const screenWidth = window.innerWidth;
  const gridTemplateColumns = screenWidth < 768 ? "1fr" : `repeat(${gridNumber}, 1fr)`;

  return (
    <form className="theme-form" style={{ fontSize: fontSize }}>
      <div style={{ display: "grid", gridTemplateColumns: gridTemplateColumns, justifyContent: "space-between", gap: gridGap, alignItems: gridAlignItems }}>
        {inputArray.map((item, index) => (
          <div className="form-group" style={{ margin: "0px", gridColumn: `span ${item.gridColumn}`, width: divFullWidth ? "100%" : undefined }} key={index}>
            <div className={`d-flex align-items-center ${flexDirection === "row" ? "" : "flex-column"} gap-2`}>
              {labelNeeded && item.labelName ? <LabelComponent item={item} minWidth={labelMinWidth} maxHeight={labelMaxHeight} /> : null}
              {item.subItem ?
                <div className={`d-flex ${item.subItemFlexDirection === "row" ? "" : "flex-column"} ${item.noSubItemGap ? "" : "gap-2"}`} style={{ width: divFullWidth ? "100%" : undefined }}>
                  {generateBySubItem({
                    item: item,
                    register: register,
                    watch: watch,
                    getValues: getValues,
                    control: control,
                    setValue: setValue,
                    disabled: disabled,
                    divFullWidth: divFullWidth,
                    checkBoxItems: checkBoxItems,
                    defaultToday: defaultToday,
                    selectDropdowns: selectDropdowns,
                    gridTemplateColumns: gridTemplateColumns
                  })}
                </div> :
                generateByInputType({
                  item: item,
                  register: register,
                  watch: watch,
                  getValues: getValues,
                  control: control,
                  setValue: setValue,
                  disabled: disabled,
                  divFullWidth: divFullWidth,
                  checkBoxItems: checkBoxItems,
                  defaultToday: defaultToday,
                  selectDropdowns: selectDropdowns,
                  gridTemplateColumns: gridTemplateColumns
                })
              }
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}

export const TableInputItem = ({ register, disabled, registerName, placeholder, style, colSpan }) => (
  <td registerName={registerName} style={style} colSpan={colSpan}>
    <input
      type={"text"}
      className="form-control"
      placeholder={`請輸入${placeholder}`}
      id={registerName}
      disabled={disabled}
      {...register(registerName)}
    />
  </td>
);

export const SelectedLabelTextComponent = ({ item, register, watch, disabled, divFullWidth }) => (
  <div className="form-group" style={{ width: divFullWidth ? "100%" : undefined }}>
    <div className="input-group">
      <select className="input-group-text" value={watch(item.labelRegisterName)} id={item.labelRegisterName} {...register(item.labelRegisterName)} style={{ backgroundColor: "gray", color: "white", maxWidth: item.selectedlabelMaxWidth }}>
        <option value="">請選擇</option>
        {item.labelSelectItems.map(label => (
          <option key={label.value} value={label.value}>
            {label.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="form-control"
        placeholder={`請輸入${item.placeholder}`}
        id={item.registerName}
        disabled={disabled}
        {...register(item.registerName)}
      />
    </div>
  </div>
);