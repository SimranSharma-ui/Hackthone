import React from "react";
import "./FloatingInput.css";

export default function FloatingInput({
  label,
  type = "text",
  name,
  value,
  onChange,
}) {
  return (
    <div className="floating-input">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
      <label className="bg-inherit">{label}</label>
    </div>
  );
}

