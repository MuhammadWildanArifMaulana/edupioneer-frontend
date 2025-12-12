import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../hooks/useToast";
import WelcomeBox from "../../components/dashboard/WelcomeBox";
import TugasKamu from "../../components/dashboard/TugasKamu";
import MateriTerbaru from "../../components/dashboard/MateriTerbaru";
import KelasCard from "../../components/dashboard/KelasCard";
import { useNavigate } from "react-router-dom";
import PoinKeaktifan from "../../components/dashboard/PointKeaktifan";
import NilaiTugasTerbaru from "../../components/dashboard/NilaiTugasTerbaru";
import {
  siswaApi,
  tugasApi,
  materiApi,
  nilaiApi,
  kelasApi,
} from "../../api/index";

export default function SiswaDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [tugasAktif, setTugasAktif] = useState([]);
  const [materi, setMateri] = useState([]);
  const [jumlahKelas, setJumlahKelas] = useState(0);
  const [poinKontribusi, setPoinKontribusi] = useState(0);
  const [nilaiTerbaru, setNilaiTerbaru] = useState([]);
  const [kontribusiStats, setKontribusiStats] = useState([]);
  const navigate = useNavigate();
  const [isDemoKelas, setIsDemoKelas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      // Ensure `mapped` is always defined to avoid ReferenceError
      let mapped = [];
      // Fetch all materi for dashboard regardless of siswa/class assignment
      try {
        const mResAll = await materiApi.getAll(null, 1, 20);
        const allMateri = mResAll.data?.data || [];
        setMateri(allMateri.slice(0, 8));
      } catch (err) {
        setMateri([]);
      }
      try {
        // 1. Find siswa record by matching user_id
        const siswaRes = await siswaApi.getAll(1, 200);
        const siswaList = siswaRes.data?.data || [];
        const currentSiswa = siswaList.find(
          (s) => String(s.user_id) === String(user.id)
        );

        // fallback: if not found or not assigned to kelas, show empty state
        const siswaId = currentSiswa?.id || null;
        const kelasId = currentSiswa?.kelas_id || null;

        if (!currentSiswa || !kelasId) {
          // student just registered or not assigned to a class yet
          // For development/demo: simulate that the student has 1 class
          setJumlahKelas(1);
          // mark that we are showing demo kelas so the click navigates appropriately
          setIsDemoKelas(true);
          // Provide two example tugas for demo purposes
          setTugasAktif([
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
          ]);
          setNilaiTerbaru([]);
          setPoinKontribusi(0);
          // continue so the Materi (already fetched above) remains visible
        } else {
          // student is assigned to a class
          setJumlahKelas(1);

          // 3. fetch tugas for this student's kelas (limit first 8)
          const tugasRes = await tugasApi.getAll(kelasId, 1, 20);
          const tugasList = tugasRes.data?.data || [];

          mapped = await Promise.all(
            (tugasList || []).slice(0, 8).map(async (t) => {
              const submitsRes = await tugasApi.getSubmits(t.id);
              const submits = submitsRes.data?.data || [];
              const mySubmit = submits.find(
                (s) => String(s.siswa_id) === String(siswaId)
              );
              return {
                id: t.id,
                judul: t.judul || t.title,
                kelas: t.kelas_nama || t.kelas || "-",
                deadlineLabel: t.deadline || null,
                status: mySubmit ? "Dikumpulkan" : "Belum diserahkan",
              };
            })
          );
          setTugasAktif(mapped || []);

          // 4. (when siswa assigned) additional materi logic could go here if needed
        }

        // 5. fetch latest nilai for siswa
        try {
          const nilaiRes = await nilaiApi.getAll(1, 10, siswaId);
          const nilaiData = nilaiRes.data?.data || [];
          const mappedNilai = (nilaiData || []).slice(0, 6).map((n) => ({
            nama: n.nama || user.name,
            kelas: n.kelas_nama || n.kelas || "-",
            tugas: n.tugas || n.judul || n.mapel_nama || "-",
            tanggal: n.tanggal || n.created_at || "-",
            nilai: n.nilai != null ? String(n.nilai) : "-",
          }));
          setNilaiTerbaru(mappedNilai);
        } catch (err) {
          setNilaiTerbaru([]);
        }

        // 6. poin kontribusi (simple heuristic) and stats breakdown
        const materiCount = (materi && materi.length) || 0;
        const tugasCount = (mapped && mapped.length) || 0;
        setPoinKontribusi(materiCount + tugasCount);
        setKontribusiStats([
          { id: 1, type: "materi", label: "Materi", jumlah: materiCount },
          { id: 2, type: "tugas", label: "Tugas", jumlah: tugasCount },
        ]);
      } catch (err) {
        console.error("SiswaDashboard fetch error:", err);
        addToast("Gagal memuat data dashboard siswa", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <>
      <WelcomeBox nama={user?.name || "Siswa"} />

      <div className="mt-4 md:mt-6 lg:mt-8" />
      <TugasKamu tasks={tugasAktif} />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/2">
          <MateriTerbaru items={materi} />
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <KelasCard
            jumlahKelas={jumlahKelas}
            onClick={() =>
              navigate(`/kelas-siswa${isDemoKelas ? "?demo=1" : ""}`)
            }
          />
          <PoinKeaktifan
            totalKontribusi={poinKontribusi}
            stats={kontribusiStats}
          />
        </div>
      </div>

      <div className="mt-6">
        <NilaiTugasTerbaru nilai={nilaiTerbaru} />
      </div>
    </>
  );
}
