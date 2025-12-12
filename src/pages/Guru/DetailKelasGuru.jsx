import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../hooks/useToast";
import { kelasApi, materiApi, tugasApi, guruApi } from "../../api/index";

import EditIcon from "../../assets/icons/Edit.svg";
import TrashIcon from "../../assets/icons/Trash.svg";
import FolderIcon from "../../assets/icons/Folder.svg";
import ManageIcon from "../../assets/icons/Manage.svg";
import DropdownIcon from "../../assets/icons/dropdown.svg";
import DropdownUpIcon from "../../assets/icons/DropdownU.svg";

import Button from "../../components/common/Button";
import IconButton from "../../components/common/IconButton";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";

export default function DetailKelasGuru() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [kelas, setKelas] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [tugasList, setTugasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTugasId, setOpenTugasId] = useState(null);

  const [menuKelas, setMenuKelas] = useState(false);
  const [menuSiswa, setMenuSiswa] = useState(false);

  const [modalHapus, setModalHapus] = useState(false);
  const [tipeHapus, setTipeHapus] = useState(null);
  const [idTargetHapus, setIdTargetHapus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // fetch kelas
        const kelasRes = await kelasApi.getById(id);
        const kelasData = kelasRes.data?.data || null;
        setKelas(kelasData);

        // find current guru and guru_mapel for this kelas
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
        // DEBUG: log mapel data to help diagnose materi fetching
        // (remove in production)
        // eslint-disable-next-line no-console
        console.debug("DetailKelasGuru mapelData:", mapelData);
        const idStr = String(id);
        const gm = mapelData.find((m) => {
          // match on multiple possible shapes: m.kelas_id, m.kelas?.id
          const mKelasId =
            m?.kelas_id ?? (m?.kelas && (m.kelas.id || m.kelas._id));
          return String(mKelasId) === idStr;
        });
        const guruMapelId = gm?.id || null;
        // DEBUG: log matched guru_mapel entry and id
        // eslint-disable-next-line no-console
        console.debug(
          "DetailKelasGuru matched gm:",
          gm,
          "guruMapelId:",
          guruMapelId
        );

        // fetch materi & tugas
        let materiRes;
        if (guruMapelId) {
          materiRes = await materiApi.getAll(guruMapelId, 1, 50);
          setMateriList(materiRes.data?.data || []);
        } else {
          // fallback: try fetching materi by kelas id by retrieving all materi and filtering
          try {
            const allMateriRes = await materiApi.getAll(null, 1, 200);
            const allMateri = allMateriRes.data?.data || [];
            const filtered = allMateri.filter((m) => {
              const matKelasId =
                m?.kelas_id ??
                (m?.guru_mapel && m.guru_mapel.kelas_id) ??
                (m?.kelas && (m.kelas.id || m.kelas._id));
              return String(matKelasId) === idStr;
            });
            // DEBUG: log fallback filtering results
            // eslint-disable-next-line no-console
            console.debug(
              "DetailKelasGuru fallback allMateri count:",
              allMateri.length,
              "filtered:",
              filtered.length
            );
            // eslint-disable-next-line no-console
            if (filtered.length > 0)
              console.debug(
                "DetailKelasGuru sample matKelasIds:",
                filtered
                  .slice(0, 5)
                  .map((m) => ({
                    id: m.id,
                    kelas_id: m.kelas_id,
                    guru_mapel: m.guru_mapel,
                    kelas: m.kelas,
                  }))
              );
            setMateriList(filtered);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error("DetailKelasGuru fallback materi fetch failed:", e);
            setMateriList([]);
          }
        }
        const tugasRes = await tugasApi.getAll(id, 1, 200);
        setTugasList(tugasRes.data?.data || []);
      } catch (err) {
        console.error("DetailKelas fetch error:", err);
        addToast("Gagal memuat data kelas", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id]);

  if (!kelas) return <p className="p-6">Kelas tidak ditemukan</p>;

  const openPopupHapus = (tipe, id) => {
    setTipeHapus(tipe);
    setIdTargetHapus(id);
    setModalHapus(true);
  };

  const handleConfirmDelete = () => {
    (async () => {
      try {
        if (tipeHapus === "materi") {
          await materiApi.delete(idTargetHapus);
          setMateriList((prev) => prev.filter((m) => m.id !== idTargetHapus));
          addToast("Materi berhasil dihapus", { type: "success" });
        } else {
          await tugasApi.delete(idTargetHapus);
          setTugasList((prev) => prev.filter((t) => t.id !== idTargetHapus));
          addToast("Tugas berhasil dihapus", { type: "success" });
        }
      } catch (err) {
        console.error("Hapus error:", err);
        addToast("Gagal menghapus item", { type: "error" });
      } finally {
        setModalHapus(false);
      }
    })();
  };

  if (loading) return <p className="p-6">Memuat data...</p>;
  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px] relative">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-xl font-bold">{kelas.namaKelas}</h2>
            <p className="text-xs sm:text-sm text-gray-700">
              kode kelas: {kelas.kodeKelas}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {/* KELOLA KELAS */}
            <div className="relative">
              <Button
                onClick={() => {
                  setMenuKelas(!menuKelas);
                  setMenuSiswa(false);
                }}
                variant="primary"
                className="flex items-center gap-2"
                icon={ManageIcon}
              >
                Kelola Kelas
              </Button>

              {menuKelas && (
                <div className="dropdown-menu right-0 mt-2 w-[180px]">
                  <button
                    onClick={() => navigate(`/kelas-guru/${id}/edit`)}
                    className="dropdown-item"
                  >
                    Edit Kelas
                  </button>
                  <button
                    onClick={() => navigate(`/kelas-guru/${id}/tambah-materi`)}
                    className="dropdown-item"
                  >
                    Tambah Materi
                  </button>
                  <button
                    onClick={() => navigate(`/kelas-guru/${id}/tambah-tugas`)}
                    className="dropdown-item"
                  >
                    Tambah Tugas
                  </button>
                </div>
              )}
            </div>

            {/* KELOLA SISWA */}
            <div className="relative">
              <Button
                onClick={() => {
                  setMenuSiswa(!menuSiswa);
                  setMenuKelas(false);
                }}
                variant="primary"
                className="flex items-center"
                icon={FolderIcon}
              >
                Kelola Siswa
              </Button>

              {menuSiswa && (
                <div className="dropdown-menu right-0 mt-2 w-[170px]">
                  <button
                    onClick={() => navigate(`/kelas-guru/${id}/lihat-siswa`)}
                    className="dropdown-item"
                  >
                    Lihat Siswa
                  </button>
                  <button
                    onClick={() => navigate(`/kelas-guru/${id}/tambah-siswa`)}
                    className="dropdown-item"
                  >
                    Tambah Siswa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LIST MATERI */}
        <div className="flex flex-col gap-8 sm:gap-10">
          {materiList.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-[12px] shadow-md p-4 sm:p-6 flex flex-col gap-4"
            >
              {/* JUDUL + ACTION */}
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                <span className="text-sm sm:text-lg font-bold flex-1">
                  {m.judul}
                </span>

                <IconButton
                  icon={EditIcon}
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    navigate(`/kelas-guru/${id}/edit-materi/${m.id}`)
                  }
                />
                <IconButton
                  icon={TrashIcon}
                  size="sm"
                  variant="danger"
                  onClick={() => openPopupHapus("materi", m.id)}
                />
              </div>

              <p className="text-xs sm:text-base whitespace-pre-line leading-relaxed">
                {m.deskripsi}
              </p>

              {/* THUMBNAIL / FILE */}
              <button
                type="button"
                onClick={() => m.file_url && window.open(m.file_url, "_blank")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  m.file_url &&
                  window.open(m.file_url, "_blank")
                }
                className="relative cursor-pointer hover:scale-[1.02] transition w-full h-[140px] sm:w-[230px] sm:h-[194px] rounded-[10px] overflow-hidden shadow-md"
              >
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                  File
                </div>
                <div className="absolute bottom-0 bg-[#6E6E6E] text-white text-xs px-2 py-1 w-full truncate">
                  {m.file_url ? m.file_url.split("/").pop() : "-"}
                </div>
              </button>

              {/* LIST TUGAS */}
              {tugasList.map((t) => {
                const isOpen = openTugasId === t.id;
                return (
                  <div
                    key={t.id}
                    className="bg-[#E9F1FA] p-3 sm:p-4 rounded-[10px] shadow-md flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm sm:text-base font-semibold flex-1">
                        {t.judul}
                      </span>

                      <IconButton
                        icon={EditIcon}
                        size="sm"
                        variant="primary"
                        onClick={() =>
                          navigate(`/kelas-guru/${id}/edit-tugas/${t.id}`)
                        }
                      />
                      <IconButton
                        icon={TrashIcon}
                        size="sm"
                        variant="danger"
                        onClick={() => openPopupHapus("tugas", t.id)}
                      />

                      <button
                        onClick={() => setOpenTugasId(isOpen ? null : t.id)}
                        className="p-1"
                      >
                        <img
                          src={isOpen ? DropdownUpIcon : DropdownIcon}
                          className="w-5"
                          alt="toggle"
                        />
                      </button>
                    </div>

                    {isOpen && (
                      <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed mt-1 animate-slideDown">
                        {t.deskripsi}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* MODAL HAPUS */}
      <Modal open={modalHapus} onClose={() => setModalHapus(false)}>
        <div className="text-center">
          <img src={TrashIcon} alt="Hapus" className="w-6 mx-auto mb-4" />
          <p className="text-[16px]">
            Apakah Anda yakin ingin <span className="font-bold">menghapus</span>{" "}
            {tipeHapus === "materi" ? "materi" : "tugas"} ini?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Button variant="outline" onClick={() => setModalHapus(false)}>
              Batalkan
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
