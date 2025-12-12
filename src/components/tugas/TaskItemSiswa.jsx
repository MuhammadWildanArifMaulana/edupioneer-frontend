import { useNavigate } from "react-router-dom";
import TaskIcon from "../../assets/icons/Task.svg";

export default function TaskItemSiswa({ tugas }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tugas/${tugas.id}`)}
      className="
        w-full max-w-[1038px]
        min-h-[80px] sm:min-h-[90px]
        bg-white rounded-[10px] shadow-md
        flex items-center justify-between
        px-4 sm:px-6 py-3
        cursor-pointer hover:scale-[1.01] transition
      "
    >
      {/* ICON + TEXT */}
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={TaskIcon}
          className="w-6 h-6 sm:w-7 sm:h-7 mt-1 flex-shrink-0"
        />
        <div className="flex flex-col">
          <p className="font-semibold text-sm sm:text-base text-black">
            {tugas.judul}
          </p>

          {/* kelas + deadline */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <p className="text-xs sm:text-sm text-gray-600">{tugas.kelas}</p>

            {tugas.deadlineLabel && (
              <>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <p className="text-xs sm:text-sm text-[#007AFF] font-medium">
                  {tugas.deadlineLabel}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* STATUS */}
      <p className="text-xs sm:text-sm font-medium text-[#555] ml-2 flex-shrink-0">
        {tugas.status}
      </p>
    </div>
  );
}
