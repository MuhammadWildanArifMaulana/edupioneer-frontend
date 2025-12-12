import { useEffect, useState } from "react";
import DropdownKelas from "../../components/tugas/DropdownKelasSiswa";
import ListTugas from "../../components/tugas/ListTugasSiswa";
import Card from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth";
import { siswaApi, tugasApi, kelasApi } from "../../api/index";
import { useToast } from "../../hooks/useToast";

export default function TugasSiswa() {
  const [kelasDipilih, setKelasDipilih] = useState("Semua Kelas");
  const { user } = useAuth();
  const { addToast } = useToast();

  const [hariIni, setHariIni] = useState([]);
  const [mingguIni, setMingguIni] = useState([]);
  const [nanti, setNanti] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTugasForSiswa = async () => {
      setLoading(true);
      // Demo tasks to match the dashboard when siswa/kelas not found
      const demoTasks = [
        {
          id: "demo-1",
          judul: "Latihan Soal Matematika - Bilangan",
          kelas: "Kelas 8A",
          deadlineLabel: "10 Des 2025",
          status: "Belum diserahkan",
        },
        {
          id: "demo-2",
          judul: "Ringkasan Materi Sejarah - Peristiwa Penting",
          kelas: "Kelas 8A",
          deadlineLabel: "15 Des 2025",
          status: "Dikumpulkan",
        },
      ];
      try {
        // 1) find siswa record for current user
        const siswaRes = await siswaApi.getAll(1, 200);
        const siswaList = siswaRes.data?.data || [];
        const mySiswa = siswaList.find((s) => s.user_id === user?.id);

        if (!mySiswa) {
          // no siswa profile -> show demo tasks so dashboard and tugas page match
          setHariIni([]);
          setMingguIni([]);
          setNanti(demoTasks);
          setLoading(false);
          return;
        }

        if (!mySiswa.kelas_id) {
          // not assigned to a kelas yet -> show demo tasks
          setHariIni([]);
          setMingguIni([]);
          setNanti(demoTasks);
          setLoading(false);
          return;
        }

        // 2) fetch tugas for kelas
        const tugasRes = await tugasApi.getAll(mySiswa.kelas_id, 1, 200);
        const tugasList = tugasRes.data?.data || [];

        if (!tugasList.length) {
          setHariIni([]);
          setMingguIni([]);
          setNanti([]);
          setLoading(false);
          return;
        }

        // fetch kelas name for display
        let kelasNama = mySiswa.kelas_nama || null;
        if (!kelasNama) {
          try {
            const kRes = await kelasApi.getById(mySiswa.kelas_id);
            kelasNama = kRes.data?.data?.nama || null;
          } catch (e) {
            console.warn("Gagal ambil nama kelas", e);
            kelasNama = null;
          }
        }

        // 3) map tugas to UI shape and group by deadline
        const now = new Date();
        const h = [];
        const m = [];
        const n = [];

        tugasList.forEach((t) => {
          const tugas = { ...t };
          tugas.kelas = kelasNama || t.kelas_id;

          // compute deadlineLabel and status
          if (t.deadline) {
            const dl = new Date(t.deadline);
            const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) tugas.deadlineLabel = "Hari ini";
            else if (diffDays <= 7)
              tugas.deadlineLabel = `Dalam ${diffDays} hari`;
            else tugas.deadlineLabel = dl.toLocaleDateString();
          } else {
            tugas.deadlineLabel = null;
          }

          tugas.status = "Belum dikumpulkan";

          if (t.deadline) {
            const dl = new Date(t.deadline);
            const diffDays = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) h.push(tugas);
            else if (diffDays <= 7) m.push(tugas);
            else n.push(tugas);
          } else {
            n.push(tugas);
          }
        });

        setHariIni(h);
        setMingguIni(m);
        setNanti(n);
      } catch (err) {
        console.error("Gagal memuat tugas siswa", err);
        addToast("Gagal memuat tugas", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadTugasForSiswa();
  }, [user?.id]);

  return (
    <div className="w-full flex justify-center px-3 sm:px-6 py-4 sm:py-6">
      <Card
        variant="blue"
        size="lg"
        className="w-full max-w-[1300px] flex flex-col gap-6 sm:gap-8"
      >
        <div className="flex justify-center">
          <DropdownKelas
            pilihan={["Semua Kelas"]}
            selected={kelasDipilih}
            onSelect={setKelasDipilih}
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Memuat tugas...</div>
        ) : (
          <>
            <ListTugas title="Hari Ini" items={hariIni} />
            <ListTugas title="Minggu Ini" items={mingguIni} />
            <ListTugas title="Nanti" items={nanti} />
          </>
        )}
      </Card>
    </div>
  );
}
