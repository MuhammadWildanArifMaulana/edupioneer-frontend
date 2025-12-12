export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[90%] max-w-[560px] rounded-[16px] shadow-lg p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-black">
            {title}
          </h2>
        )}

        <div className="text-center text-sm sm:text-base mb-6 text-black">
          {children}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {Array.isArray(actions) &&
            actions.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={`
                  px-4 py-2 rounded-[8px] font-semibold transition
                  ${
                    btn.variant === "danger"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : btn.variant === "outline"
                        ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "bg-primary text-white hover:opacity-90"
                  }
                `}
              >
                {btn.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
