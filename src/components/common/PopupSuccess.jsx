import CheckIcon from "../../assets/icons/check.svg";

export default function PopupSuccess() {
  return (
    <div
      className="
        fixed inset-0 bg-black/30
        flex items-center justify-center
        z-40
      "
    >
      <div
        className="
          bg-[#E9F1FA]
          w-[434px] h-[229px]
          rounded-[20px] shadow-lg
          flex flex-col items-center justify-center
        "
      >
        {/* icon  */}
        <div
          className="
            w-[46px] h-[46px]
            rounded-full
            bg-[#35C362]
            flex items-center justify-center
            mb-4
          "
        >
          <img
            src={CheckIcon}
            className="w-6 h-6 filter invert brightness-200"
          />
        </div>

        {/* Teks */}
        <p className="text-base font-normal text-black">
          Tugas berhasil dikumpulkan
        </p>
      </div>
    </div>
  );
}
