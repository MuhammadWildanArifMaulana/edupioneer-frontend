import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import HomeIcon from "../assets/icons/Home.svg";
import ClassIcon from "../assets/icons/ClassList.svg";
import TaskIcon from "../assets/icons/Task.svg";
import PersonIcon from "../assets/icons/Person.svg";
import ProfileIcon from "../assets/icons/Profile.svg";
import BookIcon from "../assets/icons/Book.svg";
import FileIcon from "../assets/icons/File.svg";
import CheckIcon from "../assets/icons/check.svg";
import SuitcaseIcon from "../assets/icons/Suitcase.svg";
import UploadIcon from "../assets/icons/Upload.svg";
import EyesIcon from "../assets/icons/Eyes.svg";
import EmailIcon from "../assets/icons/Email.svg";
import EditIcon from "../assets/icons/Edit.svg";
import FolderIcon from "../assets/icons/Folder.svg";

const menuByRole = {
  siswa: [
    { name: "Home", icon: HomeIcon, path: "/dashboard-siswa" },
    { name: "Daftar Kelas", icon: ClassIcon, path: "/kelas-siswa" },
    { name: "Tugas", icon: TaskIcon, path: "/tugas-siswa" },
  ],
  guru: [
    { name: "Home", icon: HomeIcon, path: "/dashboard-guru" },
    { name: "Daftar Kelas", icon: ClassIcon, path: "/kelas-guru" },
    { name: "Tugas", icon: TaskIcon, path: "/tugas-guru" },
  ],
  admin: [
    { name: "Users", icon: PersonIcon, path: "/dashboard-admin?entity=users" },
    { name: "Kelas", icon: ClassIcon, path: "/dashboard-admin?entity=kelas" },
    { name: "Mapel", icon: BookIcon, path: "/dashboard-admin?entity=mapel" },
    { name: "Guru", icon: ProfileIcon, path: "/dashboard-admin?entity=guru" },
    { name: "Siswa", icon: PersonIcon, path: "/dashboard-admin?entity=siswa" },
    { name: "Materi", icon: FileIcon, path: "/dashboard-admin?entity=materi" },
    { name: "Tugas", icon: TaskIcon, path: "/dashboard-admin?entity=tugas" },
    {
      name: "Nilai Mapel",
      icon: EditIcon,
      path: "/dashboard-admin?entity=nilai_mapel",
      iconColor: "black",
    },
    {
      name: "Absensi",
      icon: CheckIcon,
      path: "/dashboard-admin?entity=absensi",
    },
    {
      name: "Diskusi",
      icon: EmailIcon,
      path: "/dashboard-admin?entity=diskusi",
    },
    {
      name: "Pembayaran SPP",
      icon: SuitcaseIcon,
      path: "/dashboard-admin?entity=spp",
    },
    {
      name: "Guru Mapel",
      icon: ProfileIcon,
      path: "/dashboard-admin?entity=guru_mapel",
    },
    {
      name: "Tugas Submit",
      icon: UploadIcon,
      path: "/dashboard-admin?entity=tugas_submit",
    },
    {
      name: "Materi View",
      icon: EyesIcon,
      path: "/dashboard-admin?entity=materi_view",
    },
    {
      name: "Diskusi Post",
      icon: EmailIcon,
      path: "/dashboard-admin?entity=diskusi_post",
    },
    {
      name: "Absensi Detail",
      icon: TaskIcon,
      path: "/dashboard-admin?entity=absensi_detail",
    },
    {
      name: "Roles",
      icon: FolderIcon,
      path: "/dashboard-admin?entity=roles",
      iconColor: "black",
    },
  ],
};

import { useAuth } from "../hooks/useAuth.jsx";
import { guruApi } from "../api/index";

export default function Sidebar({ isOpen, onClose, role = "siswa" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuItems = menuByRole[role] || menuByRole.siswa;
  const isActive = (path) => {
    // siswa: daftar kelas + materi
    if (path === "/kelas-siswa") {
      return (
        location.pathname.startsWith("/kelas-siswa") ||
        location.pathname.startsWith("/materi")
      );
    }

    // guru: daftar kelas + detail kelas guru
    if (path === "/kelas-guru") {
      return (
        location.pathname.startsWith("/kelas-guru") ||
        location.pathname.startsWith("/detail-kelas-guru")
      );
    }

    // tugas siswa
    if (path === "/tugas-siswa") {
      return location.pathname.startsWith("/tugas");
    }

    // tugas guru
    if (path === "/tugas-guru") {
      return (
        location.pathname.startsWith("/tugas-guru") ||
        location.pathname.startsWith("/detail-tugas-guru")
      );
    }

    return location.pathname === path;
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`
          hidden lg:block fixed top-16 left-0
          h-[calc(100vh-64px)] z-40 transition-all duration-300 shadow-md
          ${isOpen ? "w-64 bg-white" : "w-20 bg-[#BBD9FB]"}
        `}
      >
        <nav className="flex flex-col items-center p-4 gap-3 h-full overflow-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            if (item.path === "/tugas-guru" && role === "guru") {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={async () => {
                    // resolve current guru id for logged in user, then navigate
                    try {
                      const res = await guruApi.getAll(1, 200);
                      const list = res.data?.data || [];
                      const currentGuru = list.find(
                        (g) => g.user_id === user?.id
                      );
                      if (currentGuru?.id)
                        navigate(`/tugas-guru/${currentGuru.id}`);
                      else navigate(`/tugas-guru`);
                    } catch (e) {
                      // fallback
                      // eslint-disable-next-line no-console
                      console.warn("Failed to resolve guru id:", e);
                      navigate(`/tugas-guru`);
                    }
                  }}
                  className={`
                    flex items-center gap-3 rounded-[10px] border h-14 w-full px-4 transition-all
                    ${
                      active
                        ? "bg-[#00ABE4] border-[#00ABE4] text-white hover:bg-[#3191B1] hover:text-white hover:border-[#00ABE4]"
                        : "bg-white border-[#BBD9FB] text-gray-800 hover:bg-[#3191B1] hover:text-black hover:border-[#3191B1]"
                    }
                  `}
                >
                  {(() => {
                    const imgBase = "w-6 h-6";
                    const useBlack = item.iconColor === "black";
                    let imgClass = imgBase;
                    if (!useBlack && active)
                      imgClass = `${imgBase} brightness-0 invert`;
                    const imgStyle = useBlack
                      ? { filter: "brightness(0) saturate(100%)" }
                      : undefined;
                    return (
                      <img
                        src={item.icon}
                        alt={item.name}
                        className={imgClass}
                        style={imgStyle}
                      />
                    );
                  })()}
                  <span className="font-semibold text-base truncate">
                    {item.name}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 rounded-[10px] border h-14 w-full px-4 transition-all
                  ${
                    active
                      ? "bg-[#00ABE4] border-[#00ABE4] text-white hover:bg-[#3191B1] hover:text-white hover:border-[#00ABE4]"
                      : "bg-white border-[#BBD9FB] text-gray-800 hover:bg-[#3191B1] hover:text-black hover:border-[#3191B1]"
                  }
                `}
              >
                {(() => {
                  const imgBase = "w-6 h-6";
                  const useBlack = item.iconColor === "black";
                  let imgClass = imgBase;
                  if (!useBlack && active)
                    imgClass = `${imgBase} brightness-0 invert`;
                  const imgStyle = useBlack
                    ? { filter: "brightness(0) saturate(100%)" }
                    : undefined;
                  return (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className={imgClass}
                      style={imgStyle}
                    />
                  );
                })()}
                <span className="font-semibold text-base truncate">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE SIDEBAR */}
      {isOpen && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            aria-label="Close sidebar overlay"
          />

          <aside className="absolute top-16 left-0 bottom-0 w-64 bg-white shadow-xl p-4">
            <nav className="flex flex-col items-start gap-3 h-full overflow-auto">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                if (item.path === "/tugas-guru" && role === "guru") {
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={async () => {
                        onClose();
                        try {
                          const res = await guruApi.getAll(1, 200);
                          const list = res.data?.data || [];
                          const currentGuru = list.find(
                            (g) => g.user_id === user?.id
                          );
                          if (currentGuru?.id)
                            navigate(`/tugas-guru/${currentGuru.id}`);
                          else navigate(`/tugas-guru`);
                        } catch (e) {
                          // eslint-disable-next-line no-console
                          console.warn("Failed to resolve guru id:", e);
                          navigate(`/tugas-guru`);
                        }
                      }}
                      className={`
                      flex items-center gap-3 rounded-[10px] border h-14 w-full px-4 transition-all
                      ${
                        active
                          ? "bg-[#00ABE4] border-[#00ABE4] text-white hover:bg-[#3191B1] hover:text-white hover:border-[#00ABE4]"
                          : "bg-white border-[#BBD9FB] text-gray-800 hover:bg-[#3191B1] hover:text-black hover:border-[#3191B1]"
                      }
                    `}
                    >
                      {(() => {
                        const imgBase = "w-6 h-6";
                        const useBlack = item.iconColor === "black";
                        let imgClass = imgBase;
                        if (!useBlack && active)
                          imgClass = `${imgBase} brightness-0 invert`;
                        const imgStyle = useBlack
                          ? { filter: "brightness(0) saturate(100%)" }
                          : undefined;
                        return (
                          <img
                            src={item.icon}
                            alt={item.name}
                            className={imgClass}
                            style={imgStyle}
                          />
                        );
                      })()}
                      <span className="font-semibold text-base truncate">
                        {item.name}
                      </span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 rounded-[10px] border h-14 w-full px-4 transition-all
                      ${
                        active
                          ? "bg-[#00ABE4] border-[#00ABE4] text-white hover:bg-[#3191B1] hover:text-white hover:border-[#00ABE4]"
                          : "bg-white border-[#BBD9FB] text-gray-800 hover:bg-[#3191B1] hover:text-black hover:border-[#3191B1]"
                      }
                    `}
                  >
                    {
                      // allow some icons to render forced black via iconColor flag
                    }
                    {(() => {
                      const imgBase = "w-6 h-6";
                      const useBlack = item.iconColor === "black";
                      let imgClass = imgBase;
                      if (!useBlack && active)
                        imgClass = `${imgBase} brightness-0 invert`;
                      const imgStyle = useBlack
                        ? { filter: "brightness(0) saturate(100%)" }
                        : undefined;
                      return (
                        <img
                          src={item.icon}
                          alt={item.name}
                          className={imgClass}
                          style={imgStyle}
                        />
                      );
                    })()}
                    <span className="font-semibold text-base truncate">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.string,
};
