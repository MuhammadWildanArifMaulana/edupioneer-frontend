import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { kelasApi } from "../../api/index";
import ClassCard from "../../components/kelas/CardKelas";
import PlusIcon from "../../assets/icons/Plus.svg";
import IconButton from "../../components/common/IconButton";

export default function GuruKelasList() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKelas = async () => {
      try {
        setLoading(true);
        const res = await kelasApi.getAll(1, 100);
        const kelasList = res.data?.data || [];
        setKelas(kelasList);
      } catch (err) {
        console.error("Fetch kelas error:", err);
        addToast("Gagal memuat daftar kelas", { type: "error" });
        setKelas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKelas();
  }, []);

  return (
    <div className="w-full flex justify-center px-6 py-10">
      <div className="w-full max-w-[1180px]">
        {loading && (
          <div className="text-center py-6 text-gray-500">Memuat kelas...</div>
        )}
        {!loading && kelas.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Belum ada kelas. Buat kelas baru?
          </div>
        )}

        {/* GRID CARD */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
            {kelas.map((k) => (
              <ClassCard
                key={k.id}
                id={k.id}
                gambar={k.gambar || undefined}
                namaKelas={k.nama || k.name}
                namaGuru={k.guru || undefined}
                role="guru"
                onClick={() => navigate(`/kelas-guru/${k.id}`)}
              />
            ))}
          </div>
        )}

        {/* TOMBOL TAMBAH */}
        <IconButton
          icon={PlusIcon}
          size="xl"
          variant="light"
          onClick={() => navigate("/kelas-guru/tambah")}
          className="fixed bottom-6 right-6 rounded-[10px] shadow-md hover:scale-105 duration-200"
        />
      </div>
    </div>
  );
}
