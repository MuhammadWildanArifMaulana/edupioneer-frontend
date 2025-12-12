import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { materiKimiaXI } from "../../../data/materiKimiaXI";
import DropdownIcon from "../../../assets/icons/dropdown.svg";
import DropdownUpIcon from "../../../assets/icons/DropdownU.svg";
import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";

export default function MateriDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const materi = materiKimiaXI.find((kelas) => kelas.id === id);
  const [openTask, setOpenTask] = useState(null);

  if (!materi) return <p className="p-6">Materi tidak ditemukan</p>;

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="max-w-[1300px] w-full p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">{materi.namaKelas}</h2>
          <p className="text-lg text-black">{materi.guru}</p>
        </div>

        {/* LIST MATERI */}
        <div className="flex flex-col gap-10">
          {materi.list.map((m, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 bg-white p-4 rounded-[12px] shadow-md"
            >
              {/* JUDUL MATERI */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                <span className="text-lg font-bold">{m.judulMateri}</span>
              </label>

              {/* DESKRIPSI */}
              <p className="text-base whitespace-pre-line leading-relaxed">
                {m.deskripsi}
              </p>

              {/* PDF */}
              <div
                onClick={() => m.file_url && window.open(m.file_url, "_blank")}
                className="relative w-[230px] h-[194px] rounded-[10px] overflow-hidden shadow-md cursor-pointer hover:scale-[1.02] transition"
              >
                <img src={m.thumbnail} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full h-[39px] bg-[#6E6E6E] text-white text-xs sm:text-sm flex items-center px-3">
                  {m.fileName}
                </div>
              </div>

              {/* LIST TUGAS */}
              {Array.isArray(m.tugas) &&
                m.tugas.map((t, i) => {
                  const isOpen = openTask === `${m.id}-${i}`;
                  return (
                    <div
                      key={i}
                      className="bg-[#E9F1FA] rounded-[10px] shadow-md overflow-hidden"
                    >
                      {/* HEADER */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() =>
                          setOpenTask(isOpen ? null : `${m.id}-${i}`)
                        }
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span className="text-base font-semibold break-words">
                            {t.judul}
                          </span>
                        </label>

                        <img
                          src={isOpen ? DropdownUpIcon : DropdownIcon}
                          className="w-4 h-4 transition-transform duration-200"
                        />
                      </div>

                      {/* DROPDOWN */}
                      {isOpen && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 animate-slideDown">
                          <p className="text-sm whitespace-pre-line leading-relaxed mb-4 text-gray-700">
                            {t.deskripsi}
                          </p>

                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate(`/tugas/${t.id}`)}
                            className="w-fit"
                          >
                            Kumpulkan tugas
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
