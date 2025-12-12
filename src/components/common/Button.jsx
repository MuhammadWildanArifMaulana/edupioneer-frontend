export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  icon,
  iconRight,
  className = "",
  ...props
}) {
  const base =
    "rounded-[10px] font-semibold transition shadow-sm active:scale-[0.98] flex items-center justify-center gap-2";

  const sizes = {
    sm: "px-3 py-1 text-xs sm:text-sm",
    md: "px-5 py-2 text-sm sm:text-base",
    lg: "px-6 py-3 text-base sm:text-lg",
  };

  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    success: "bg-[#35C362] text-white hover:bg-[#2ca452]",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "bg-white text-black border border-black hover:bg-gray-100",
  };

  return (
    <button
      disabled={disabled}
      className={`
        ${base}
        ${sizes[size]}
        ${variants[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && <img src={icon} className="w-4 h-4 object-contain" />}
      {children}
      {iconRight && <img src={iconRight} className="w-4 h-4 object-contain" />}
    </button>
  );
}
