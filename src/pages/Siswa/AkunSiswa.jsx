import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { storageUtils } from "../../utils/storage";
import { useToast } from "../../hooks/useToast";
import { userApi } from "../../api/index";
import ProfileViewCard from "../../components/profile/ProfileViewCard";
import ProfileEditCard from "../../components/profile/ProfileEditCard";

export default function AkunSiswa() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const res = await userApi.getById(user.id);
          const userData = res.data?.data || {};
          setProfile({
            name: userData.name || user?.name || "Siswa",
            email: userData.email || user?.email || "",
            status: userData.role || user?.role || "Siswa",
            phone: userData.phone || "",
            avatarUrl: userData.avatar_url || null,
          });
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        addToast("Gagal memuat profil", { type: "error" });
        setProfile({
          name: user?.name || "Siswa",
          email: user?.email || "",
          status: user?.role || "Siswa",
          phone: "",
          avatarUrl: null,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchProfile();
  }, [user?.id]);

  const handleSave = async (updatedProfile, avatarFile) => {
    try {
      if (!user?.id) return;
      setLoading(true);

      let avatarUrl = updatedProfile.avatarUrl || null;

      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const uploadRes = await userApi.uploadAvatar(user.id, fd);
        avatarUrl = uploadRes.data?.data?.avatar_url || avatarUrl;
      }

      const updateRes = await userApi.update(user.id, {
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        avatar_url: avatarUrl,
      });

      const saved = updateRes.data?.data || {};
      setProfile({
        name: saved.name || updatedProfile.name,
        email: saved.email || updatedProfile.email,
        status: saved.role || updatedProfile.status,
        phone: saved.phone || updatedProfile.phone,
        avatarUrl: saved.avatar_url || avatarUrl,
      });
      setMode("view");
      const existing = storageUtils.getJSON("user") || {};
      updateUser({
        ...existing,
        avatar_url: saved.avatar_url,
        name: saved.name,
        email: saved.email,
      });
      addToast("Profil berhasil diperbarui!", { type: "success" });
    } catch (err) {
      console.error("Update profile error:", err);
      addToast("Gagal menyimpan profil", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-500">Memuat profil...</div>
    );
  if (!profile)
    return (
      <div className="p-4 text-center text-gray-500">
        Profil tidak ditemukan
      </div>
    );

  return (
    <div className="w-full relative">
      {mode === "view" ? (
        <ProfileViewCard profile={profile} onEdit={() => setMode("edit")} />
      ) : (
        <ProfileEditCard
          initialProfile={profile}
          onCancel={() => setMode("view")}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
