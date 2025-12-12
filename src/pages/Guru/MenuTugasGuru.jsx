import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { tugasApi, kelasApi, guruApi } from "../../api/index";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Card from "../../components/common/Card";

function getStatusClass(status) {
  const baseClass = "px-2 py-1 rounded text-xs font-semibold ";
  if (status === "Dikumpulkan")
    return baseClass + "bg-green-200 text-green-800";
  if (status === "Pending") return baseClass + "bg-yellow-200 text-yellow-800";
  return baseClass + "bg-red-200 text-red-800";
}

export default function MenuTugasGuru() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { guru_id } = useParams();

  const [kelas, setKelas] = useState([]);
  const [kelasIdsForGuru, setKelasIdsForGuru] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [kelasDipilih, setKelasDipilih] = useState("Semua Kelas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // If route provides guru_id, try to fetch only kelas taught by the guru
        let kelasData = [];
        let kelasIdsForGuru = null;
        if (guru_id) {
          try {
            const kelasRes = await kelasApi.getAll(1, 100, guru_id);
            kelasData = kelasRes.data?.data || [];
            // extract ids and normalize to strings for reliable comparison
            kelasIdsForGuru = kelasData
              .map((k) => String(k.id))
              .filter(Boolean);
            setKelasIdsForGuru(kelasIdsForGuru);
            setKelas(kelasData);
          } catch (e) {
            // fallback to original approach: fetch all kelas then filter via guruApi.getMapel
            // eslint-disable-next-line no-console
            console.warn(
              "kelasApi.getAll with guru_id failed, falling back:",
              e
            );
            const kelasRes = await kelasApi.getAll(1, 100);
            kelasData = kelasRes.data?.data || [];
            try {
              const mapelRes = await guruApi.getMapel(guru_id);
              const mapel = mapelRes.data?.data || [];
              kelasIdsForGuru = mapel
                .map((m) => m.kelas_id || (m.kelas && m.kelas.id))
                .filter(Boolean);
              setKelasIdsForGuru(kelasIdsForGuru);
            } catch (error_) {
              // ignore and show all kelas
              // eslint-disable-next-line no-console
              console.warn("Failed to fetch guru mapel:", error_);
              kelasIdsForGuru = null;
            }
            setKelas(kelasData);
          }
        } else {
          // No guru_id: fetch all kelas
          const kelasRes = await kelasApi.getAll(1, 100);
          kelasData = kelasRes.data?.data || [];
          setKelas(kelasData);
        }

        // Fetch submissions (backend may return many; filter by kelasIdsForGuru if provided)
        const subRes = await tugasApi.getSubmissions();
        const allSub = subRes.data?.data || [];

        const filtered =
          kelasIdsForGuru && kelasIdsForGuru.length > 0
            ? allSub.filter((s) => {
                const sid =
                  s.kelas_id || s.kelasId || s.kelas_id_from_backend || null;
                if (sid) return kelasIdsForGuru.includes(String(sid));
                // fallback: match by kelas name
                if (s.kelas)
                  return kelasData.some((k) => {
                    const match = (k.nama || k.name) === s.kelas;
                    return match && kelasIdsForGuru.includes(String(k.id));
                  });
                return false;
              })
            : allSub;

        setSubmissions(filtered);
      } catch (err) {
        console.error("Fetch error:", err);
        addToast("Gagal memuat data", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [guru_id]);

  const daftarKelasGuru = (() => {
    if (Array.isArray(kelasIdsForGuru) && kelasIdsForGuru.length > 0) {
      const filtered = kelas.filter((k) =>
        kelasIdsForGuru.includes(String(k.id))
      );
      return ["Semua Kelas", ...filtered.map((k) => k.nama || k.name)];
    }
    return ["Semua Kelas", ...kelas.map((k) => k.nama || k.name)];
  })();
  const dataTampil =
    kelasDipilih === "Semua Kelas"
      ? submissions
      : submissions.filter((s) => s.kelas === kelasDipilih);

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        {/* FILTER KELAS */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-[260px]">
            <Select
              value={kelasDipilih}
              onChange={setKelasDipilih}
              options={daftarKelasGuru}
            />
          </div>
        </div>

        {loading && <div className="text-center py-6">Memuat data...</div>}

        {!loading && dataTampil.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Tidak ada pengumpulan tugas
          </div>
        )}

        {/* TABEL */}
        {!loading && dataTampil.length > 0 && (
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[900px] bg-white shadow rounded-[12px] text-sm">
              <thead className="bg-[#00ABE4] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Siswa</th>
                  <th className="py-3 px-4 text-left">Kelas</th>
                  <th className="py-3 px-4 text-left">Tugas</th>
                  <th className="py-3 px-4 text-left">Dikumpulkan</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Nilai</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {dataTampil.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {item.namaSiswa || item.siswa}
                    </td>
                    <td className="py-3 px-4">{item.kelas}</td>
                    <td className="py-3 px-4">
                      {item.judulTugas || item.tugas}
                    </td>
                    <td className="py-3 px-4">{item.tanggalKumpul || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusClass(item.status)}>
                        {item.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {item.nilai ?? "-"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/tugas-guru/nilai/${item.tugasId || item.id}/${item.siswaId}`
                            )
                          }
                          className="px-3 py-1 text-xs sm:text-sm whitespace-nowrap rounded-md"
                        >
                          Nilai
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
