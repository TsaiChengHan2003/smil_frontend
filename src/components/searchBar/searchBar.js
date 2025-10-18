import { useEffect, useRef } from "react";
import { Search } from "react-feather";
import { useForm } from "react-hook-form";
import styles from "../../assets/scss/searchBar/SearchBar.module.scss";
import { useLoading } from "../../hooks/useLoading";
import { fetchDataBySearchBar } from "../../utils/fetchUtils";
import { generateSearchBarByInputType, OnlyLabelComponent } from "../../utils/searchBarComponents";
import { SET_ON_SEARCH_FUNC_PARAM } from "../../redux/dataTable/separateModalDataTableAction";

export default function SearchBar({
  searchAPI,
  searchBarColumnsArray = [],
  state,
  dispatch,
  onSearchFuncParam = () => {}, // 回傳 search function 的參數給父組件
  watchValue = [],
  neededSearchParams = {},
  globalSearch = true,
  selectDropdowns,
  justSearch = false,
  noDefaultPageParams = false,
  noPagination = false,
  getDataInFirstTimeLoad = true,
  customSearchBarPadding = "30px",
  loadingTime = 500,
  defaultValues = {},
}) {
  const { setLoading } = useLoading();
  const isFirstMount = useRef(true);
  const isFirstRender = useRef(true);
  const isWatchValueFirstChange = useRef(true);
  const formMethod = useForm({ defaultValues: defaultValues });
  const hasCheckboxItems = searchBarColumnsArray.filter(item => item.inputType === "checkbox").length > 0;

  const search = async () => {
    const onSearchFunc = async () => {
      setLoading(true);
      await fetchDataBySearchBar({
        searchListApiFunc: searchAPI,
        inputColumnsArray: searchBarColumnsArray,
        getValues: formMethod.getValues,
        state: state,
        dispatch: dispatch,
        noDefaultPageParams: noDefaultPageParams,
        noPagination: noPagination,
        neededSearchParams: neededSearchParams,
      });
      setTimeout(() => {
        setLoading(false);
      }, loadingTime);
    };

    onSearchFunc();
    dispatch({ type: SET_ON_SEARCH_FUNC_PARAM, payload: onSearchFunc });
  };

  useEffect(() => {
    if (Array.isArray(watchValue) && watchValue.length > 0) {
      const watchedValues = watchValue.reduce((acc, field) => {
        acc[field] = formMethod.watch(field);
        return acc;
      }, {});

      if (onSearchFuncParam) {
        onSearchFuncParam(watchedValues);
      }
    } else if (typeof watchValue === "string" && watchValue) {
      const fieldValue = formMethod.watch(watchValue);

      if (onSearchFuncParam) {
        onSearchFuncParam(fieldValue);
      }
    }
  }, [watchValue, onSearchFuncParam]);

  // 第一个 useEffect 保持不变
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;

      if (getDataInFirstTimeLoad) {
        search();
      }
      return;
    }
  }, []);

  // 修改第二个 useEffect
  useEffect(() => {
  // 如果是首次渲染，跳过
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 如果是 watchValue 的首次变化且不需要首次加载数据，跳过
    if (isWatchValueFirstChange.current && !getDataInFirstTimeLoad) {
      isWatchValueFirstChange.current = false;
      return;
    }

    search();
  }, [
    state.page,
    state.pageRowSize,
    ...(Array.isArray(watchValue) ? watchValue.map(field => formMethod.watch(field)) : [formMethod.watch(watchValue)])
  ]);

  return (
    <>
      {!justSearch && (
        <div className="d-flex flex-column gap-4" style={{ padding: customSearchBarPadding }}>
          <div className="d-flex input-group gap-4 align-items-center">
            {searchBarColumnsArray
              .filter(item =>
                item.inputType !== "checkbox" && item.inputType !== "radio")
              .map(item => (
                <div className="d-flex" key={item.labelId}>
                  {(item.inputType !== "dynamicInputByLabelValue" && item.inputType !== "labelSelect") && <OnlyLabelComponent item={item} />}
                  {generateSearchBarByInputType({ item: item, formMethod: formMethod, selectDropdowns: selectDropdowns })}
                </div>
              ))}

            {globalSearch && (
              <div className="d-flex" key={"globalValue"}>
                <span className="input-group-text" id={"globalValue"}>
                  {"搜尋"}
                </span>
                <input
                  type={"text"}
                  className="form-control"
                  placeholder={"請輸入關鍵字"}
                  id={"globalValue"}
                  aria-describedby={"globalValue"}
                  {...formMethod.register("globalValue")}
                ></input>
              </div>
            )}

            <div className={styles.iconDiv} onClick={search}>
              <Search />
            </div>
          </div>

          {hasCheckboxItems && (
            <div className="d-flex gap-4 align-items-center">
              <div className="d-flex" key={"checkboxLabel"}>
                <span className="input-group-text">{"快速篩選"}</span>
              </div>
              <div className="d-flex align-items-center gap-4">
                {searchBarColumnsArray
                  .filter(item =>
                    item.inputType === "checkbox" || item.inputType === "radio")
                  .map(item => (
                    <div
                      className="form-check align-items-center"
                      key={item.labelId}
                    >
                      {generateSearchBarByInputType({ item: item, formMethod: formMethod, selectDropdowns: selectDropdowns })}
                      <label
                        className="form-check-label"
                        htmlFor={item.registerName}
                      >
                        {item.labelName}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}