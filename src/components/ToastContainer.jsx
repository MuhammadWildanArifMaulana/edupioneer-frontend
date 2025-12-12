import React from "react";
import { useToast } from "../hooks/useToast";

const ToastItem = ({ toast, onClose }) => {
  const base = "px-4 py-2 rounded shadow text-sm flex items-center gap-3";
  const bg =
    toast.type === "success"
      ? "bg-green-50 text-green-800 border border-green-200"
      : toast.type === "error"
        ? "bg-red-50 text-red-800 border border-red-200"
        : "bg-gray-50 text-gray-800 border border-gray-200";
  return (
    <div className={`${base} ${bg}`}>
      <div className="flex-1">{toast.message}</div>
      <button onClick={() => onClose(toast.id)} className="text-xs px-2">
        ✕
      </button>
    </div>
  );
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[320px]">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={removeToast} />
      ))}
    </div>
  );
}
