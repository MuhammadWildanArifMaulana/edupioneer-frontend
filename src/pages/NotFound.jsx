import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-6xl font-extrabold text-[#00ABE4] mb-4">404</h1>
      <p className="text-lg text-gray-700 max-w-[450px] mb-8">
        Halaman yang kamu cari tidak ditemukan. Mungkin URL salah atau halaman
        sudah dipindahkan.
      </p>

      <Button
        variant="primary"
        onClick={() => navigate("/")}
        className="px-6 py-3"
      >
        Kembali ke Beranda
      </Button>
    </div>
  );
}
