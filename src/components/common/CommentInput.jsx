import { useState } from "react";
import SendIcon from "../../assets/icons/Send.svg";

export default function CommentInput({
  value,
  onChange,
  onSend,
  placeholder = "Tulis komentar...",
  className = "",
}) {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!value?.trim() || loading) return;
    setLoading(true);
    await onSend();
    setLoading(false);
  };

  return (
    <div
      className={`
        flex items-center gap-3 border rounded-[20px]
        px-4 ${className}
      `}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-grow py-3 outline-none min-w-0"
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="p-2 rounded-full hover:bg-[#E9F1FA] disabled:opacity-50"
      >
        <img src={SendIcon} className="w-5 h-5" />
      </button>
    </div>
  );
}
