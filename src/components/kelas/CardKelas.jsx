import { useNavigate } from "react-router-dom";
// management actions are handled in the kelas detail page; no inline action buttons here

export default function CardKelas({
  id,
  gambar,
  namaKelas,
  namaGuru,
  role = "siswa",
  onClick,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    if (role === "guru") return navigate(`/kelas-guru/${id}`);
    return navigate(`/materi/${id}`);
  };

  const placeholder =
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Buka kelas ${namaKelas}`}
      className={
        `bg-[#E9F1FA] rounded-[20px] shadow-md w-full max-w-[360px] h-[255px] ` +
        `cursor-pointer transition hover:scale-[1.02] flex flex-col overflow-hidden`
      }
    >
      <div className="h-[155px] w-[calc(100%-24px)] mx-auto mt-3 rounded-[10px] overflow-hidden">
        <img
          src={gambar || placeholder}
          alt={namaKelas || "Kelas"}
          className="w-full h-full object-cover bg-gray-100"
        />
      </div>

      <div className="px-3 mt-3">
        <p className="font-bold truncate">{namaKelas}</p>
        <p className="font-normal truncate">{namaGuru || "-"}</p>
      </div>
      {/* Actions are handled in the kelas detail/management page. */}
    </button>
  );
}
