import { useEffect, useState } from "react";
import Captcha from "../auth/Captcha";
import { MultiSelect } from "./multiSelect";
import SearchableSelect from "./searchableSelect";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "react-feather";

export const RadioComponent = ({ item, setValue, watch, disabled }) => {
  const currentValue = watch(item.registerName);

  return (
    <div className="d-flex flex-wrap">
      {item.radioItems.map(radioItem => {
        // 将值转换为数字进行比较
        const isChecked = Number.isNaN(currentValue) ? Number(currentValue) === Number(radioItem.value) : currentValue === radioItem.value;

        return (
          <div
            key={item.registerName}
            className="d-flex justify-content-evenly align-items-center text-center gap-1"
            style={{ ...item.style }}
          >
            {
              Number.isNaN(currentValue) ? (
                <input
                  style={{ marginBottom: "0px" }}
                  className="form-check-input"
                  key={item.registerName}
                  type="radio"
                  value={radioItem.value}
                  disabled={disabled}
                  checked={isChecked}
                  onChange={e => {
                  // 确保值被转换为数字
                    const newValue = Number(e.target.value);

                    setValue(item.registerName, newValue, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                />
              ) : (
                <input
                  className="form-check-input"
                  type="radio"
                  name={item.registerName}
                  value={radioItem.value}
                  disabled={disabled}
                  checked={isChecked}
                  onChange={() => setValue(item.registerName, radioItem.value)}
                />
              )}

            <label
              className="form-label"
              htmlFor={item.registerName}
              style={{ marginBottom: "0px", minWidth: "50px" }}
            >
              <div className="d-flex align-items-center">
                {radioItem.labelName}
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export const ItemsValueComponent = ({ item, watch }) => (
  <div className="d-flex align-items-center" style={item.style ? item.style : {}}>
    {item.leftDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.leftDescribeTextWidth,
        }}
      >
        {item.leftDescribeText}
      </p>
    ) : null}
    <div className="d-flex align-items-center">{watch(item.registerName) || item.defaultHintValue || "-"}</div>
    {item.rightDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.rightDescribeTextWidth,
        }}
      >
        {item.rightDescribeText}
      </p>
    ) : null}
  </div>
);

export const TextareaComponent = ({ item, register, divFullWidth, disabled }) => (
  <div className="d-flex align-items-center" style={divFullWidth ? { width: "100%" } : {}}>
    {item.leftDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.leftDescribeTextWidth,
        }}
      >
        {item.leftDescribeText}
      </p>
    ) : null}
    <textarea
      className="form-control"
      style={{ whiteSpace: "pre-wrap", ...item.style }}
      name={item.registerName}
      placeholder={item.placeholder}
      disabled={disabled}
      {...register(item.registerName)}
    />
    {item.rightDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.rightDescribeTextWidth,
        }}
      >
        {item.rightDescribeText}
      </p>
    ) : null}
  </div>
);

export const DateComponent = ({
  item,
  register,
  defaultToday = true,
  getValues,
  setValue,
  disabled,
  divFullWidth,
}) => {
  useEffect(() => {
    const oldValue = getValues(item.registerName) || "";

    setValue(
      item.registerName,
      oldValue ?
        oldValue :
        defaultToday ?
          new Date().toISOString().split("T")[0] :
          ""
    );
  }, []);

  return (
    <div className="d-flex align-items-center" style={divFullWidth ? { width: "100%" } : {}}>
      {item.leftDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.leftDescribeTextWidth,
          }}
        >
          {item.leftDescribeText}
        </p>
      ) : null}
      <input
        className="form-control"
        type={item.inputType}
        name={item.registerName}
        placeholder={item.placeholder}
        defaultValue={
          defaultToday ? new Date().toISOString().split("T")[0] : ""
        }
        disabled={item.disabled || disabled}
        {...register(item.registerName)}
        style={{ minWidth: "100%", ...item.style }}
      />
      {item.rightDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.rightDescribeTextWidth,
          }}
        >
          {item.rightDescribeText}
        </p>
      ) : null}
    </div>
  );
};

export const CheckboxByApiValueComponent = ({ item, setValue, getValues }) => {
  useEffect(() => {
    setValue(item.registerName, "");
  }, []);

  const handleChange = (checked, value) => {
    const currentValue = getValues(item.registerName) || "";
    const valueArray = currentValue ?
      currentValue.split(",").filter(v => v) :
      [];

    if (checked) {
      // 如果勾選，加入值
      if (!valueArray.includes(value)) {
        valueArray.push(value);
      }
    } else {
      // 如果取消勾選，移除值
      const index = valueArray.indexOf(value);

      if (index > -1) {
        valueArray.splice(index, 1);
      }
    }

    // 更新值
    setValue(item.registerName, valueArray.join(","), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 檢查是否已勾選
  const isChecked = value => {
    const currentValue = getValues(item.registerName) || "";

    return currentValue.split(",").includes(value);
  };

  return (
    <div className="d-flex flex-column gap-2">
      {item.checkBoxItems.map((checkBoxItem, index) => (
        <div key={index} className="d-flex align-items-center gap-1">
          <input
            className="form-check-input"
            type="checkbox"
            defaultChecked={isChecked(checkBoxItem.value)}
            onChange={e => handleChange(e.target.checked, checkBoxItem.value)}
          />
          <label className="form-label" htmlFor={item.registerName}>
            <p style={{ marginBottom: "0px", marginTop: "8px" }}>
              {checkBoxItem.label}
            </p>
          </label>
        </div>
      ))}
    </div>
  );
};

export const CheckboxComponent = ({ item, register, watch }) => (
  <div className={`d-flex ${item.checkBoxItemsDirection === "column" ? "flex-column" : "flex-row"} gap-2`}>
    {item.checkBoxItems.map((checkBoxItem, index) => (
      <div key={index} className="d-flex align-items-center gap-1">
        <input
          className="form-check-input"
          style={{ marginBottom: "2px" }}
          type="checkbox"
          value={checkBoxItem.value}
          checked={watch(item.registerName) === checkBoxItem.value}
          {...register(item.registerName, {
            onChange: e =>
              e.target.checked ? checkBoxItem.value : ""
          })}
        />
        <label className="form-label" htmlFor={item.registerName}>
          <p style={{ marginBottom: "0px", marginTop: "10px" }}>
            {checkBoxItem.label}
          </p>
        </label>
      </div>
    ))}
  </div>
);

export const TextComponent = ({ item, register, style, divFullWidth, disabled }) => (
  <div className="d-flex align-items-center" style={divFullWidth ? { width: "100%" } : {}}>
    {item.leftDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.leftDescribeTextWidth,
        }}
      >
        {item.leftDescribeText}
      </p>
    ) : null}
    <input
      className="form-control"
      type={item.inputType}
      name={item.registerName}
      placeholder={item.placeholder}
      defaultValue={item.defaultValue}
      disabled={item.disabled || disabled}
      style={style ? style : item.style}
      {...register(item.registerName)}
    />
    {item.hintUnit && (
      <div
        className="d-flex justify-content-center text-center"
        style={{
          margin: "0px",
          backgroundColor: "gray",
          padding: "6px 15px",
          borderRadius: "0px 5px 5px 0px",
          color: "white",
          minWidth: `${item.hintUnit.length * 30}px`,
        }}
      >
        {item.hintUnit}
      </div>
    )}
    {item.rightDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.rightDescribeTextWidth,
        }}
      >
        {item.rightDescribeText}
      </p>
    ) : null}
  </div>
);

export const PasswordComponent = ({ item, register, style, divFullWidth, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="d-flex align-items-center" style={divFullWidth ? { width: "100%" } : {}}>
      {item.leftDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.leftDescribeTextWidth,
          }}
        >
          {item.leftDescribeText}
        </p>
      ) : null}
      <div className="position-relative d-flex align-items-center" style={divFullWidth ? { width: "100%" } : {}}>
        <input
          className="form-control"
          type={showPassword ? "text" : "password"}
          name={item.registerName}
          placeholder={item.placeholder}
          defaultValue={item.defaultValue}
          disabled={item.disabled || disabled}
          style={{
            paddingRight: "30px",
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
            "::-ms-reveal": { display: "none" },
            "::-ms-clear": { display: "none" },
            ...style ? style : item.style
          }}
          {...register(item.registerName)}
        />
        <button
          type="button"
          tabIndex="-1"
          className="btn btn-link position-absolute"
          style={{
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "0",
            border: "none",
            background: "transparent"
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      {item.hintUnit && (
        <div
          className="d-flex justify-content-center text-center"
          style={{
            margin: "0px",
            backgroundColor: "gray",
            padding: "6px 15px",
            borderRadius: "0px 5px 5px 0px",
            color: "white",
            minWidth: `${item.hintUnit.length * 30}px`,
          }}
        >
          {item.hintUnit}
        </div>
      )}
      {item.rightDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.rightDescribeTextWidth,
          }}
        >
          {item.rightDescribeText}
        </p>
      ) : null}
    </div>
  );
};

export const MultipleDateComponent = ({ item, register, setValue, watch, divFullWidth }) => {
  const formData = watch(item.timeRegisterName) || [{ start_date: "", end_date: "" }];

  const calculateTotalHours = (start, end) => {
    if (!start || !end) {
      return 0;
    }

    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    let totalMinutes = endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    return (totalMinutes / 60).toFixed(1);
  };

  const handleDateChange = (value, index, field) => {
    const newData = [...formData];

    newData[index] = {
      ...newData[index],
      [field]: value,
    };

    // 先更新表单值
    setValue(item.timeRegisterName, newData, { shouldValidate: true });

    // 使用更新后的 newData 来计算总时数
    const totalHours = newData.reduce((acc, curr) => {
      if (curr.start_date && curr.end_date) {
        return acc + Number(calculateTotalHours(curr.start_date, curr.end_date));
      }
      return acc;
    }, 0);

    // 设置总时数
    setValue(item.totalHourRegisterName, totalHours.toFixed(1), { shouldValidate: true });
  };

  const handleAddDate = () => {
    if (formData.length < item.maxDate) {
      const newData = [...formData, { start_date: "", end_date: "" }];

      setValue(item.timeRegisterName, newData, { shouldValidate: true });
    }
  };

  const handleRemoveDate = index => {
    if (formData.length > 1) {
      const newData = formData.filter((_, i) => i !== index);

      setValue(item.timeRegisterName, newData, { shouldValidate: true });

      // 使用更新后的 newData 来计算总时数
      const totalHours = newData.reduce((acc, curr) => {
        if (curr.start_date && curr.end_date) {
          return acc + Number(calculateTotalHours(curr.start_date, curr.end_date));
        }
        return acc;
      }, 0);

      setValue(item.totalHourRegisterName, totalHours.toFixed(1), { shouldValidate: true });
    }
  };

  return (
    <div className="d-flex flex-column gap-4" style={{ width: divFullWidth ? "100%" : item.divFullWidth ? "100%" : undefined }}>
      {formData?.length < item.maxDate && (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          style={{ maxWidth: "200px" }}
          onClick={handleAddDate}
        >
          新增時間
        </button>
      )}
      {formData?.map((dateRange, index) => (
        <div key={index} className="d-flex align-items-center gap-2">
          <input
            className="form-control"
            type="time"
            placeholder="起始日期"
            {...register(`${item.timeRegisterName}.${index}.start_date`, { onChange: e => handleDateChange(e.target.value, index, "start_date") })}
          />
          <span>至</span>
          <input
            className="form-control"
            type="time"
            placeholder="結束日期"
            {...register(`${item.timeRegisterName}.${index}.end_date`, { onChange: e => handleDateChange(e.target.value, index, "end_date") })}
            min={dateRange.start_date}
          />
          {formData?.length > 1 && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => handleRemoveDate(index)}
            >
              <i className="fa fa-trash"></i>
            </button>
          )}
        </div>
      ))}
      {formData?.length >= item.maxDate && (
        <small className="text-danger">
          已達到最大數量限制 ({item.maxDate} 筆)
        </small>
      )}
      <TextComponent
        item={{
          inputType: "text",
          registerName: item.totalHourRegisterName,
          hintUnit: "小時",
          placeholder: "輸入總時數",
          leftDescribeText: item.leftDescribeText,
          leftDescribeTextWidth: item.leftDescribeTextWidth,
          disabled: true,
        }}
        style={{ backgroundColor: "#e8f0fe" }}
        register={register}
      />
    </div>
  );
};

export const SingleMultipleDateComponent = ({
  item,
  register,
  setValue,
  watch,
}) => {
  const formData = watch(item.timeRegisterName, value => {
    if (value?.start_date && value?.end_date) {
      setValue(
        item.totalHourRegisterName,
        calculateTotalHours(value.start_date, value.end_date)
      );
    }
  });

  const calculateTotalHours = (start, end) => {
    if (!start || !end) {
      return 0;
    }

    // 解析時間字符串
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    // 計算總分鐘數
    let totalMinutes =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);

    // 如果結束時間小於開始時間，表示跨日，加上24小時
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    // 轉換為小時，並保留一位小數
    return (totalMinutes / 60).toFixed(1);
  };

  const handleDateChange = value => {
    setValue(item.timeRegisterName, value);
  };

  useEffect(() => {
    setValue(item.timeRegisterName, formData);
    // 計算總時數
    const totalHours =
      formData.start_date && formData.end_date ?
        calculateTotalHours(formData.start_date, formData.end_date) :
        0;

    setValue(item.totalHourRegisterName, totalHours);
  }, [formData]);

  return (
    <div className="d-flex gap-2">
      <div className="d-flex align-items-center gap-2">
        <input
          className="form-control"
          type="time"
          placeholder="起始時間"
          onChange={e => handleDateChange(e.target.value, "start_date")}
          {...register(`${item.timeRegisterName}.start_date`)}
        />
        <span>至</span>
        <input
          className="form-control"
          type="time"
          placeholder="結束時間"
          min={formData.start_date}
          onChange={e => handleDateChange(e.target.value, "end_date")}
          {...register(`${item.timeRegisterName}.end_date`)}
        />
      </div>
      <TextComponent
        item={{
          inputType: "text",
          registerName: item.totalHourRegisterName,
          placeholder: "選取後自動計算",
          leftDescribeText: item.leftDescribeText,
          leftDescribeTextWidth: item.leftDescribeTextWidth,
          rightDescribeText: item.rightDescribeText,
          rightDescribeTextWidth: item.rightDescribeTextWidth,
          disabled: true,
          hintUnit: "小時",
        }}
        style={{ backgroundColor: "#e8f0fe" }}
        register={register}
      />
    </div>
  );
};

export const NumberComponent = ({
  item,
  register,
  style,
  defaultValue = 0,
  disabled,
}) => (
  <div className="d-flex align-items-center">
    {item.leftDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.leftDescribeTextWidth,
        }}
      >
        {item.leftDescribeText}
      </p>
    ) : null}
    {item.leftHintUnit && <span style={{ backgroundColor: "gray", padding: "6px 20px", borderRadius: "5px 0px 0px 5px", color: "white" }}>{item.leftHintUnit}</span>}
    <input
      className="form-control"
      type={item.inputType}
      name={item.registerName}
      placeholder={item.placeholder}
      defaultValue={defaultValue}
      disabled={disabled}
      {...register(item.registerName)}
      style={style}
      onChange={e => {
        const value = parseInt(e.target.value);

        if (value < 0) {
          e.target.value = 0;
        }
      }}
    />
    {item.hintUnit && (
      <div
        className="d-flex justify-content-center text-center"
        style={{
          margin: "0px",
          backgroundColor: "gray",
          padding: "6px 15px",
          borderRadius: "0px 5px 5px 0px",
          color: "white",
          minWidth: `${item.hintUnit.length * 30}px`,
        }}
      >
        {item.hintUnit}
      </div>
    )}
    {item.rightDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.rightDescribeTextWidth,
        }}
      >
        {item.rightDescribeText}
      </p>
    ) : null}
  </div>
);

export const SelectComponent = ({ item, register, setValue, watch, divFullWidth, disabled }) => {
  useEffect(() => {
    if (item.defaultValue) {
      setValue(item.registerName, item.defaultValue);
    }
  }, [item.options]);

  return (
    <div className="d-flex align-items-center" style={item.style ? item.style : divFullWidth ? { width: "100%" } : {}}>
      {item.leftDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.leftDescribeTextWidth,
          }}
        >
          {item.leftDescribeText}
        </p>
      ) : null}
      <select
        className="form-control"
        defaultValue={""}
        name={item.registerName}
        value={watch(item.registerName)}
        disabled={
          disabled ||
          item.disabled ||
          item.watchRegisterName ?
            watch(item.watchRegisterName) !== item.watchValue :
            false
        }
        style={
          item.watchRegisterName ?
            (watch(item.watchRegisterName) !== item.watchValue) ?
              { opacity: "0.5", backgroundColor: "#f5f7fa" } :
              undefined :
            watch(item.registerName) === "" ?
              { fontWeight: "300" } :
              undefined
        }
        {...register(item.registerName)}
      >
        <option value="">{item.placeholder ? item.placeholder : `請選擇${item.labelName}`}</option>
        {item.options?.map((option, index) => (
          <option
            key={index}
            value={option[item.valueKey || "value"]}
            disabled={option.status == false}
            style={option.status == false ? {
              color: "#888888",
              backgroundColor: "#e9e9e9",
              fontWeight: "normal",
              opacity: "0.6"
            } : {}}>
            {option[item.labelKey || "label"]}
          </option>
        ))}
      </select>
      {item.rightDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.rightDescribeTextWidth,
          }}
        >
          {item.rightDescribeText}
        </p>
      ) : null}
    </div>
  );
};

// 使用此組件需 npm i react-select
// 僅能選擇一個值
export const SearchableDropdown = ({ item, control, divFullWidth }) => (
  <div className="d-flex align-items-center" style={item.style ? item.style : divFullWidth ? { width: "100%" } : {}}>
    {item.leftDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.leftDescribeTextWidth,
        }}
      >
        {item.leftDescribeText}
      </p>
    ) : null}
    <SearchableSelect
      registerName={item.registerName}
      options={item.options}
      control={control}
      placeholder={item.placeholder}
    />
    {item.rightDescribeText ? (
      <p
        style={{
          margin: "0px 5px 0px 5px",
          minWidth: item.rightDescribeTextWidth,
        }}
      >
        {item.rightDescribeText}
      </p>
    ) : null}
  </div>
);

// 使用此組件需 npm i react-select
export const MultiSelectComponent = ({ item, watch, setValue, divFullWidth }) => {
  const currentValue = watch(item.registerName);

  const handleChange = selectedOptions => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];

    setValue(item.registerName, values);
  };

  // 將字串陣列轉換為 react-select 需要的物件陣列格式
  const getSelectedOptions = () => {
    console.log(currentValue);
    if (!currentValue || !Array.isArray(currentValue)) {
      return [];
    }

    return currentValue
      .map(value => {
        // 在 options 中尋找對應的選項
        const option = item.options?.find(opt => opt.value === value);

        return option || { label: value, value: value };
      })
      .filter(Boolean);
  };

  useEffect(() => {
    // 只在組件初始化時設定預設值
    if (item.defaultValue && !currentValue) {
      setValue(item.registerName, item.defaultValue);
    }
  }, []); // 移除依賴，避免無限循環

  return (
    <div className="d-flex align-items-center" style={item.style ? item.style : divFullWidth ? { width: "100%" } : {}}>
      {item.leftDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.leftDescribeTextWidth,
          }}
        >
          {item.leftDescribeText}
        </p>
      ) : null}
      <MultiSelect
        options={item.options || []}
        multiValue={getSelectedOptions()} // 使用 value 而不是 defaultValue
        onChange={handleChange}
        placeholder={`請選擇${item.labelName}`}
      />
      {item.rightDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.rightDescribeTextWidth,
          }}
        >
          {item.rightDescribeText}
        </p>
      ) : null}
    </div>
  );
};

export const DisabledUntilWatchValueSelectComponent = ({ item, register, watch, divFullWidth, disabled }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchDropdown = async () => {
      if (watch(item.watchRegisterName)) {
        const response = await item.dropdownAPI(watch(item.watchRegisterName));

        setOptions(response.data.map(i => ({
          label: i[item.labelKey || "label"],
          value: i[item.valueKey || "value"]
        })));
      }
    };

    if (item.watchRegisterName) {
      fetchDropdown();
    }
  }, [watch(item.watchRegisterName)]);

  const isDisabled = disabled ||
    !watch(item.watchRegisterName) ||
    watch(item.watchRegisterName) === "";

  return (
    <div className="d-flex align-items-center" style={item.style ? item.style : divFullWidth ? { width: "100%" } : {}}>
      {item.leftDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.leftDescribeTextWidth,
          }}
        >
          {item.leftDescribeText}
        </p>
      ) : null}
      <select
        className="form-control"
        defaultValue={""}
        name={item.registerName}
        value={watch(item.registerName)}
        disabled={isDisabled}
        style={
          isDisabled ?
            { opacity: "0.5", backgroundColor: "#f5f7fa" } :
            { fontWeight: "300" }
        }
        {...register(item.registerName)}
      >
        <option value="">{item.placeholder ? item.placeholder : `請選擇${item.labelName}`}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {item.rightDescribeText ? (
        <p
          style={{
            margin: "0px 5px 0px 5px",
            minWidth: item.rightDescribeTextWidth,
          }}
        >
          {item.rightDescribeText}
        </p>
      ) : null}
    </div>
  );
};

export const YesNoRadioComponent = ({ item, register, yValue, nValue, disabled, watch, setValue, hasOther, defaultCheckedFalse, defaultCheckedTrue }) => (
  <div className={`d-flex align-items-${item.labelDivAlignDirection ? item.labelDivAlignDirection : "center"} gap-2`} key={item.registerName}>
    <input
      className="form-check-input"
      type="radio"
      name={item.registerName}
      value={yValue}
      disabled={item.disabled || disabled}
      checked={watch(item.registerName) === yValue}
      onChange={() => setValue(item.registerName, yValue)}
    />
    <span>是</span>
    <input
      className="form-check-input"
      type="radio"
      name={item.registerName}
      value={nValue}
      disabled={item.disabled || disabled}
      defaultChecked={defaultCheckedFalse}
      checked={watch(item.registerName) === nValue}
      onChange={() => setValue(item.registerName, nValue)}
    />
    <span>否</span>
    {hasOther && (
      <TextComponent item={{ inputType: "text", registerName: item.otherRegisterName, placeholder: item.placeholder }} register={register} />
    )}
  </div>
);

export const VerificationCodeComponent = ({ item, register, divFullWidth }) => (
  <div className="d-flex flex-column align-items-center" style={divFullWidth ? { width: "100%" } : {}}>
    <input className="form-control" type="text" name="verificationCode" placeholder="請輸入驗證碼" {...register(item.registerName)} />
    <Captcha
      generateAPI={item.generateImageAPI}
      captchaSrc={item.captchaSrc}
      imgWidth={item.imgWidth}
      imgHeight={item.imgHeight}
      disableRefreshTime={item.disableRefreshTime}
      refreshTime={item.refreshTime}
    />
  </div>
);

export const UploadFileComponent = ({ item, setValue, register, registerName }) => {
  const handleUploadFile = async e => {
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

    setValue(registerName, e.target.files[0]);
  };

  return (
    <input type="file" className="form-control" onChange={e => handleUploadFile(e)} {...register(item.registerName)} />
  );
};