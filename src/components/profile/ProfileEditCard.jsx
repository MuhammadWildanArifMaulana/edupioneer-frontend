import { useState } from "react";
import ProfileIcon from "/src/assets/icons/Profile.svg";
import EditIcon from "/src/assets/icons/Edit.svg";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../hooks/useToast";
import { userApi } from "../../api/index";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export default function ProfileEditCard({ initialProfile, onCancel, onSave }) {
  const [form, setForm] = useState(initialProfile);
  const [avatarPreview, setAvatarPreview] = useState(
    initialProfile.avatarUrl || null
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const { user } = useAuth();
  const { addToast } = useToast();

  // password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !ALLOWED_TYPES.includes(file.type)) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // pass both profile form and avatarFile to the parent handler
    onSave({ ...form }, avatarFile);
  };

  const handleChangePassword = async () => {
    if (!user?.id) {
      addToast("User not authenticated", { type: "error" });
      return;
    }
    if (!currentPassword || !newPassword) {
      addToast("Masukkan kata sandi saat ini dan kata sandi baru", {
        type: "error",
      });
      return;
    }
    if (newPassword.length < 6) {
      addToast("Kata sandi baru minimal 6 karakter", { type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Konfirmasi kata sandi tidak cocok", { type: "error" });
      return;
    }

    try {
      setPwdLoading(true);
      await userApi.changePassword(user.id, currentPassword, newPassword);
      addToast("Kata sandi berhasil diubah", { type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error", err);
      addToast(err?.response?.data?.message || "Gagal mengganti kata sandi", {
        type: "error",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <section className="w-full flex justify-center px-4 py-8">
      <Card variant="blue" size="lg" className="w-full max-w-[1250px]">
        <form onSubmit={handleSubmit}>
          {/* JUDUL */}
          <h1 className="text-xl font-bold mb-6">Edit Profil</h1>

          {/* FOTO PROFIL */}
          <div className="flex flex-col gap-3 mb-10">
            <span className="font-semibold">Foto Profil</span>

            <div className="relative w-[135px] h-[135px]">
              <label className="w-full h-full block rounded-full overflow-hidden cursor-pointer border-[6px] border-white shadow">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#E6F3FF]">
                    <img
                      src={ProfileIcon}
                      alt="avatar icon"
                      className="w-8 h-8"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>

              {/* ICON EDIT */}
              <label
                className="
                  absolute bottom-1 right-1
                  w-9 h-9 rounded-full bg-[#00ABE4] text-white shadow-md
                  flex items-center justify-center cursor-pointer
                  hover:bg-[#0889bf] transition active:scale-[0.97]
                "
              >
                <img src={EditIcon} className="w-4 h-4 object-contain" />
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* FORM INPUTS */}
          <div className="flex flex-col gap-6">
            <Input
              label="Nama Lengkap"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <Input label="Status" value={form.status} disabled />

            <Input
              label="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <Input
              label="Nomor Telepon"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          {/* Change Password Section */}
          <div className="mt-8 p-4 border rounded bg-white">
            <h2 className="font-semibold mb-3">Ganti Kata Sandi</h2>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Kata sandi saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                placeholder="Kata sandi baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="password"
                placeholder="Konfirmasi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleChangePassword}
                  className="w-auto"
                  disabled={pwdLoading}
                >
                  {pwdLoading ? "Menyimpan..." : "Ubah Kata Sandi"}
                </Button>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Batalkan
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}

/* Reusable input */
function Input({ label, value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold">{label}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-[10px] px-4 py-2 outline-none ${
          disabled
            ? "bg-gray-100 cursor-not-allowed text-gray-500"
            : "border-[#BBD9FB] focus:ring-2 focus:ring-[#00ABE4]"
        }`}
      />
    </div>
  );
}
