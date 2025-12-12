import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { guruApi, userApi } from "../../api/index";

import ClassCard from "../../components/kelas/CardKelas";
import IconButton from "../../components/common/IconButton";
import PlusIcon from "../../assets/icons/Plus.svg";

export default function KelasGuru() {
  const { guru_id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        if (!guru_id) {
          addToast("Guru ID tidak tersedia", { type: "error" });
          setLoading(false);
          return;
        }
        // Use guru_mapel relation to determine classes the guru teaches
        const mapelRes = await guruApi.getMapel(guru_id);
        const mapelData = mapelRes.data?.data || [];

        const kelasSet = new Set();
        const kelasData = [];
        mapelData.forEach((m) => {
          const kelasId = m.kelas_id || (m.kelas && m.kelas.id);
          if (kelasId && !kelasSet.has(kelasId)) {
            kelasSet.add(kelasId);
            kelasData.push({
              id: kelasId,
              nama:
                m.kelas_nama ||
                (m.kelas && (m.kelas.nama || m.kelas.name)) ||
                "-",
              namaGuru: m.guru_nama || m.guru || undefined,
              gambar:
                m.kelas_gambar || (m.kelas && m.kelas.gambar) || undefined,
            });
          }
        });

        // If guru name missing in relation, fallback to fetching guru record
        // then fetch associated user if necessary
        const needFallback = kelasData.some((k) => !k.namaGuru);
        if (needFallback) {
          try {
            const guruRes = await guruApi.getById(guru_id);
            const guruObj = guruRes.data?.data;
            // try common fields on guru object
            const guruNameFromGuru =
              guruObj?.nama ||
              guruObj?.name ||
              guruObj?.guru_nama ||
              guruObj?.full_name;
            let guruName = guruNameFromGuru;
            if (!guruName && guruObj?.user_id) {
              try {
                const userRes = await userApi.getById(guruObj.user_id);
                guruName =
                  userRes.data?.data?.name || userRes.data?.data?.full_name;
              } catch (e) {
                // ignore
                // eslint-disable-next-line no-console
                console.warn("Failed to fetch user name fallback:", e);
              }
            }

            if (guruName) {
              for (const k of kelasData) {
                if (!k.namaGuru) k.namaGuru = guruName;
              }
            }
          } catch (e) {
            // ignore
            // eslint-disable-next-line no-console
            console.warn("Failed to fetch guru fallback:", e);
          }
        }

        setKelasList(kelasData);
      } catch (err) {
        console.error("KelasGuru fetch error:", err);
        addToast("Gagal memuat daftar kelas", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [guru_id]);

  return (
    <div className="w-full flex justify-center px-6 py-10">
      <div className="w-full max-w-[1180px]">
        {loading && (
          <div className="text-center py-6 text-gray-500">Memuat kelas...</div>
        )}

        {!loading && kelasList.length === 0 && (
          <div className="text-center py-6 text-gray-500">Belum ada kelas.</div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
            {kelasList.map((k) => (
              <ClassCard
                key={k.id}
                id={k.id}
                gambar={k.gambar}
                namaKelas={k.nama}
                namaGuru={k.namaGuru}
                role="guru"
                onClick={() => navigate(`/kelas-guru/${k.id}`)}
              />
            ))}
          </div>
        )}

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
