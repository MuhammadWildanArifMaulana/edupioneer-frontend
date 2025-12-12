export default function NilaiTugasTerbaru({ nilai = [] }) {
  return (
    <section className="w-full bg-[#E9F1FA] rounded-[20px] shadow-md p-4 sm:p-5 mb-6 min-h-[240px]">
      {/* Title */}
      <div className="group inline-flex flex-col mb-4">
        <span className="text-lg font-bold text-black">Nilai tugas terbaru</span>
        <span className="mt-1 h-[2px] w-32 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* List nilai */}
      <div className="space-y-3 max-h-[165px] overflow-y-auto pr-2">
        {nilai.length > 0 ? (
          nilai.map((item, index) => (
            <div
              key={index}
              className="
                w-full bg-white rounded-[10px] shadow-md
                px-4 sm:px-5 py-3
                grid grid-cols-2 sm:grid-cols-5 gap-2
                text-sm sm:text-base text-black
              "
            >
              <span className="truncate">{item.nama}</span>
              <span className="truncate">{item.kelas}</span>
              <span className="truncate">{item.tugas}</span>
              <span className="truncate">{item.tanggal}</span>
              <span className="font-semibold truncate text-left sm:text-center">
                Nilai : {item.nilai}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center py-3 text-sm text-gray-500">
            Belum ada nilai tugas.
          </p>
        )}
      </div>
    </section>
  );
}
