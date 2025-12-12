/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function TugasBelumDinilai({ items = [] }) {
  const navigate = useNavigate();

  const hasItems = items.length > 0;

  const handleNilai = (tugasId, siswaId) => {
    navigate(`/tugas-guru/nilai/${tugasId}/${siswaId}`);
  };

  return (
    <section className="bg-[#E9F1FA] rounded-[20px] shadow-md w-full p-4 sm:p-5 h-[330px] group">
      {/* Title */}
      <div className="inline-flex flex-col mb-4">
        <span className="font-bold text-lg text-black">
          Tugas belum dinilai
        </span>
        <span className="mt-1 h-[2px] w-40 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* List */}
      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
        {hasItems ? (
          items.map((item, idx) => (
            <div
              key={`${item.tugas || idx}-${idx}`}
              className="bg-white text-black rounded-[10px] shadow grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-2 px-4 py-4 text-sm sm:text-base"
            >
              {/* If caller provided detailed fields use them, otherwise show tugas/count */}
              <span className="truncate font-semibold">
                {item.nama || item.tugas || "-"}
              </span>
              <span className="truncate">
                {item.kelas || (item.count ? `Belum: ${item.count}` : "-")}
              </span>
              <span className="truncate">{item.tugas || "-"}</span>
              <span className="truncate whitespace-nowrap">
                {item.deadline || "-"}
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleNilai(item.tugasId, item.siswaId)}
                className="px-3 py-1 text-xs sm:text-sm whitespace-nowrap rounded-md"
              >
                Nilai
              </Button>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 px-1">
            Belum ada tugas untuk dinilai saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
