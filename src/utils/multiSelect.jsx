import React from "react";
import Select from "react-select";

const customStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    minHeight: "31px",
    minWidth: "400px",
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

export const MultiSelect = ({ options, multiValue, defaultValue, onChange, placeholder }) => (
  <Select
    closeMenuOnSelect={false}
    value={multiValue}
    defaultValue={defaultValue}
    isMulti
    options={options}
    styles={customStyles}
    onChange={onChange}
    placeholder={placeholder}
  />
);