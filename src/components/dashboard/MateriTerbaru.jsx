export default function MateriTerbaru({ items = [] }) {
  const hasItems = items.length > 0;

  const filenameFromUrl = (url) => {
    try {
      if (!url) return "-";
      const parts = url.split("/");
      return parts[parts.length - 1] || url;
    } catch {
      return url;
    }
  };

  const isImageUrl = (url) => {
    if (!url) return false;
    const u = String(url).toLowerCase();
    return /\.(jpg|jpeg|png|webp|gif|svg)$/.test(u);
  };

  const resolveUrl = (url) => {
    if (!url) return null;
    const s = String(url);
    if (/^https?:\/\//i.test(s)) return s;
    // If server returns relative path like '/uploads/..', try to prefix API host (without /api)
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_URL;
    const host = apiBase ? apiBase.replace(/\/api\/?$/, "") : "";
    if (s.startsWith("/")) return host ? host + s : s;
    return host ? host + "/" + s : s;
  };

  return (
    <section className="w-full bg-[#E9F1FA] rounded-[20px] shadow-md p-4 sm:p-5 mb-6 h-[512px] overflow-hidden">
      {/* Title */}
      <div className="group inline-flex flex-col mb-4">
        <span className="font-bold text-lg text-black">Materi Terbaru</span>
        <span className="mt-1 h-[2px] w-28 bg-transparent group-hover:bg-[#3191B1] transition-colors duration-300" />
      </div>

      {/* List materi (adapted to backend fields) */}
      <div className="space-y-4 overflow-y-auto h-96 pr-2">
        {hasItems ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[10px] shadow-md p-3 sm:p-4 flex flex-col sm:flex-row gap-4 w-full"
            >
              {/* Thumbnail (gambar if provided, else placeholder that links file_url) */}
              <button
                type="button"
                onClick={() => {
                  const url = item.gambar || item.file_url;
                  if (url) window.open(url, "_blank");
                }}
                className="relative w-full sm:w-[230px] h-[140px] sm:h-[160px] flex-shrink-0 cursor-pointer hover:scale-[1.02] transition text-left"
              >
                {isImageUrl(item.gambar) || isImageUrl(item.file_url) ? (
                  <img
                    src={resolveUrl(item.gambar || item.file_url)}
                    alt={item.judul}
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-[10px] flex items-center justify-center text-gray-500">
                    File
                  </div>
                )}

                {/* file name (prefer gambar filename if present) */}
                <div className="absolute bottom-0 left-0 w-full h-[36px] bg-[#6E6E6E] text-white text-xs sm:text-sm rounded-b-[10px] flex items-center px-3 overflow-hidden text-ellipsis">
                  {filenameFromUrl(item.gambar || item.file_url)}
                </div>
              </button>

              {/* Teks materi */}
              <div className="flex-1 flex flex-col justify-center text-black">
                <p className="font-bold text-sm sm:text-base">{item.judul}</p>
                <p className="font-normal text-sm sm:text-base">
                  {item.deskripsi}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Dipost oleh: {item.guru_mapel_id || "-"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Tidak ada materi untuk saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
