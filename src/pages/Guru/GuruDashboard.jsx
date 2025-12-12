import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../hooks/useToast";
import {
  materiApi,
  tugasApi,
  nilaiApi,
  guruApi,
  joinApi,
  kelasApi,
} from "../../api/index";
import WelcomeBox from "../../components/dashboard/WelcomeBox";
import StatCard from "../../components/common/StatCard";
import MateriTerbaru from "../../components/dashboard/MateriTerbaru";
import RataRataNilaiKelas from "../../components/dashboard/RataRataNilaiKelas";
import SiswaBelumMengumpulkan from "../../components/dashboard/SiswaBelumMengumpulkan";
import TugasBelumDinilai from "../../components/dashboard/TugasBelumDinilai";

export default function GuruDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [kelas, setKelas] = useState([]);
  const [kelasTotal, setKelasTotal] = useState(0);
  const [materi, setMateri] = useState([]);
  const [tugas, setTugas] = useState([]);
  const [nilai, setNilai] = useState([]);
  const guruDataRef = useRef(null);
  const [siswaBelumSubmit, setSiswaBelumSubmit] = useState([]);
  const [tugasBelumDinilai, setTugasBelumDinilai] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSampleJoinRequest, setShowSampleJoinRequest] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Get guru ID dari user_id
        // API akan menggunakan token untuk identify guru automatically
        // Fetch all guru to find current guru
        const guruRes = await guruApi.getAll(1, 100);
        const guruList = guruRes.data?.data || [];
        const currentGuru = guruList.find((g) => g.user_id === user?.id);

        if (!currentGuru) {
          addToast("Data guru tidak ditemukan", { type: "error" });
          setLoading(false);
          return;
        }
        guruDataRef.current = currentGuru;

        // 2. Fetch kelas yang diampuh guru ini
        // Note: Backend harus support filtering by guru or get from guru/:id/mapel
        const mapelRes = await guruApi.getMapel(currentGuru.id);
        const mapelData = mapelRes.data?.data || [];

        // Extract unique kelas from guru_mapel relationship
        const kelasSet = new Set();
        const kelasData = [];
        mapelData.forEach((m) => {
          if (m.kelas_id && !kelasSet.has(m.kelas_id)) {
            kelasSet.add(m.kelas_id);
            kelasData.push({
              id: m.kelas_id,
              // backend returns kelas_nama alias; prefer that if present
              nama: m.kelas_nama || (m.kelas && m.kelas.nama) || "-",
              guru_mapel_id: m.id,
            });
          }
        });
        setKelas(kelasData);

        // Also fetch total number of kelas in the system for the stat card
        try {
          const kelasAllRes = await kelasApi.getAll(1, 1);
          // API returns pagination info under `data.pagination.total`
          const totalKelas = kelasAllRes?.data?.pagination?.total ?? 0;
          setKelasTotal(totalKelas);
        } catch (e) {
          // ignore; keep kelasTotal as fallback to kelas.length
          // eslint-disable-next-line no-console
          console.warn("Failed to fetch total kelas", e);
        }

        // 3. Fetch materi dari kelas-kelas guru (ambil 5 terbaru)
        const allMateri = [];
        for (const k of kelasData.slice(0, 2)) {
          // use guru_mapel_id when fetching materi (backend filters by guru_mapel_id)
          const res = await materiApi.getAll(k.guru_mapel_id, 1, 2);
          allMateri.push(...(res.data?.data || []));
        }
        setMateri(allMateri.slice(0, 5));

        // 4. Fetch tugas dari kelas-kelas guru
        const allTugas = [];
        for (const k of kelasData.slice(0, 2)) {
          // tugasApi expects kelas id (we pass k.id)
          const res = await tugasApi.getAll(k.id, 1, 10);
          allTugas.push(...(res.data?.data || []));
        }
        setTugas(allTugas);

        // 5. Fetch nilai rata-rata per kelas
        const nilaiRes = await nilaiApi.getAll(1, 100);
        const nilaiData = nilaiRes.data?.data || [];
        // compute average nilai per mapel (group by mapel_nama or guru_mapel_id)
        const group = {};
        nilaiData.forEach((n) => {
          const key = n.mapel_nama || n.guru_mapel_id || "unknown";
          if (!group[key])
            group[key] = { sum: 0, count: 0, mapel_nama: n.mapel_nama };
          group[key].sum += Number(n.nilai) || 0;
          group[key].count += 1;
        });
        const avg = Object.values(group).map((g) => ({
          mapel_nama: g.mapel_nama || "-",
          nilai: g.count ? +(g.sum / g.count).toFixed(2) : null,
        }));
        setNilai(avg);

        // 6. Hitung siswa yang belum submit tugas
        const belumSubmit = [];
        for (const t of allTugas.slice(0, 3)) {
          const submitsRes = await tugasApi.getSubmits(t.id);
          const submitted = (submitsRes.data?.data || []).map(
            (s) => s.siswa_id
          );
          // Note: Get siswa dari kelas dan cek yang belum submit
          // This is simplified, backend should handle this better
          if (submitted.length < 5) {
            belumSubmit.push({
              tugas: t.judul,
              count: 5 - submitted.length,
            });
          }
        }
        setSiswaBelumSubmit(belumSubmit.slice(0, 3));

        // 7. Hitung tugas yang belum dinilai
        const belumDinilai = [];
        for (const t of allTugas.slice(0, 3)) {
          const submitsRes = await tugasApi.getSubmits(t.id);
          const submits = submitsRes.data?.data || [];
          const notGraded = submits.filter((s) => !s.nilai || s.nilai === null);
          if (notGraded.length > 0) {
            belumDinilai.push({
              tugas: t.judul,
              count: notGraded.length,
            });
          }
        }
        setTugasBelumDinilai(belumDinilai.slice(0, 3));
        // fetch join requests for this guru
        try {
          const jrRes = await joinApi.listForGuru();
          const jrData = jrRes?.data?.data;
          const normalized = Array.isArray(jrData)
            ? jrData
            : jrData
              ? [jrData]
              : [];
          setJoinRequests(normalized);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Gagal memuat join requests", err);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        addToast("Gagal memuat data dashboard", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  return (
    <>
      <WelcomeBox nama={user?.name || "Guru"} />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <StatCard
          title="Kelas Saya"
          label="Jumlah Kelas yang Saya Ajar"
          value={kelas.length}
          onClick={() => {
            const gid = guruDataRef.current?.id;
            if (gid) navigate(`/kelas-guru/guru/${gid}`);
            else navigate(`/kelas-guru`);
          }}
        />
        <StatCard
          title="Total Tugas"
          label="Jumlah Tugas"
          value={tugas.length}
        />
      </div>

      {loading && (
        <div className="mt-6 p-4 text-center text-gray-500">Memuat data...</div>
      )}

      {!loading && (
        <>
          {/* 2 Kolom utama */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* kiri */}
            <MateriTerbaru items={materi} />

            {/* kanan */}
            <div className="flex flex-col gap-6">
              <RataRataNilaiKelas items={nilai} />
              <SiswaBelumMengumpulkan items={siswaBelumSubmit} />
            </div>
          </div>

          {/* daftar tugas belum dinilai */}
          <div className="mt-6">
            <TugasBelumDinilai items={tugasBelumDinilai} />
          </div>
          {/* (Removed real joinRequests list - showing sample below) */}
        </>
      )}
      {/* Static sample Permintaan Gabung Kelas (always shown until dismissed) */}
      {showSampleJoinRequest && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Permintaan Gabung Kelas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-black">Nama: M. Arifin K.</div>
                <div className="text-sm text-gray-700">
                  Kelas: Kelas XII IPA
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded bg-red-100 text-red-700"
                  onClick={() => {
                    // hide static sample
                    setShowSampleJoinRequest(false);
                  }}
                >
                  Tolak
                </button>
                <button
                  className="px-3 py-1 rounded bg-primary text-white"
                  onClick={() => {
                    // hide static sample
                    setShowSampleJoinRequest(false);
                  }}
                >
                  Terima
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
