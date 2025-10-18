import { useCallback } from "react";
import { useLoading } from "./useLoading";
import { toast } from "react-toastify";

export function useReturnRequest() {
  const { setLoading } = useLoading();

  const defaultReturnRequest = useCallback(async func => {
    setLoading(true);
    try {
      const response = await func();

      if (response.message) {
        toast.success(response.message);
      }

      return response;
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
    setLoading(false);
  }, []);

  return { defaultReturnRequest };
}