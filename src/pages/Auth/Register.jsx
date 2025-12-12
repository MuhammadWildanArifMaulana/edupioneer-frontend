import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BgPattern from "../../assets/Images/BackgroundBeranda.webp";
import StudentBG from "../../assets/Images/logo.webp";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";
import Card from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useToast } from "../../hooks/useToast";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading: authLoading, error: authError } = useAuth();
  const { addToast } = useToast();
  const [role, setRole] = useState("siswa");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !role) {
      setError("Semua field harus diisi");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      await register(email, password, name, role.toLowerCase());
      addToast("Registrasi berhasil. Silakan login.", { type: "success" });
      navigate("/login");
    } catch (err) {
      const message = authError || "Registrasi gagal, coba lagi";
      setError(message);
      addToast(message, { type: "error" });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${BgPattern})` }}
    >
      <Card
        variant="blue"
        size="lg"
        className="flex flex-col md:flex-row w-full max-w-[1133px] min-h-[676px]"
      >
        {/* LEFT — FORM */}
        <div className="flex flex-col justify-center px-8 md:px-12 py-10 flex-1 max-w-[550px] mx-auto">
          <h1 className="text-[24px] font-bold mb-7">Daftar Akun</h1>

          {error && (
            <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* SELECT ROLE */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-base whitespace-nowrap">Daftar sebagai:</span>
            <div className="w-[130px]">
              <Select
                value={role}
                onChange={(v) => setRole(v)}
                options={["Guru", "Siswa"]}
                className="h-8 text-sm"
              />
            </div>
          </div>

          <Input
            placeholder="Nama"
            className="mb-5 w-full md:w-[350px]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={authLoading}
          />
          <Input
            type="email"
            placeholder="Email"
            className="mb-5 w-full md:w-[350px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            className="mb-7 w-full md:w-[350px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
          />

          <Button
            variant="primary"
            className="w-full md:w-[350px] mb-4"
            onClick={handleRegister}
            disabled={authLoading}
          >
            {authLoading ? "Loading..." : "Daftar"}
          </Button>

          <p className="text-sm text-gray-700">
            Jika sudah punya akun,&nbsp;
            <Link
              to="/login"
              className="text-[#0052F5] font-medium hover:underline"
            >
              Login
            </Link>
            &nbsp;disini!
          </p>
        </div>

        {/* RIGHT — LOGO */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1 p-8">
          <div className="w-[480px] h-[560px] rounded-[20px] bg-white overflow-hidden shadow-md flex items-center justify-center">
            <img
              src={StudentBG}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
