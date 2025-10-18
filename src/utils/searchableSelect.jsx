import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const customStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    minHeight: "31px",
    width: "100%",
  }),
  option: (styles, { isDisabled, isSelected, isFocused }) => ({
    ...styles,
    backgroundColor: isDisabled ?
      undefined :
      isSelected ?
        "#7366ff" :
        isFocused ?
          "#f3f3f3" :
          undefined,
    color: isDisabled ?
      "#ccc" :
      isSelected ?
        "white" :
        "#333",
    cursor: isDisabled ? "not-allowed" : "pointer",
  }),
  multiValue: styles => ({
    ...styles,
    backgroundColor: "#e6f7ff",
  }),
  multiValueLabel: styles => ({
    ...styles,
    color: "#333",
  }),
  multiValueRemove: styles => ({
    ...styles,
    color: "#666",
    ":hover": {
      backgroundColor: "#ff4d4f",
      color: "white",
    },
  }),
};

export default function SearchableSelect({ registerName, options, control, placeholder }) {
  return (
    <Controller
      name={registerName}
      control={control}
      render={({ field }) => (
        <Select
          options={options}
          value={options.find(opt => opt.value === field.value)}
          onChange={opt => field.onChange(opt?.value ?? "")}
          isClearable
          styles={customStyles}
          placeholder={placeholder}
        />
      )}
    />
  );
}