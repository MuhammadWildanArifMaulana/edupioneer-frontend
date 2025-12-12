import { useNavigate } from "react-router-dom";
import TaskIcon from "../../assets/icons/Task.svg";

export default function TugasKamu({ tasks = [] }) {
  const navigate = useNavigate();
  const hasTasks = tasks.length > 0;

  return (
    <section className="w-full bg-[#E9F1FA] rounded-[20px] shadow-md px-5 py-5 mb-6">
      {/* TITLE */}
      <div className="group inline-flex flex-col mb-4">
        <span className="text-lg font-bold text-black">Tugas Kamu</span>
        <span className="mt-1 h-[2px] w-24 bg-transparent group-hover:bg-[#3191B1] transition-colors" />
      </div>

      {/* CARD LIST */}
      <div className="bg-white rounded-[10px] shadow overflow-y-auto max-h-80">
        {hasTasks ? (
          tasks.map((tugas) => (
            <button
              key={tugas.id}
              onClick={() => navigate(`/tugas/${tugas.id}`)}
              className="
                w-full text-left
                flex flex-col md:flex-row md:items-center justify-between
                gap-3 px-5 py-4
                border-b last:border-b-0 border-gray-200
                hover:bg-[#F4FBFF] transition
              "
            >
              {/* icon + content */}
              <div className="flex items-start gap-3">
                <img
                  src={TaskIcon}
                  alt=""
                  className="w-6 h-6 mt-1 flex-shrink-0"
                />
                <div className="leading-tight">
                  {/* JUDUL */}
                  <p className="font-semibold text-base text-black">
                    {tugas.judul}
                  </p>

                  {/* KELAS + DEADLINE */}
                  <div className="flex flex-wrap items-center gap-1">
                    <p className="text-sm text-gray-600">{tugas.kelas}</p>

                    {tugas.deadlineLabel && (
                      <>
                        <span className="text-gray-400 hidden sm:inline">
                          •
                        </span>
                        <p className="text-sm text-[#007AFF] font-medium">
                          {tugas.deadlineLabel}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <p className="text-sm font-medium text-[#555] flex-shrink-0">
                {tugas.status}
              </p>
            </button>
          ))
        ) : (
          <div className="px-5 py-4 text-sm text-gray-500">
            Tidak ada tugas untuk saat ini.
          </div>
        )}
      </div>
    </section>
  );
}
