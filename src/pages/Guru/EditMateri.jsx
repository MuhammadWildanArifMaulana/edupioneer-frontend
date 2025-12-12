import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { materiApi } from "../../api/index";

import PlusIcon from "../../assets/icons/Plus.svg";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function EditMateri() {
  const { id, materiId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [materi, setMateri] = useState(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileBaru, setFileBaru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await materiApi.getById(materiId);
        const data = res.data?.data || {};
        setMateri(data);
        setJudul(data.judul || data.judulMateri || "");
        setDeskripsi(data.deskripsi || "");
      } catch (err) {
        console.error("Fetch materi error:", err);
        addToast("Gagal memuat data materi", { type: "error" });
        navigate(`/kelas-guru/${id}`);
      } finally {
        setLoading(false);
      }
    };

    if (materiId) {
      fetchMateri();
    }
  }, [materiId]);

  const handleUpload = (e) => {
    setFileBaru(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      if (fileBaru) {
        formData.append("file", fileBaru);
      }

      await materiApi.update(materiId, formData);
      addToast("Materi berhasil diperbarui!", { type: "success" });
      setTimeout(() => navigate(`/kelas-guru/${id}`), 1500);
    } catch (err) {
      console.error("Update materi error:", err);
      addToast("Gagal menyimpan perubahan", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (!materi)
    return (
      <div className="p-6 text-center text-gray-500">
        Materi tidak ditemukan
      </div>
    );

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">Edit Materi</h2>

        {/* JUDUL */}
        <label htmlFor="judul-input" className="font-semibold text-base">
          Judul Materi
        </label>
        <input
          id="judul-input"
          className="w-full mt-2 mb-6 h-[42px] bg-white rounded-[10px] shadow p-3 outline-none"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          disabled={submitting}
        />

        {/* DESKRIPSI */}
        <label htmlFor="deskripsi-input" className="font-semibold text-base">
          Deskripsi Materi
        </label>
        <textarea
          id="deskripsi-input"
          className="w-full mt-2 mb-6 min-h-[160px] bg-white rounded-[10px] shadow p-3 outline-none resize-none"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          disabled={submitting}
        />

        {/* UPLOAD FILE */}
        <div className="font-semibold text-base mb-4">Upload File</div>

        <div className="flex flex-wrap gap-4 mt-2 mb-10">
          {/* FILE LAMA */}
          {materi.thumbnail && (
            <div className="relative w-[230px] h-[194px] rounded-[10px] overflow-hidden shadow-md bg-white">
              <img
                src={materi.thumbnail}
                alt="File materi"
                className="w-full h-full object-cover"
              />
              <div
                title={materi.fileName || "File"}
                className="absolute bottom-0 left-0 w-full h-[39px] bg-[#6E6E6E] text-white text-sm flex items-center px-3 truncate"
              >
                {materi.fileName || "File"}
              </div>
            </div>
          )}

          {/* UPLOAD BARU */}
          <label
            htmlFor="file-materi"
            className="w-[230px] h-[194px] rounded-[10px] shadow bg-white flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <input
              id="file-materi"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleUpload}
            />
            <img src={PlusIcon} alt="Plus icon" className="w-6" />
            <span className="text-sm text-gray-500 max-w-[200px] truncate block text-center">
              {fileBaru ? fileBaru.name : "Tambah File"}
            </span>
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/kelas-guru/${id}`)}
            disabled={submitting}
          >
            Batalkan
          </Button>

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
