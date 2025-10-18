import { Check, Eye, EyeOff, PlusCircle, X } from "react-feather";
import { CheckboxByApiValueComponent, CheckboxComponent, DateComponent, DisabledUntilWatchValueSelectComponent, ItemsValueComponent, MultipleDateComponent, MultiSelectComponent, NumberComponent, PasswordComponent, RadioComponent, SearchableDropdown, SelectComponent, SingleMultipleDateComponent, TextareaComponent, TextComponent, UploadFileComponent, VerificationCodeComponent, YesNoRadioComponent } from "./inputTypeComponents";
import { Fragment, useState } from "react";
import UploadImage from "../components/common/uploadImage";
import { SelectedLabelTextComponent } from "./formBuilderUtils";
import { toast } from "react-toastify";

export function generateBySubItem({ item, register, watch, control, getValues, setValue, disabled, divFullWidth, checkBoxItems, defaultToday, selectDropdowns }) {
  return item.subItem.map(subItem => (
    <div className="d-flex align-items-center gap-2" key={subItem.registerName} style={{ width: divFullWidth ? "100%" : item.divFullWidth ? "100%" : undefined }}>
      {generateByInputType({
        item: subItem,
        register: register,
        watch: watch,
        control: control,
        getValues: getValues,
        setValue: setValue,
        disabled: disabled,
        divFullWidth: divFullWidth,
        checkBoxItems: checkBoxItems,
        defaultToday: defaultToday,
        selectDropdowns: selectDropdowns,
      })}
    </div>
  ));
}

export function LabelComponent({ item, minWidth = "80px", minHeight = "40px" }) {
  return (
    <label className="form-label d-flex align-items-start" style={{ marginBottom: "0px", marginLeft: "5px" }} htmlFor={item.registerName}>
      <div className="d-flex gap-1" style={{ minWidth: minWidth, minHeight: minHeight, maxWidth: item.labelMaxWidth }}>
        <div className="d-flex align-items-center" style={{ minWidth: minWidth, minHeight: minHeight }}>
          {item.validateKey && <div className="d-flex align-items-start text-danger" style={{ marginBottom: "0px" }}>*</div>}
          {item.labelName}
        </div>
      </div>
    </label>
  );
}

export function generateByInputType({ item, register, watch, getValues, control, setValue, disabled, divFullWidth, checkBoxItems, defaultToday, selectDropdowns }) {
  switch (item.inputType) {
    case "value":
      return <ItemsValueComponent item={item} watch={watch} />;
    case "textarea":
      return <TextareaComponent item={item} register={register} divFullWidth={divFullWidth} disabled={disabled} />;
    case "radio":
      return <RadioComponent item={item} register={register} setValue={setValue} watch={watch} disabled={disabled} />;
    case "yesNoRadio":
      return <YesNoRadioComponent
        item={item}
        register={register}
        setValue={setValue}
        yValue={item.yValue}
        nValue={item.nValue}
        watch={watch}
        disabled={disabled}
        defaultCheckedFalse={item.defaultCheckedFalse}
        defaultCheckedTrue={item.defaultCheckedTrue}
        hasOther={item.hasOther}
        otherRegisterName={item.otherRegisterName}
        placeholder={item.placeholder}
      />;
    case "checkboxByApiValue":
      return <CheckboxByApiValueComponent
        item={{ ...item, checkBoxItems: checkBoxItems || [] }}
        register={register}
        getValues={getValues}
        setValue={setValue}
        disabled={disabled}
      />;
    case "multiSelect":
      return <MultiSelectComponent
        item={{ ...item, options: item.options || selectDropdowns?.[item.registerName] || [] }}
        setValue={setValue}
        watch={watch}
        divFullWidth={divFullWidth}
      />;
    case "selectedLabelAndText":
      return <SelectedLabelTextComponent
        item={{ ...item, labelSelectItems: selectDropdowns?.[item.labelRegisterName] || item.labelSelectItems || [] }}
        register={register}
        watch={watch}
        disabled={disabled}
        divFullWidth={divFullWidth}
      />;
    case "watchSelect":
      return <DisabledUntilWatchValueSelectComponent
        item={item}
        register={register}
        watch={watch}
        disabled={disabled}
        divFullWidth={divFullWidth}
      />;
    case "checkbox":
      return <CheckboxComponent item={item} register={register} watch={watch} disabled={disabled} />;
    case "text":
      return <TextComponent item={{ ...item, inputType: "text" }} register={register} divFullWidth={divFullWidth} disabled={disabled} />;
    case "password":
      return <PasswordComponent item={{ ...item, inputType: "password" }} register={register} divFullWidth={divFullWidth} disabled={disabled} />;
    case "file":
      return (
        <UploadImage
          fieldName={item.registerName}
          imgParamName={item.imgParamName}
          watch={watch}
          getValues={getValues}
          originImageArray={watch(item.imgParamName)} //若列表要顯示圖片，則需要將圖片url放入originImageArray ex: row.imgURL
          disabled={disabled}
          setValue={setValue}
          minLength={item.minLength}
          maxLength={item.maxLength}
          limitSize={item.limitSize}
          limitTypeArray={item.limitTypeArray}
        />
      );
    case "reviewFile":
      return (
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="d-flex align-items-center btn btn-sm btn-primary"
            style={{ padding: "2px 10px", height: "30px" }}
            href={watch(item.registerName) ? watch(item.registerName) : ""}
            onClick={() => {
              if (watch(item.registerName) == "" || watch(item.registerName) == null) {
                toast.error("無檔案可檢視");
              }
            }}
            target="_blank" rel="noreferrer">
            檢視
          </button>
        </div>
      );
    case "date":
      return <DateComponent item={item} register={register} getValues={getValues} setValue={setValue} disabled={disabled} defaultToday={defaultToday} />;
    case "datetime-local":
      return <DateComponent item={item} register={register} getValues={getValues} setValue={setValue} disabled={disabled} defaultToday={defaultToday} />;
    case "multipleDate":
      return <MultipleDateComponent item={item} register={register} getValues={getValues} setValue={setValue} watch={watch} disabled={disabled} divFullWidth={divFullWidth} />;
    case "singleMultipleDate":
      return <SingleMultipleDateComponent item={item} register={register} getValues={getValues} setValue={setValue} watch={watch} disabled={disabled} />;
    case "select":
      return <SelectComponent
        item={{ ...item, options: item.options || selectDropdowns?.[item.registerName] || [] }}
        register={register}
        setValue={setValue}
        watch={watch}
        divFullWidth={divFullWidth}
        disabled={disabled}
      />;
    case "searchableSelect":
      return <SearchableDropdown
        item={{ ...item, options: item.options || selectDropdowns?.[item.registerName] || [] }}
        control={control}
        divFullWidth={divFullWidth}
      />;
    case "number":
      return <NumberComponent item={item} register={register} style={{ minWidth: "20px", textAlign: "center" }} defaultValue={0} disabled={disabled}/>;
    case "verificationCode":
      return <VerificationCodeComponent item={item} register={register} divFullWidth={divFullWidth}/>;
    case "hr":
      return (
        <div
          style={{
            height: "3px",
            width: "100%",
            border: "none",
            borderRadius: "2px",
            margin: "5px 0",
            background: "linear-gradient(90deg, #4e6fae 0%,rgb(137, 167, 226) 100%)",
            opacity: 0.7,
          }}
        />
      );
    case "iconByBoolean":
      return <div className="d-flex align-items-center">{watch(item.registerName) ? <Check color="green" size={16} /> : <X color="red" size={16} />}</div>;
    case "children":
      // 支援自定義 JSX 元素，並傳遞必要的 props
      if (typeof item.element === "function") {
        // 如果 element 是函數組件，傳遞 props
        return item.element({
          register,
          watch,
          getValues,
          setValue,
          disabled,
          divFullWidth,
          control
        });
      } else {
        // 如果 element 是 JSX 元素，直接渲染
        return item.element;
      }
    case "uploadFile":
      return <UploadFileComponent item={item} setValue={setValue} register={register} registerName={item.registerName} />;
  }
}

export function TitleComponent({ title, showAddBtn, handleAdd, defaultHidden = false, children, backgroundColor = "#526480", childrenMargin = "5px" }) {
  const [isHidden, setIsHidden] = useState(defaultHidden);

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center" style={{ padding: "2px 10px", backgroundColor: backgroundColor, borderRadius: "5px" }}>
        <div className="d-flex align-items-center gap-2">
          <h4 style={{ fontSize: "14px", color: "white" }}>{title}</h4>
          {showAddBtn && <a style={{ cursor: "pointer", padding: "10px", color: "white", marginTop: "2px" }} onClick={handleAdd}><PlusCircle size={16} /></a>}
        </div>
        <div className="d-flex align-items-center gap-2">
          <a style={{ cursor: "pointer", padding: "10px", color: "white", marginTop: "2px" }} onClick={() => setIsHidden(!isHidden)}>{isHidden ? <EyeOff size={16} /> : <Eye size={16} />}</a>
        </div>
      </div>
      <div className="d-flex flex-column" style={{ margin: childrenMargin }}>
        {isHidden ? null : children}
      </div>
    </Fragment>
  );
}