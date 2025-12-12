import { useState } from "react";
import ArrowDown from "../../assets/icons/dropdown.svg";
import ArrowUp from "../../assets/icons/DropdownU.svg";

export default function DropdownKelasSiswa({ pilihan, selected, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[384px]">
      <button
        onClick={() => setOpen(!open)}
        className="dropdown-btn h-12 sm:h-14"
      >
        <span className="truncate">{selected}</span>
        <img
          src={open ? ArrowUp : ArrowDown}
          className={`dropdown-icon ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="dropdown-menu mt-1">
          {pilihan.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onSelect(p);
                setOpen(false);
              }}
              className="dropdown-item"
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
