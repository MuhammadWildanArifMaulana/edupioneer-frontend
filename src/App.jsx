import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import SiswaDashboard from "./pages/Siswa/SiswaDashboard";
import DaftarKelasSiswa from "./pages/Siswa/DaftarKelasSiswa";
import MateriDetail from "./pages/Siswa/Materi/MateriDetail";
import GuruDashboard from "./pages/Guru/GuruDashboard";
import Tugas from "./pages/Siswa/TugasSiswa";
import TugasSubmit from "./pages/Siswa/TugasSubmit";
import AkunSiswa from "./pages/Siswa/AkunSiswa";
import GuruKelasList from "./pages/Guru/KelasList";
import KelasGuru from "./pages/Guru/KelasGuru";
import DetailKelasGuru from "./pages/Guru/DetailKelasGuru";
import TambahMateri from "./pages/Guru/TambahMateri";
import EditMateri from "./pages/Guru/EditMateri";
import TambahKelas from "./pages/Guru/TambahKelas";
import TambahTugas from "./pages/Guru/TambahTugas";
import EditTugas from "./pages/Guru/EditTugas";
import EditKelas from "./pages/Guru/EditKelas";
import TambahSiswa from "./pages/Guru/TambahSiswa";
import EditSiswa from "./pages/Guru/EditSiswa";
import MenuTugasGuru from "./pages/Guru/MenuTugasGuru";
import DetailNilaiTugas from "./pages/Guru/DetailNilaiTugas";
import NilaiTugasGuru from "./pages/Guru/NilaiTugasGuru";
import AkunGuru from "./pages/Guru/AkunGuru";
import AkunAdmin from "./pages/Admin/AkunAdmin";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ToastProvider } from "./hooks/useToast";
import ToastContainer from "./components/ToastContainer";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Siswa Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="siswa">
            <DashboardLayout
              role="siswa"
              user={{
                name: user?.name || "Siswa",
                role: "Siswa",
                avatar: user?.avatar_url || user?.avatar || null,
              }}
            />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard-siswa" element={<SiswaDashboard />} />
        <Route path="/kelas-siswa" element={<DaftarKelasSiswa />} />
        <Route path="/materi/:id" element={<MateriDetail />} />
        <Route path="/tugas-siswa" element={<Tugas />} />
        <Route path="/tugas/:id" element={<TugasSubmit />} />
        <Route path="/akun-siswa" element={<AkunSiswa />} />
      </Route>

      {/* Guru Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="guru">
            <DashboardLayout
              role="guru"
              user={{
                name: user?.name || "Guru",
                role: "Guru",
                avatar: user?.avatar_url || user?.avatar || null,
              }}
            />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard-guru" element={<GuruDashboard />} />
        <Route path="/kelas-guru" element={<GuruKelasList />} />
        <Route path="/kelas-guru/guru/:guru_id" element={<KelasGuru />} />
        <Route path="/kelas-guru/:id" element={<DetailKelasGuru />} />
        <Route
          path="/kelas-guru/:id/tambah-materi"
          element={<TambahMateri />}
        />
        <Route
          path="/kelas-guru/:id/edit-materi/:materiId"
          element={<EditMateri />}
        />
        <Route path="/kelas-guru/tambah" element={<TambahKelas />} />
        <Route path="/kelas-guru/:id/tambah-tugas" element={<TambahTugas />} />
        <Route
          path="/kelas-guru/:id/edit-tugas/:tugasId"
          element={<EditTugas />}
        />
        <Route path="/kelas-guru/:id/edit" element={<EditKelas />} />
        <Route path="/kelas-guru/:id/tambah-siswa" element={<TambahSiswa />} />
        <Route path="/kelas-guru/:id/lihat-siswa" element={<EditSiswa />} />
        <Route path="/tugas-guru" element={<MenuTugasGuru />} />
        <Route path="/tugas-guru/:guru_id" element={<MenuTugasGuru />} />
        <Route
          path="/tugas-guru/nilai/:tugasId/:siswaId"
          element={<NilaiTugasGuru />}
        />
        <Route
          path="/tugas-guru/nilai/:tugasId/:siswaId/detail"
          element={<DetailNilaiTugas />}
        />
        <Route path="/akun-guru" element={<AkunGuru />} />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout
              role="admin"
              user={{
                name: user?.name || "Admin",
                role: "Admin",
                avatar: user?.avatar_url || user?.avatar || null,
              }}
            />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/akun-admin" element={<AkunAdmin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  );
}
