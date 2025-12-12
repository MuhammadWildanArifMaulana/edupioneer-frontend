export default function KelasCard({ jumlahKelas = 0, onClick = null }) {
  const noClass = jumlahKelas === 0;

  return (
    <section className="w-full bg-[#E9F1FA] rounded-[20px] shadow-md p-4 md:p-5 mb-6 min-h-[135px]">
      {/* Title */}
      <div className="group inline-flex flex-col mb-4">
        <span className="font-bold text-lg text-black">Kelas</span>
        <span className="mt-1 h-[2px] w-20 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* Content */}
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick || undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onClick();
              }
            : undefined
        }
        className={`
          w-full h-[54px] rounded-[10px] shadow-md
          flex items-center justify-between px-5
          ${noClass ? "bg-[#00ABE4]" : "bg-[#00ABE4]"}
          ${onClick ? "cursor-pointer hover:opacity-95" : ""}
        `}
      >
        {noClass ? (
          <span className="text-white font-semibold text-base">
            Anda belum mengambil kelas
          </span>
        ) : (
          <>
            <span className="text-white font-bold text-base">Jumlah Kelas</span>
            <span className="text-white font-bold text-base">
              {String(jumlahKelas).padStart(2, "0")}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
