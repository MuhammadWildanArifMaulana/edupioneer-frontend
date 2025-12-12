import BookIcon from "../../assets/icons/Book.svg";
import TaskIcon from "../../assets/icons/Task.svg";

const defaultStats = [
  { id: 1, type: "materi", label: "Materi", jumlah: 2 },
  { id: 2, type: "tugas", label: "Tugas", jumlah: 1 },
];

export default function PoinKeaktifan({ totalKontribusi = 0, stats = defaultStats }) {
  return (
    <section className="w-full bg-[#E9F1FA] rounded-[20px] shadow-md p-4 md:p-5 mb-6">
      {/* Title */}
      <div className="group inline-flex flex-col mb-4">
        <span className="font-bold text-lg text-black">Poin Keaktifan</span>
        <span className="mt-1 h-[2px] w-28 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* Total kontribusi */}
      <div className="w-full h-[54px] bg-[#00ABE4] rounded-[10px] shadow-md flex items-center justify-between px-5 mb-4">
        <span className="text-white font-bold text-base">Total kontribusi</span>
        <span className="text-white font-bold text-base">
          {String(totalKontribusi).padStart(2, "0")}
        </span>
      </div>

      {/* Detail kategori */}
      <div className="w-full h-[183px] bg-white rounded-[10px] shadow-md p-3 md:p-4">
        {/* Header */}
        <div className="bg-[#BBD9FB] rounded-[10px] h-10 flex items-center justify-between px-4 mb-3">
          <span className="text-base font-medium text-black">Kategori</span>
          <span className="text-base font-medium text-black">Kontribusi</span>
        </div>

        {/* List kategori */}
        <div className="space-y-3">
          {stats.length > 0 ? (
            stats.map((row) => {
              const iconSrc = row.type === "materi" ? BookIcon : TaskIcon;
              return (
                <div
                  key={row.id}
                  className="flex items-center justify-between px-2 md:px-3 py-1.5"
                >
                  {/* icon + label */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-[15px] h-[30px] rounded-md bg-[#00ABE4]" />
                    <img src={iconSrc} alt={row.label} className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="text-sm md:text-base font-medium text-black">
                      {row.label}
                    </span>
                  </div>

                  {/* jumlah */}
                  <span className="text-sm md:text-base font-semibold text-black w-[40px] text-center">
                    {String(row.jumlah).padStart(2, "0")}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="text-center py-3 text-sm text-gray-500">
              Belum ada kontribusi.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}