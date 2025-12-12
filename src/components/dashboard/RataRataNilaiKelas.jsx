/* eslint-disable react/prop-types */
export default function RataRataNilaiKelas({ items = [] }) {
  const hasItems = items.length > 0;

  return (
    <section className="bg-[#E9F1FA] rounded-[20px] shadow-md w-full p-4 sm:p-5 h-[243px] group">
      {/* Title */}
      <div className="inline-flex flex-col mb-4">
        <span className="font-bold text-lg text-black">
          Rata‑rata nilai kelas
        </span>
        <span className="mt-1 h-[2px] w-36 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* List nilai (uses backend fields like mapel_nama / nilai) */}
      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2">
        {hasItems ? (
          items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="w-full h-[41px] bg-[#00ABE4] text-white rounded-[10px] shadow flex items-center justify-between px-4 text-sm sm:text-base"
            >
              <span className="truncate">
                {item.mapel_nama || item.kelas || "Tidak tersedia"}
              </span>
              <span className="font-semibold">{item.nilai ?? "-"}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 px-1">
            Belum ada nilai untuk saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
