import React from "react";

interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange, id }) => {
  return (
    <button
  id={id}
  role="switch"
  aria-checked={checked}
  onClick={(e) => {
    e.stopPropagation(); 
    onChange(!checked);
  }}
  className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out 
    ${checked ? "bg-neutral-800" : "bg-gray-300"}`}
>
  <span
    className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
      ${checked ? "translate-x-4" : "translate-x-0"}`}
  />
</button>
  );
};

export default CustomSwitch;
