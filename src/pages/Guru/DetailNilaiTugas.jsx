import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { tugasApi } from "../../api/index";

import FileIcon from "../../assets/icons/File.svg";
import EyeIcon from "../../assets/icons/Eyes.svg";
import DownloadIcon from "../../assets/icons/Download.svg";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

export default function DetailNilaiTugas() {
  const { tugasId, siswaId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [submission, setSubmission] = useState(null);
  const [nilai, setNilai] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await tugasApi.getSubmissionById(tugasId, siswaId);
        const data = res.data?.data || {};
        setSubmission(data);
        if (data.nilai !== null && data.nilai !== undefined) {
          setNilai(data.nilai);
        }
      } catch (err) {
        console.error("Fetch submission error:", err);
        addToast("Gagal memuat data pengumpulan", { type: "error" });
        navigate("/tugas-guru");
      } finally {
        setLoading(false);
      }
    };

    if (tugasId && siswaId) {
      fetchSubmission();
    }
  }, [tugasId, siswaId]);

  const handleKirim = async () => {
    const angka = Number(nilai);
    if (Number.isNaN(angka) || angka < 0 || angka > 100) {
      addToast("Nilai harus antara 0 sampai 100", { type: "error" });
      return;
    }

    try {
      setSubmitting(true);
      await tugasApi.updateSubmission(tugasId, siswaId, { nilai: angka });
      addToast("Nilai berhasil disimpan!", { type: "success" });
      setTimeout(() => navigate("/tugas-guru"), 1500);
    } catch (err) {
      console.error("Update nilai error:", err);
      addToast("Gagal menyimpan nilai", { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data...</div>;
  if (!submission)
    return (
      <div className="p-6 text-center text-gray-500">
        Data pengumpulan tidak ditemukan
      </div>
    );

  const sudahDinilai =
    submission.nilai !== null && submission.nilai !== undefined;

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px] p-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-black">Nilai Tugas</h2>
        </div>

        {/* DETAIL INFO */}
        <div className="bg-[#BBD9FB] rounded-[10px] p-6 text-black mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
            <p>
              <span className="font-semibold">Nama Siswa</span>
              <br />
              {submission.namaSiswa || submission.siswa}
            </p>
            <p>
              <span className="font-semibold">Tugas</span>
              <br />
              {submission.judulTugas || submission.tugas}
            </p>
            <p>
              <span className="font-semibold">Kelas</span>
              <br />
              {submission.kelas}
            </p>
            <p>
              <span className="font-semibold">Dikumpulkan</span>
              <br />
              {submission.tanggalKumpul || submission.createdAt}
            </p>
          </div>

          {/* FILE */}
          <div className="bg-white text-black rounded-[10px] h-[48px] px-4 mt-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <img src={FileIcon} alt="File icon" className="w-4" />
              <span className="text-xs truncate">
                {submission.fileName || "file.pdf"}
              </span>
            </div>

            <div className="flex gap-3 items-center flex-shrink-0">
              <button className="p-1" title="Lihat file">
                <img src={EyeIcon} alt="View" className="w-5 h-5" />
              </button>
              <button className="p-1" title="Download file">
                <img src={DownloadIcon} alt="Download" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FORM NILAI */}
        <label
          htmlFor="nilai-input"
          className="font-semibold text-sm text-black"
        >
          Nilai (Max: 100 poin)
        </label>
        <input
          id="nilai-input"
          type="number"
          min={0}
          max={100}
          value={nilai}
          disabled={sudahDinilai || submitting}
          onChange={(e) => setNilai(e.target.value)}
          className="w-full h-[42px] bg-white rounded-[10px] shadow p-3 outline-none mt-2 mb-8 disabled:bg-gray-100"
        />

        {/* BUTTON */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-2">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Batal
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={sudahDinilai || submitting}
            onClick={handleKirim}
          >
            {submitting && "Menyimpan..."}
            {!submitting && sudahDinilai && "Nilai sudah tersimpan"}
            {!submitting && !sudahDinilai && "Kirim Nilai"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
