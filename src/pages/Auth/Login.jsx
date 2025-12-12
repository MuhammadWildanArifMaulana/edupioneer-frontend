import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BgPattern from "../../assets/Images/BackgroundBeranda.webp";
import StudentBG from "../../assets/Images/logo.webp";
import GoogleIcon from "../../assets/icons/Google.svg";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useAuth } from "../../hooks/useAuth.jsx";
import { storageUtils } from "../../utils/storage";
import { useToast } from "../../hooks/useToast";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }

    try {
      await login(email, password);
      // read stored user (saved by useAuth) to get role
      const storedUser = storageUtils.getJSON("user");
      const role = storedUser?.role?.toLowerCase();
      if (role === "guru") navigate("/dashboard-guru");
      else if (role === "siswa") navigate("/dashboard-siswa");
      else if (role === "admin") navigate("/dashboard-admin");
      else navigate("/");
      addToast("Login berhasil", { type: "success" });
    } catch (err) {
      setError(authError || "Login gagal, coba lagi");
      addToast(authError || "Login gagal", { type: "error" });
    }
  };

  const handleLoginGoogle = () => {
    console.log("GOOGLE LOGIN clicked");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${BgPattern})` }}
    >
      <Card
        variant="blue"
        size="lg"
        className="flex flex-col md:flex-row w-full max-w-[1100px] min-h-[620px]"
      >
        {/* LEFT — LOGO */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1 p-6">
          <div className="w-[450px] h-[540px] rounded-[20px] bg-white overflow-hidden shadow-md flex items-center justify-center">
            <img
              src={StudentBG}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT — FORM */}
        <div className="flex flex-col justify-center px-6 md:px-10 py-6 md:py-8 flex-1">
          <h1 className="text-2xl font-bold mb-7">Login</h1>

          {error && (
            <div className="mb-5 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Input
            placeholder="Email"
            type="email"
            className="mb-5 md:w-[350px]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
          />

          <Input
            placeholder="Password"
            type="password"
            className="mb-5 md:w-[350px]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={authLoading}
          />

          <Button
            variant="primary"
            className="md:w-[350px] mb-4"
            onClick={handleLogin}
            disabled={authLoading}
          >
            {authLoading ? "Loading..." : "Login"}
          </Button>

          <Link
            to="/forgot-password"
            className="text-sm text-[#0021F9] hover:underline mb-5"
          >
            Lupa Password?
          </Link>

          <div className="flex items-center gap-3 md:w-[350px] mb-4">
            <div className="flex-1 border-t border-gray-400"></div>
            <span className="text-sm text-gray-500">Atau</span>
            <div className="flex-1 border-t border-gray-400"></div>
          </div>

          <button
            className="md:w-[350px] h-[42px] rounded-[10px] bg-white shadow flex items-center justify-center gap-3 text-sm font-medium hover:bg-gray-50"
            onClick={handleLoginGoogle}
          >
            <img src={GoogleIcon} alt="Google" className="w-5" />
            <span>Login dengan Google</span>
          </button>

          <p className="text-sm mt-4">
            Jika belum punya akun,&nbsp;
            <Link to="/register" className="text-[#0052F5] hover:underline">
              Daftar
            </Link>
            &nbsp;disini!
          </p>
        </div>
      </Card>
    </div>
  );
}
