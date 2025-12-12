export default function StatCard({ title, label, value, onClick }) {
  return (
    <section
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        bg-[#E9F1FA] rounded-[20px] shadow-md
        w-full h-[166px] p-4
        flex flex-col gap-4
        group transition
        ${onClick ? "cursor-pointer hover:scale-[1.01]" : ""}
      `}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {/* Title */}
      <div className="inline-flex flex-col">
        <span className="font-bold text-lg text-black">{title}</span>
        <span className="mt-1 h-[2px] w-32 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* Blue box */}
      <div
        className="
          bg-[#00ABE4] text-white
          rounded-xl shadow-md
          w-full h-[54px]
          flex items-center justify-between px-5
        "
      >
        <span className="font-bold text-base">{label}</span>
        <span className="font-bold text-lg">
          {String(value).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
