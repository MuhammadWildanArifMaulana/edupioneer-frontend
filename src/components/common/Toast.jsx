import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-semibold animate-slideIn z-[999]
      ${type === "success" ? "bg-[#35C362]" : type === "error" ? "bg-red-500" : "bg-[#00ABE4]"}`}
    >
      {message}
    </div>
  );
}
