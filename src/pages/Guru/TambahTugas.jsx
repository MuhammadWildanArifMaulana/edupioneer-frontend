import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../hooks/useToast";
import { tugasApi, guruApi } from "../../api/index";
import UploadIcon from "../../assets/icons/Upload.svg";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

export default function TambahTugas() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!judul || !deskripsi) {
      addToast("Lengkapi judul dan deskripsi", { type: "error" });
      return;
    }

    try {
      setLoading(true);

      // resolve guru_mapel_id for this class
      const guruRes = await guruApi.getAll(1, 200);
      const guruList = guruRes.data?.data || [];
      const currentGuru = guruList.find((g) => g.user_id === user?.id);
      if (!currentGuru) {
        addToast("Data guru tidak ditemukan", { type: "error" });
        setLoading(false);
        return;
      }
      const mapelRes = await guruApi.getMapel(currentGuru.id);
      const mapelData = mapelRes.data?.data || [];
      const gm = mapelData.find((m) => m.kelas_id === id);
      if (!gm) {
        addToast("Anda tidak terdaftar mengajar mapel di kelas ini", {
          type: "error",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("guru_mapel_id", gm.id);
      formData.append("kelas_id", id);
      formData.append("judul", judul);
      formData.append("deskripsi", deskripsi);
      if (file) {
        formData.append("file", file);
      }

      await tugasApi.create(formData);
      addToast("Tugas berhasil dibuat!", { type: "success" });
      setTimeout(() => navigate(`/kelas-guru/${id}`), 1500);
    } catch (err) {
      console.error("Create tugas error:", err);
      addToast("Gagal membuat tugas", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">Tambah Tugas</h2>

        {/* JUDUL */}
        <Input
          label="Judul Tugas"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          className="mb-6"
          disabled={loading}
        />

        {/* DESKRIPSI */}
        <Input
          label="Deskripsi Tugas"
          textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          className="mb-6 min-h-40"
          disabled={loading}
        />

        {/* UPLOAD FILE */}
        <label htmlFor="tugas-file" className="font-semibold text-base">
          Upload File
        </label>
        <label
          htmlFor="tugas-file"
          className="
            mt-2 mb-10 w-full h-[100px] rounded-[10px] shadow bg-white
            flex flex-col justify-center items-center gap-2 cursor-pointer
          "
        >
          <input
            id="tugas-file"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleUpload}
          />
          <img src={UploadIcon} alt="Upload icon" className="w-6" />
          <span className="text-sm text-gray-500 max-w-[260px] truncate block text-center">
            {file ? file.name : "Klik untuk upload atau drag and drop"}
          </span>
        </label>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/kelas-guru/${id}`)}
            disabled={loading}
          >
            Batalkan
          </Button>

          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Membuat..." : "Tugaskan"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
