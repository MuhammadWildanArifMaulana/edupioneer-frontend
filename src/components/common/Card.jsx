export default function Card({
  children,
  variant = "white",
  size = "lg",
  className = "",
  onClick,
}) {
  const bgColor = variant === "blue" ? "bg-[#E9F1FA]" : "bg-white";

  const padding =
    size === "lg" ? "p-6 sm:p-8" : size === "md" ? "p-4 sm:p-6" : "p-3 sm:p-4";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`${bgColor} rounded-[20px] shadow-lg ${padding} ${className} ${
        onClick ? "cursor-pointer" : ""
      }`}
      onKeyDown={
        onClick
          ? (e) => (e.key === "Enter" || e.key === "" ? onClick() : null)
          : undefined
      }
    >
      {children}
    </div>
  );
}
