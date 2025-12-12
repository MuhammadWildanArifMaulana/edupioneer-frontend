import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { tugasApi } from "../../api/index";
import PlusIcon from "../../assets/icons/Plus.svg";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function EditTugas() {
  const { id, tugasId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [tugas, setTugas] = useState(null);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileBaru, setFileBaru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTugas = async () => {
      try {
        const res = await tugasApi.getById(tugasId);
        const data = res.data?.data || {};
        setTugas(data);
        setJudul(data.judul || "");
        setDeskripsi(data.deskripsi || "");
      } catch (err) {
        console.error("Fetch tugas error:", err);
        addToast("Gagal memuat data tugas", { type: "error" });
        navigate(`/kelas-guru/${id}`);
      } finally {
        setLoading(false);
      }
    };

    if (tugasId) {
      fetchTugas();
    }
  }, [tugasId]);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFileBaru(selected);
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

      await tugasApi.update(tugasId, formData);
      addToast("Tugas berhasil diperbarui!", { type: "success" });
      setTimeout(() => navigate(`/kelas-guru/${id}`), 1500);
    } catch (err) {
      console.error("Update tugas error:", err);
      addToast("Gagal menyimpan perubahan", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (!tugas)
    return (
      <div className="p-6 text-center text-gray-500">Tugas tidak ditemukan</div>
    );

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">Edit Tugas</h2>

        {/* JUDUL */}
        <label htmlFor="judul-input" className="font-semibold text-[16px]">
          Judul Tugas
        </label>
        <input
          id="judul-input"
          className="w-full mt-2 mb-6 h-[42px] bg-white rounded-[10px] shadow p-3 outline-none"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          disabled={submitting}
        />

        {/* DESKRIPSI */}
        <label htmlFor="deskripsi-input" className="font-semibold text-[16px]">
          Deskripsi Tugas
        </label>
        <textarea
          id="deskripsi-input"
          className="w-full mt-2 mb-6 min-h-[160px] bg-white rounded-[10px] shadow p-3 outline-none resize-none"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          disabled={submitting}
        />

        {/* UPLOAD FILE */}
        <div className="font-semibold text-[16px] mb-4">Upload File</div>
        <div className="flex flex-wrap gap-4 mt-2 mb-10">
          {/* FILE LAMA */}
          {tugas.fileName && (
            <div className="relative w-[230px] h-[194px] rounded-[10px] overflow-hidden shadow-md bg-white">
              {tugas.thumbnail ? (
                <img
                  src={tugas.thumbnail}
                  alt="File tugas"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                  {tugas.fileName}
                </div>
              )}
              <div
                title={tugas.fileName}
                className="absolute bottom-0 left-0 w-full h-[39px] bg-[#6E6E6E] text-white text-sm flex items-center px-3 truncate"
              >
                {tugas.fileName}
              </div>
            </div>
          )}

          {/* UPLOAD BARU */}
          <label
            htmlFor="file-tugas"
            className="w-[230px] h-[194px] rounded-[10px] shadow bg-white flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <input
              id="file-tugas"
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
            Batal
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
