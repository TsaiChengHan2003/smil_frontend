import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// 下拉選單hook
// 請傳入dropdownApiInfo陣列
// dropdownApiInfo陣列內的物件需要包含dropdownName、dropdownApiFunc、labelKey、valueKey
// dropdownName：下拉選單的name
// dropdownApiFunc：下拉選單的api函式
// labelKey：下拉選單的label key
// valueKey：下拉選單的value key
// dropdownApiInfo範例 (使用useMemo否則會無限重複渲染)
// const dropdownApiInfo = useMemo(() => [
//   { dropdownName: "area", dropdownApiFunc: LoginAPI.fetchAreaDropdown, labelKey: "area", valueKey: "id" },
//   { dropdownName: "type", dropdownApiFunc: LoginAPI.fetchTypeDropdown, labelKey: "type", valueKey: "typeCode" },
//   { dropdownName: "fieldID", dropdownApiFunc: ControlCardAgreeAPI.getFieldNamesDropdown, labelKey: "field_name", valueKey: "id", stopSearch: true },
// ], [])
// const { selectDropdowns } = useFetchDropdown({ dropdownApiInfo: dropdownApiInfo });
export const useFetchDropdown = ({ dropdownApiInfo }) => {
  const [selectDropdowns, setSelectDropdowns] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dropdowns = {};

        for (const item of dropdownApiInfo) {
          if (item.stopSearch) {
            continue;
          }

          const response = await item.dropdownApiFunc();
          const dropdownData = response.data.map(dropdownItem => ({
            label: dropdownItem[item.labelKey],
            value: dropdownItem[item.valueKey],
          }));

          dropdowns[item.dropdownName] = dropdownData;
        }

        setSelectDropdowns(dropdowns);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchData();
  }, [dropdownApiInfo]);

  return { selectDropdowns };
};