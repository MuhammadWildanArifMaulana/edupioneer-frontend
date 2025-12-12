/* eslint-disable react/prop-types */
export default function SiswaBelumMengumpulkan({ items = [] }) {
  // Expect items like: { tugas: string, count: number }
  const hasItems = items.length > 0;

  return (
    <section className="bg-[#E9F1FA] rounded-[20px] shadow-md w-full p-4 sm:p-5 h-[243px] group">
      <div className="inline-flex flex-col mb-4">
        <span className="font-bold text-lg text-black truncate max-w-[260px] sm:max-w-full">
          Siswa yang belum mengumpulkan tugas
        </span>
        <span className="mt-1 h-[2px] w-52 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      <div className="overflow-hidden h-[160px]">
        <div className="space-y-3 h-full overflow-y-auto pr-4 scrollbar-thin">
          {hasItems ? (
            items.map((item, idx) => (
              <div
                key={`${item.tugas || idx}-${idx}`}
                className="bg-[#00ABE4] text-white rounded-[10px] shadow flex items-center justify-between px-3 py-2 text-sm sm:text-base gap-2"
              >
                <span className="truncate flex-1">
                  {item.tugas || "Tidak diketahui"}
                </span>
                <span className="truncate flex-1">
                  Belum: {item.count ?? 0}
                </span>
                <span className="font-semibold text-[#CC0000] whitespace-nowrap">
                  Belum mengumpulkan
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 px-1">
              Tidak ada siswa yang belum mengumpulkan.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
