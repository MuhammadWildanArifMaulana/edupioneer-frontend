export default function Input({
  value,
  onChange,
  placeholder,
  icon,
  label,
  textarea = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="font-semibold text-base mb-2">{label}</label>}

      <div className="relative w-full">
        {icon && (
          <img
            src={icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70 pointer-events-none"
          />
        )}

        {textarea ? (
          <textarea
            {...props}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`
              w-full min-h-[140px]
              ${icon ? "pl-9" : "pl-3"}
              pr-3 rounded-[10px]
              border bg-white text-sm border-gray-300 shadow
              focus:ring-2 focus:ring-blue-400 outline-none resize-none
            `}
          />
        ) : (
          <input
            {...props}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`
              w-full h-10
              ${icon ? "pl-9" : "pl-3"}
              pr-3 rounded-[10px]
              border bg-white text-sm border-gray-300 shadow
              focus:ring-2 focus:ring-blue-400 outline-none
            `}
          />
        )}
      </div>
    </div>
  );
}
