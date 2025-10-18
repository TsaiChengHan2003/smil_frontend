import { toast } from "react-toastify";

export const CheckUploadFile = async e => {
  if (!e.target.files[0]) {
    toast.error("請選擇要上傳的文件!");
    return;
  }

  if (e.target.files[0].size > 10 * 1024 * 1024) {
    toast.error("檔案大小超過10MB!");
    return;
  }

  if (e.target.files.length > 1) {
    toast.error("請上傳單一文件!");
    return;
  }
};