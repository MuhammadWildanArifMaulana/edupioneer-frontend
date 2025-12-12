import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { useNavigate } from "react-router-dom";
import HamburgerIcon from "../assets/icons/Hamburger.svg";
import SearchIcon from "../assets/icons/Search.svg";
import ProfileIcon from "../assets/icons/Profile.svg";
import LogoutIcon from "../assets/icons/Logout.svg";
import Logo from "../assets/Images/logo.webp";
import UserAvatar from "../components/common/UserAvatar";
import IconButton from "../components/common/IconButton";
import Input from "../components/common/Input";

export default function Navbar({
  userName = "Satria Mahesa",
  userRole = "Siswa",
  userAvatar = null,
  onMenuClick = () => {},
}) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  // fallback: read user from localStorage if auth context is not yet updated
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    storedUser = null;
  }
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef();

  // determine role for conditional UI (handle different casings and sources)
  const roleVal = authUser?.role || storedUser?.role || userRole;
  const isAdmin = String(roleVal || "").toLowerCase() === "admin";

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 z-50 w-full h-16 bg-[#BBD9FB] px-6 shadow-md flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/40 rounded-md transition"
            aria-label="Open sidebar"
          >
            <img src={HamburgerIcon} alt="" className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <img
              src={Logo}
              alt="EduPioneer logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="hidden sm:block text-xl font-bold text-gray-800">
              EduPioneer
            </span>
          </div>
        </div>

        {/* Middle Search Desktop (hidden for admin) */}
        {!isAdmin && (
          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-[360px]">
              <Input
                placeholder="Cari Materi"
                icon={SearchIcon}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Right */}
        <div
          className="flex items-center gap-3 flex-shrink-0 relative"
          ref={dropdownRef}
        >
          {/* Search Mobile Icon (hide for admin) */}
          {!isAdmin && (
            <IconButton
              icon={SearchIcon}
              size="md"
              variant="light"
              onClick={() => setOpenSearch((prev) => !prev)}
              className="md:hidden !rounded-full border border-black/10 backdrop-blur-sm"
            />
          )}

          {/* Avatar Desktop */}
          <UserAvatar
            name={authUser?.name || userName}
            role={authUser?.role || userRole}
            avatar={
              authUser?.avatar_url ||
              authUser?.avatarUrl ||
              authUser?.avatar ||
              storedUser?.avatar_url ||
              storedUser?.avatarUrl ||
              storedUser?.avatar ||
              userAvatar
            }
            onClick={() => setOpenDropdown((prev) => !prev)}
          />

          {/* Avatar Mobile */}
          <UserAvatar
            mobile
            name={authUser?.name || userName}
            avatar={
              authUser?.avatar_url ||
              authUser?.avatarUrl ||
              authUser?.avatar ||
              storedUser?.avatar_url ||
              storedUser?.avatarUrl ||
              storedUser?.avatar ||
              userAvatar
            }
            onClick={() => setOpenDropdown((prev) => !prev)}
          />

          {/* Dropdown Menu */}
          {openDropdown && (
            <div className="dropdown-menu absolute top-14 right-0 w-40 py-2 z-[60]">
              <button
                onClick={() => {
                  setOpenDropdown(false);
                  const roleNorm = String(roleVal || "").toLowerCase();
                  if (roleNorm === "guru") navigate("/akun-guru");
                  else if (roleNorm === "siswa") navigate("/akun-siswa");
                  else if (roleNorm === "admin") navigate("/akun-admin");
                  else navigate("/akun-siswa");
                }}
                className="dropdown-item flex items-center gap-3"
              >
                <img src={ProfileIcon} alt="" className="w-5 h-5" />
                <span className="text-sm">Akun Saya</span>
              </button>

              <button
                onClick={() => {
                  setOpenDropdown(false);
                  navigate("/login");
                }}
                className="dropdown-item flex items-center gap-3"
              >
                <img src={LogoutIcon} alt="" className="w-5 h-5" />
                <span className="text-sm text-red-600 font-semibold">
                  Keluar
                </span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* SEARCH MOBILE */}
      {openSearch && !isAdmin && (
        <div className="absolute top-16 left-0 w-full px-6 md:hidden z-[60] animate-fade">
          <Input
            placeholder="Cari Materi"
            icon={SearchIcon}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setOpenSearch(false)}
          />
        </div>
      )}
    </>
  );
}
