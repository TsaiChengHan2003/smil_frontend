import { useCallback } from "react";
import { toast } from "react-toastify";
import { useLoading } from "./useLoading";

/**
 * 統一的請求處理 Hook
 * 用於管理 loading 狀態和 toast 訊息顯示
 *
 * 詳細使用說明請參考：
 * {@link https://github.com/your-repo/earthwork-frontend/blob/main/src/docs/useRequest.md}
 * 或專案目錄：src/docs/useRequest.md
 *
 * @returns {Object} { defaultRequest } - 請求處理函數
 * @example
 * const { defaultRequest } = useRequest();
 * const success = await defaultRequest(() => API.method());
 */
export function useRequest() {
  const { setLoading } = useLoading();

  const defaultRequest = useCallback(async (func, err, returnData = false) => {
    setLoading(true);
    try {
      const response = await func();

      toast.success(response.message);
      if (returnData) {
        return response;
      } else {
        return true;
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { defaultRequest };
}