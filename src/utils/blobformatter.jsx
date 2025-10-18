import { toast } from "react-toastify";

const createEmptyFile = fileName => {
  const emptyBlob = new Blob([""], { type: "application/octet-stream" });
  const emptyFile = new File([emptyBlob], fileName, { type: "application/octet-stream" });

  emptyFile.url = "error";

  console.log(emptyFile);
  return emptyFile;
};

export const urlToFile = async (url, fileName = "success") => {
  try {
    const response = await fetch(url);

    if (response.status == 404) {
      return createEmptyFile("error.file");
    }

    const blob = await response.blob();
    // 使用时间戳或随机字符串来确保文件名唯一
    const uniqueFileName = `${fileName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const file = new File([blob], uniqueFileName, { type: blob.type });

    file.url = url;
    console.log(file);
    return file;
  } catch (error) {
    return createEmptyFile(fileName);
  }
};

export const changeImageDataUrlToFileArray = dataUrl => {
  // 分割 dataUrl，提取 base64 部分
  const [header, base64String] = dataUrl.split(",");

  // 將 base64 字符串轉換為二進制數據
  const byteString = atob(base64String);

  // 獲取 MIME 類型
  const mimeString = header.split(":")[1].split(";")[0];

  // 創建一個 ArrayBuffer 並將二進制數據填充進去
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // 創建 Blob 對象
  const blob = new Blob([ab], { type: mimeString });

  // 創建 File 對象
  const file = new File([blob], "signature.png", { type: mimeString });

  file.url = dataUrl;

  // 將 File 對象包裹在數組中
  return [file];
};

export const changeUrlToBlob = async url => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = () => {
    if (xhr.status === 200) {
      resolve(xhr.response);
    } else {
      reject(new Error(`Failed to fetch blob: ${xhr.statusText}`));
    }
  };
  xhr.onerror = () => reject(new Error("Network error"));
  xhr.send();
});

export const getPDFBlobAndOpen = async apiFunc => {
  try {
    const response = await apiFunc;

    const blob = new Blob([response], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    window.open(url, "_blank");
  } catch (error) {
    console.log(error);
    toast.error(error.message || "匯出失敗");
  }
};

export const downloadExcelBlob = async apiFunc => {
  try {
    const response = await apiFunc;

    const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "證明文件.xlsx";
    a.click();
    a.remove();
  } catch (error) {
    // console.log(error);
    toast.error(error.message || "匯出失敗");
  }
};