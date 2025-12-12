import { useState } from "react";
import TaskItem from "./TaskItemSiswa";
import ArrowDown from "../../assets/icons/dropdown.svg";
import ArrowUp from "../../assets/icons/DropdownU.svg";

export default function ListTugasSiswa({ title, items = [] }) {
  const [open, setOpen] = useState(false);
  const hasItems = items.length > 0;

  return (
    <div className="w-full flex justify-center">
      <section className="w-full max-w-[1038px]">
        {/* HEADER */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="list-panel-btn"
        >
          <span className="list-panel-title">{title}</span>
          <img
            src={open ? ArrowUp : ArrowDown}
            className={`list-panel-icon ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* LIST TUGAS */}
        {open && (
          <div className="mt-3 flex flex-col items-center gap-3 animate-slideDown">
            {hasItems ? (
              items.map((tugas) => <TaskItem key={tugas.id} tugas={tugas} />)
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 mt-2 px-1">
                Tidak ada tugas.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
