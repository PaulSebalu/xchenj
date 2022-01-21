import React from "react";
import { components } from "react-select";

export const Placeholder = props => {
  return <components.Placeholder {...props} />;
};

export const reactSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #21ce99" : "1px solid #000000",
    marginBottom: "1rem",
  }),
};

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

export const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
  </div>
);