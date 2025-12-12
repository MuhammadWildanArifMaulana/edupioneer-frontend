import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CardKelas from "../../components/kelas/CardKelas";
import PlusIcon from "../../assets/icons/Plus.svg";
import IconButton from "../../components/common/IconButton";
import Modal from "../../components/common/Modal";
import { kelasApi } from "../../api/index";
import { useToast } from "../../hooks/useToast";

export default function DaftarKelasSiswa() {
  const [showModal, setShowModal] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState(null);
  const [kelasList, setKelasList] = useState([]);
  const { addToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await kelasApi.getAll(1, 100);
        setKelasList(res.data?.data || []);
      } catch (err) {
        console.error("Gagal memuat daftar kelas", err);
        addToast("Gagal memuat daftar kelas", { type: "error" });
      }
    };
    load();
    // if opened with demo query param, auto-open modal with demo class
    try {
      const params = new URLSearchParams(location.search);
      if (params.get("demo") === "1") {
        const demoKelas = {
          id: "demo-kelas-1",
          nama: "Kelas Demo 8A",
          guru_nama: "Budi Santoso",
          gambar: null,
        };
        setSelectedKelas(demoKelas);
        setShowModal(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleOpenConfirm = (kelas) => {
    setSelectedKelas(kelas);
    setShowModal(true);
  };

  const handleConfirmJoin = async () => {
    if (!selectedKelas) return;
    // Per user request: do not call backend here — show a Tailwind-style toast popup
    setShowModal(false);
    addToast("Permintaan telah dikirim, tunggu guru untuk menerimanya", {
      type: "success",
    });
  };

  return (
    <div className="w-full flex justify-center px-6 py-10">
      <div className="w-full max-w-[1180px]">
        {/* GRID CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {kelasList.map((kelas) => (
            <CardKelas
              key={kelas.id}
              id={kelas.id}
              gambar={kelas.gambar}
              namaKelas={kelas.nama}
              namaGuru={kelas.guru_nama || kelas.guru || "-"}
              onClick={() => handleOpenConfirm(kelas)}
            />
          ))}
        </div>

        {/* FLOATING BUTTON */}
        <IconButton
          icon={PlusIcon}
          size="xl"
          variant="light"
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 shadow-md hover:scale-105"
        />
      </div>

      {/* MODAL JOIN */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={
          selectedKelas
            ? `Gabung ke ${selectedKelas.nama || selectedKelas.namaKelas}`
            : null
        }
        actions={[
          {
            label: "Batal",
            variant: "light",
            onClick: () => setShowModal(false),
          },
          {
            label: "Konfirmasi",
            variant: "primary",
            onClick: handleConfirmJoin,
          },
        ]}
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-[16px] font-normal text-gray-800 -mt-2 text-center">
            Apakah Anda ingin mengirim permintaan gabung ke kelas ini?
          </p>
        </div>
      </Modal>
    </div>
  );
}
