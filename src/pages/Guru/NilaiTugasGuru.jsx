import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { pengumpulanTugas } from "../../data/pengumpulanTugas";
import { tugasSiswa } from "../../data/tugasSiswa";

import TaskIcon from "../../assets/icons/Task.svg";
import EyeIcon from "../../assets/icons/Eyes.svg";
import DownloadIcon from "../../assets/icons/Download.svg";

import Button from "../../components/common/Button";
import CommentInput from "../../components/common/CommentInput";
import Card from "../../components/common/Card";

export default function NilaiTugasGuru() {
  const { tugasId, siswaId } = useParams();
  const navigate = useNavigate();

  const pengumpulan = pengumpulanTugas.find(
    (p) =>
      String(p.tugasId) === String(tugasId) &&
      String(p.siswaId) === String(siswaId)
  );
  const tugas = tugasSiswa.items.find((t) => String(t.id) === String(tugasId));

  const [komen, setKomen] = useState("");

  const sendComment = () => {
    if (!komen.trim()) return;
    pengumpulan.komentar.push({
      from: "guru",
      text: komen,
      time: new Date().toLocaleString("id-ID"),
    });
    setKomen("");
  };

  const isLate = pengumpulan.statusPengumpulanLabel
    ?.toLowerCase()
    .includes("terlambat");

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <Card variant="blue" size="md" className="w-full max-w-[1250px]">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <img src={TaskIcon} className="w-7 h-7" />
            <h2 className="text-xl font-bold text-black">{tugas.judul}</h2>
          </div>
          <p className="text-base text-black">{tugas.deadlineLabel || ""}</p>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
          {/* DESKRIPSI */}
          <div className="bg-white rounded-[10px] shadow p-5 text-black leading-relaxed whitespace-pre-line text-sm">
            {tugas.deskripsi}
          </div>

          {/* PENGUMPULAN */}
          <div className="bg-white rounded-[10px] shadow p-5 text-black">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Pengumpulan tugas</h3>

              <span
                className={`text-sm font-semibold ${
                  pengumpulan.nilai != null
                    ? "text-[#35C362]"
                    : isLate
                      ? "text-red-500"
                      : "text-green-600"
                }`}
              >
                {pengumpulan.nilai != null
                  ? `${pengumpulan.nilai} / 100`
                  : pengumpulan.statusPengumpulanLabel || pengumpulan.status}
              </span>
            </div>

            {/* FILE */}
            <div className="mt-3 border rounded-[10px] p-3 flex justify-between items-center gap-3">
              <p className="text-sm text-black truncate">
                {pengumpulan.fileName}
              </p>
              <div className="flex items-center gap-3">
                <button>
                  <img src={EyeIcon} className="w-5" />
                </button>
                <button>
                  <img src={DownloadIcon} className="w-5" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="primary"
              onClick={() =>
                navigate(
                  `/tugas-guru/nilai/${pengumpulan.tugasId}/${pengumpulan.siswaId}/detail`
                )
              }
              className="w-full mt-4"
            >
              Nilai tugas
            </Button>
          </div>
        </div>

        {/* KOMENTAR */}
        <Card variant="white" size="md" className="p-4">
          <label className="font-semibold text-black text-base">Komentar</label>

          <div className="mt-3 max-h-[260px] overflow-y-auto space-y-3 pr-2">
            {(pengumpulan.komentar || []).map((k, i) => (
              <div
                key={i}
                className={`max-w-[75%] p-3 text-sm rounded-[10px] ${
                  k.from === "guru"
                    ? "bg-[#D7E9FF] ml-auto"
                    : "bg-[#D8FFE1] mr-auto"
                }`}
              >
                {k.text}
                <div className="text-[10px] opacity-60 mt-1">{k.time}</div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <CommentInput
            value={komen}
            onChange={(v) => setKomen(v)}
            onSend={sendComment}
            className="mt-3"
          />
        </Card>
      </Card>
    </div>
  );
}
