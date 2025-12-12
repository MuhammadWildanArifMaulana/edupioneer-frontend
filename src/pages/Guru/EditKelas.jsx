import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { kelasApi } from "../../api/index";
import UploadIcon from "../../assets/icons/Upload.svg";
import EditIcon from "../../assets/icons/Edit.svg";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

export default function EditKelas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [kelas, setKelas] = useState(null);
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [fileBaru, setFileBaru] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        const res = await kelasApi.getById(id);
        const data = res.data?.data || {};
        setKelas(data);
        setNama(data.nama || "");
        setKode(data.kode || "");
        setThumbnail(data.gambar || null);
      } catch (err) {
        console.error("Fetch kelas error:", err);
        addToast("Gagal memuat data kelas", { type: "error" });
        navigate("/kelas-guru");
      } finally {
        setLoading(false);
      }
    };
    fetchKelas();
  }, [id]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileBaru(file);
    setThumbnail(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("kode", kode);
      if (fileBaru) {
        formData.append("gambar", fileBaru);
      }

      await kelasApi.update(id, formData);
      addToast("Kelas berhasil diperbarui!", { type: "success" });
      setTimeout(() => navigate(`/kelas-guru/${id}`), 1500);
    } catch (err) {
      console.error("Update kelas error:", err);
      addToast("Gagal menyimpan perubahan", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (!kelas)
    return (
      <div className="p-6 text-center text-gray-500">Kelas tidak ditemukan</div>
    );

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">Edit Kelas</h2>

        {/* GAMBAR */}
        <label htmlFor="gambar-upload" className="font-semibold text-[16px]">
          Gambar
        </label>

        {thumbnail ? (
          <div className="relative w-full sm:w-[260px] aspect-[13/8] rounded-[12px] overflow-hidden shadow-md mt-3 mb-6">
            <img
              src={thumbnail}
              alt="Gambar kelas"
              className="w-full h-full object-cover"
            />

            <label
              htmlFor="edit-gambar"
              className="absolute bottom-2 right-2 bg-[#00ABE4] hover:bg-[#0889bf] cursor-pointer p-2 rounded-md transition"
              title="Edit gambar"
            >
              <input
                id="edit-gambar"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
              />
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </label>
          </div>
        ) : (
          <label
            htmlFor="gambar-upload"
            className="mt-3 mb-6 w-full sm:w-[260px] aspect-[13/8] rounded-[12px] shadow bg-white flex flex-col justify-center items-center gap-2 cursor-pointer"
          >
            <input
              id="gambar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
            />
            <img src={UploadIcon} alt="Upload icon" className="w-6" />
            <span className="text-sm text-gray-500 text-center">
              Klik untuk upload atau drag & drop
            </span>
          </label>
        )}

        <Input
          label="Nama kelas"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="mb-6"
          disabled={submitting}
        />

        <Input
          label="Kode kelas"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          className="mb-10"
          disabled={submitting}
        />

        {/* BUTTON */}
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
            {submitting ? "Menyimpan..." : "Simpan perubahan"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
