import ProfileIcon from "../../assets/icons/Profile.svg";

export default function UserAvatar({
  name,
  role,
  avatar,
  mobile = false, // default desktop
  onClick,
  className = "",
}) {
  const AvatarIcon = (
    <div className="w-10 h-10 rounded-full bg-[#E6F3FF] flex items-center justify-center">
      <img src={ProfileIcon} alt="avatar icon" className="w-5 h-5 opacity-90" />
    </div>
  );

  // MOBILE MODE
  if (mobile) {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt={name}
          onClick={onClick}
          className={`
            w-10 h-10 rounded-full object-cover cursor-pointer
            md:hidden
            ${className}
          `}
        />
      );
    }

    return (
      <button
        onClick={onClick}
        className={`md:hidden p-0 bg-transparent ${className}`}
      >
        {AvatarIcon}
      </button>
    );
  }

  // DESKTOP MODE
  return (
    <div
      onClick={onClick}
      className={`
        hidden md:flex items-center gap-3 bg-white rounded-[10px] shadow px-3 h-12 cursor-pointer
        ${className}
      `}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        AvatarIcon
      )}

      <div className="flex flex-col leading-tight max-w-[130px]">
        <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
        <p className="text-gray-500 text-xs truncate">{role}</p>
      </div>
    </div>
  );
}
