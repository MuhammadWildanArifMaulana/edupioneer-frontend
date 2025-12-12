import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { kelasApi } from "../../api/index";
import UploadIcon from "../../assets/icons/Upload.svg";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function TambahKelas() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [namaKelas, setNamaKelas] = useState("");
  const [kodeKelas, setKodeKelas] = useState("");
  const [gambar, setGambar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGambar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!namaKelas || !kodeKelas) {
      addToast("Lengkapi nama dan kode kelas", { type: "error" });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("nama", namaKelas);
      formData.append("kode", kodeKelas);
      if (gambar) {
        formData.append("gambar", gambar);
      }

      await kelasApi.create(formData);
      addToast("Kelas berhasil ditambahkan!", { type: "success" });
      setTimeout(() => navigate("/kelas-guru"), 1500);
    } catch (err) {
      console.error("Create kelas error:", err);
      addToast("Gagal membuat kelas", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full flex justify-center relative">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">Tambah Kelas</h2>

        <label htmlFor="gambar-upload" className="font-semibold text-[16px]">
          Gambar
        </label>
        <label
          htmlFor="gambar-upload"
          className="mt-2 mb-8 w-[230px] h-[194px] rounded-[10px] shadow bg-white flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden"
        >
          <input
            id="gambar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
          />
          {preview ? (
            <img
              src={preview}
              alt="Preview gambar kelas"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <img src={UploadIcon} alt="Upload icon" className="w-6" />
              <span className="text-sm text-gray-500 text-center">
                Klik untuk upload atau drag & drop
              </span>
            </>
          )}
        </label>

        <label htmlFor="nama-kelas" className="font-semibold text-[16px]">
          Nama kelas
        </label>
        <input
          id="nama-kelas"
          className="w-full mt-2 mb-6 h-[42px] bg-white rounded-[10px] shadow p-3 outline-none"
          value={namaKelas}
          onChange={(e) => setNamaKelas(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="kode-kelas" className="font-semibold text-[16px]">
          Kode kelas
        </label>
        <input
          id="kode-kelas"
          className="w-full mt-2 mb-10 h-[42px] bg-white rounded-[10px] shadow p-3 outline-none"
          value={kodeKelas}
          onChange={(e) => setKodeKelas(e.target.value)}
          disabled={loading}
        />

        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/kelas-guru")}
            disabled={loading}
          >
            Batalkan
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
