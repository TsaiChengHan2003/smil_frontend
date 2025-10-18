// utils/validation.js
import { toast } from "react-toastify";

/**
 * 通用表單驗證函式
 * @param {Object} formData - `getValues()` 取得的表單數據
 * @param {Array} requiredFields - 需要驗證的欄位
 * @param {Function} getValues - 來自 react-hook-form 的 getValues() 選填
 * @returns {Boolean} - 驗證成功回傳 true，失敗回傳 false
 */

const isEmptyValue = value => {
  if (value === undefined || value === null) {
    return true;
  }
  if (typeof value === "string" && value.trim() === "") {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  // 僅判斷純物件為空，排除特殊物件（如 Date、File）
  if (
    typeof value === "object" &&
    value.constructor === Object &&
    Object.keys(value).length === 0
  ) {
    return true;
  }
  return false;
};

const validateField = (field, formData) => {
  const value = formData[field.registerName];

  if (isEmptyValue(value) && field.validateKey) {
    // 只顯示第一個錯誤
    toast.error(`「${field.validateKey}」欄位不得為空`, { autoClose: 2000 });
    console.log(field);
    return false;
  }
  return true;
};

export const validateForm = (formData, requiredFields) => {
  if (!Array.isArray(requiredFields)) {
    return true;
  }

  for (const field of requiredFields) {
    if (field.subItem && Array.isArray(field.subItem)) {
      for (const subItem of field.subItem) {
        if (!validateField(subItem, formData)) {
          return false;
        }
      }
    } else {
      if (!validateField(field, formData)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * 日期驗證函式
 * @param {Array} requiredFields - 需要驗證的欄位
 * @param {Function} getValues - 來自 react-hook-form 的 getValues()
 * @returns {Boolean} - 驗證成功回傳 true，失敗回傳 false
 */
export const validateDate = (requiredFields, getValues) => {
  const dateFields = requiredFields.filter(field => field.inputType === "date");

  // ✅ 沒有日期欄位，視為驗證成功
  if (dateFields.length === 0) {
    return true;
  }

  // ✅ 需要同時有 `start_time` 和 `end_time` 才能驗證
  const hasStartTime = dateFields.some(field => field.registerName === "start_time");
  const hasEndTime = dateFields.some(field => field.registerName === "end_time");

  if (!hasStartTime || !hasEndTime) {
    return true; // 沒有完整的開始 & 結束時間欄位，跳過驗證，視為成功
  }

  const startTime = getValues("start_time");
  const endTime = getValues("end_time");

  // ✅ 如果 `start_time` 或 `end_time` 缺失，視為成功
  if (!startTime || !endTime) {
    return true;
  }

  // ❌ 開始時間不能大於結束時間
  if (startTime > endTime) {
    toast.error("「開始時間」不能大於「結束時間」");
    return false;
  }

  return true;
};

export const validateFormDataFiles = (fieldName, files, uploadFilesArray, minLength, maxLength, limitSize, limitTypeArray) => {
  if (maxLength && (uploadFilesArray.length + files.length) > maxLength) {
    toast.error(`最多上傳 ${maxLength} 個檔案`);
    return false;
  }

  // **檢查數量是否符合範圍**
  if (minLength && uploadFilesArray.length < minLength || uploadFilesArray.length > maxLength) {
    toast.error(`「${fieldName}欄位」不得為空(前端)`);
    return false;
  }

  // **逐一檢查檔案**
  for (const file of uploadFilesArray) {
    if (file.size > limitSize) {
      toast.error(`檔案 "${file.name}" 大小超過限制`);
      return false;
    }

    if (!limitTypeArray.includes(file.type)) {
      toast.error(`檔案 "${file.name}" 類型不符`);
      return false;
    }
  }

  return true;
};