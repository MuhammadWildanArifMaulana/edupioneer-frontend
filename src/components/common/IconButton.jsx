export default function IconButton({
  icon,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "flex items-center justify-center rounded-md transition active:scale-[0.97] shadow-sm";

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const variants = {
    primary: "bg-primary hover:opacity-90 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-[#35C362] hover:bg-[#2ca452] text-white",
    outline: "bg-white border border-black hover:bg-gray-100",
    light: "bg-white hover:bg-gray-100 text-black",
    gray: "bg-gray-300 hover:bg-gray-400 text-black",
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
      <img src={icon} className="w-4 h-4 object-contain" />
    </button>
  );
}
