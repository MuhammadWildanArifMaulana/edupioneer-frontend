import { useState } from "react";
import ArrowDown from "../../assets/icons/dropdown.svg";
import ArrowUp from "../../assets/icons/DropdownU.svg";

export default function Select({
  value,
  onChange,
  options = [],
  className = "",
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`dropdown-btn h-10 ${className}`}
      >
        {value}
        <img
          src={open ? ArrowUp : ArrowDown}
          className={`dropdown-icon ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Options */}
      {open && (
        <div className="dropdown-menu mt-1">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="dropdown-item"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
