import { useState } from "react";
import { useParams } from "react-router-dom";
import { tugasSiswa } from "../../data/tugasSiswa";
import { pengumpulanTugas } from "../../data/pengumpulanTugas";

import FileUploadBox from "../../components/tugas-submit/FileUploadBoxSiswa";
import PopupSuccess from "../../components/common/PopupSuccess";
import Button from "../../components/common/Button";
import CommentInput from "../../components/common/CommentInput";
import Card from "../../components/common/Card";

import TaskIcon from "../../assets/icons/Task.svg";
import FileIcon from "../../assets/icons/File.svg";
import EyeIcon from "../../assets/icons/Eyes.svg";
import DownloadIcon from "../../assets/icons/Download.svg";
import CloseIcon from "../../assets/icons/Close.svg";

export default function TugasSubmit() {
  const { id } = useParams();
  // State hooks must be defined unconditionally at the top of the component

  let data = tugasSiswa.items.find((t) => t.id === Number(id));

  // Fallbacks: support demo ids (like "demo-1") and guard against missing data
  if (!data) {
    if (typeof id === "string" && id.startsWith("demo-")) {
      // create a small demo task to match the demo items used in the dashboard
      data = {
        id,
        judul:
          id === "demo-1"
            ? "Latihan Soal Matematika - Bilangan"
            : "Ringkasan Materi Sejarah - Peristiwa Penting",
        deskripsi:
          "Ini adalah tugas contoh untuk tujuan demo. Silakan unggah file dan coba fitur pengumpulan.",
        kelas: "Kelas 8A",
        deadlineLabel:
          id === "demo-1" ? "Deadline: 10 Des 2025" : "Deadline: 15 Des 2025",
      };
    } else {
      // If the task truly doesn't exist, render a friendly message instead of throwing
      return (
        <div className="w-full flex justify-center px-4 py-6">
          <div className="max-w-[900px] w-full bg-white rounded p-6 shadow">
            <h2 className="text-xl font-bold">Tugas tidak ditemukan</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tugas yang Anda minta tidak tersedia.
            </p>
          </div>
        </div>
      );
    }
  }

  const pengumpulan = pengumpulanTugas.find(
    (p) => String(p.tugasId) === String(data.id)
  ) || { komentar: [], nilai: null };

  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!file) return;
    setSubmitted(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2500);
  };

  const handleCancel = () => setSubmitted(false);
  const handleRemoveFile = () => {
    setFile(null);
    setSubmitted(false);
  };

  const handlePreview = () => window.open(URL.createObjectURL(file), "_blank");
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file?.name;
    link.click();
  };

  const sendComment = () => {
    if (!comment.trim()) return;
    pengumpulan.komentar.push({
      from: "siswa",
      text: comment,
      time: new Date().toLocaleString("id-ID"),
    });
    setComment("");
  };

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <Card variant="blue" size="lg" className="max-w-[1250px]">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <img src={TaskIcon} className="w-7 h-7" />
            <h2 className="text-xl font-bold text-black">{data.judul}</h2>
          </div>
          <p className="text-base text-black">
            Deadline: {data.deadlineLabel.replace("Deadline: ", "")}
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-start">
          {/* DESKRIPSI */}
          <div className="bg-white rounded-[10px] shadow p-5 text-black whitespace-pre-line text-sm">
            {data.deskripsi}
          </div>

          {/* PENGUMPULAN */}
          <div className="bg-white rounded-[10px] shadow p-5 text-black">
            <div className="flex justify-between items-center pb-3">
              <h3 className="font-bold">Pengumpulan tugas</h3>
              <span
                className={`font-semibold text-sm ${
                  pengumpulan?.nilai != null
                    ? "text-[#35C362]"
                    : submitted
                      ? "text-[#35C362]"
                      : "text-[#E78C00]"
                }`}
              >
                {pengumpulan?.nilai != null
                  ? `${pengumpulan.nilai} / 100`
                  : submitted
                    ? "Diserahkan"
                    : "Belum diserahkan"}
              </span>
            </div>

            {file && (
              <div className="mt-3 border rounded-[10px] p-3 flex justify-between items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={FileIcon} className="w-4" />
                  <p className="text-sm text-black truncate">{file.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handlePreview}>
                    <img src={EyeIcon} className="w-5" />
                  </button>
                  <button onClick={handleDownload}>
                    <img src={DownloadIcon} className="w-5" />
                  </button>
                  {!submitted && (
                    <button onClick={handleRemoveFile}>
                      <img src={CloseIcon} className="w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!submitted && <FileUploadBox file={file} setFile={setFile} />}

            <Button
              variant={submitted ? "outline" : "primary"}
              onClick={submitted ? handleCancel : handleSubmit}
              disabled={!file && !submitted}
              className="w-full mt-4"
            >
              {submitted ? "Batalkan Pengiriman" : "Kirim"}
            </Button>
          </div>
        </div>

        {/* KOMENTAR */}
        <div className="bg-white rounded-[20px] shadow p-4">
          <label className="font-semibold text-black text-base">Komentar</label>
          <div className="mt-3 max-h-[260px] overflow-y-auto space-y-3 pr-2">
            {pengumpulan.komentar.map((k, i) => (
              <div
                key={i}
                className={`max-w-[75%] p-3 text-sm rounded-[10px] ${
                  k.from === "siswa"
                    ? "bg-[#D8FFE1] ml-auto"
                    : "bg-[#D7E9FF] mr-auto"
                }`}
              >
                {k.text}
                <div className="text-[10px] opacity-60 mt-1">{k.time}</div>
              </div>
            ))}
          </div>

          <CommentInput
            value={comment}
            onChange={(v) => setComment(v)}
            onSend={sendComment}
            className="mt-3"
          />
        </div>
      </Card>

      {showPopup && <PopupSuccess />}
    </div>
  );
}
