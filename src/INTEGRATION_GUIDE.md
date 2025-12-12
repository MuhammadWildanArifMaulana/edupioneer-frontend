# Frontend Integration Guide

Semua frontend sudah terintegrasi dengan backend API. Berikut panduan untuk menggunakan setiap module:

## 1. Authentication

### useAuth Hook

```javascript
import { useAuth } from "@/hooks/useAuth.jsx";

function MyComponent() {
  const {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated,
  } = useAuth();

  // Login
  const handleLogin = async () => {
    await login(email, password);
  };

  // Register
  const handleRegister = async () => {
    await register(email, password, name, role);
  };

  // Logout
  const handleLogout = () => {
    logout();
  };

  return <div>{isAuthenticated && <p>Welcome {user?.name}</p>}</div>;
}
```

## 2. Data Management Hooks

### useKelas

```javascript
import { useKelas } from '@/hooks/useData';

function KelasComponent() {
  const { kelasList, kelas, loading, error, getAll, getById, create, update, delete, getSiswa } = useKelas();

  // Get all kelas
  await getAll(page, limit);

  // Get kelas by id
  await getById(kelasId);

  // Get siswa in kelas
  const siswaList = await getSiswa(kelasId);
}
```

### useGuru

```javascript
import { useGuru } from '@/hooks/useData';

function GuruComponent() {
  const { guru, guruList, loading, error, getAll, getById, create } = useGuru();

  // Get all guru
  await getAll(page, limit);

  // Get guru by id
  await getById(guruId);

  // Create guru
  await create({ email, password, name, nidn });
}
```

### useSiswa

```javascript
import { useSiswa } from '@/hooks/useData';

function SiswaComponent() {
  const { siswa, siswaList, loading, error, getAll, getById, getByKelas } = useSiswa();

  // Get all siswa
  await getAll(page, limit);

  // Get siswa by id
  await getById(siswaId);

  // Get siswa in specific kelas
  await getByKelas(kelasId, page, limit);
}
```

### useTugas

```javascript
import { useTugas } from '@/hooks/useData';

function TugasComponent() {
  const { tugas, tugasList, submissions, loading, error, getAll, getById, submit, getSubmits } = useTugas();

  // Get all tugas for kelas
  await getAll(kelasId, page, limit);

  // Get tugas by id
  await getById(tugasId);

  // Submit tugas
  await submit({ tugasId, siswaId, fileUrl, deskripsi });

  // Get all submissions for tugas
  const submits = await getSubmits(tugasId);
}
```

### useMateri

```javascript
import { useMateri } from '@/hooks/useData';

function MateriComponent() {
  const { materi, materiList, loading, error, getAll, getById } = useMateri();

  // Get all materi for kelas
  await getAll(kelasId, page, limit);

  // Get materi by id
  await getById(materiId);
}
```

### useNilai

```javascript
import { useNilai } from '@/hooks/useData';

function NilaiComponent() {
  const { nilai, nilaiList, loading, error, getAll, getBySiswa } = useNilai();

  // Get all nilai
  await getAll(page, limit);

  // Get nilai for siswa
  const nilaiSiswa = await getBySiswa(siswaId);
}
```

### useAbsensi

```javascript
import { useAbsensi } from '@/hooks/useData';

function AbsensiComponent() {
  const { absensi, absensiList, loading, error, getAll, getBySiswa } = useAbsensi();

  // Get all absensi for kelas
  await getAll(kelasId, page, limit);

  // Get absensi for siswa
  const absensiSiswa = await getBySiswa(siswaId);
}
```

### useDiskusi

```javascript
import { useDiskusi } from '@/hooks/useData';

function DiskusiComponent() {
  const { diskusi, diskusiList, loading, error, getAll, getById } = useDiskusi();

  // Get all diskusi for kelas
  await getAll(kelasId, page, limit);

  // Get diskusi by id
  await getById(diskusiId);
}
```

### useSPP

```javascript
import { useSPP } from '@/hooks/useData';

function SPPComponent() {
  const { spp, sppList, loading, error, getAll, getBySiswa } = useSPP();

  // Get all SPP
  await getAll(page, limit);

  // Get SPP for siswa
  const sppSiswa = await getBySiswa(siswaId, tahun);
}
```

## 3. ProtectedRoute

Gunakan untuk melindungi routes yang memerlukan authentication:

```javascript
import ProtectedRoute from "@/components/ProtectedRoute.jsx";

<Route
  element={
    <ProtectedRoute requiredRole="siswa">
      <DashboardLayout role="siswa" />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard-siswa" element={<SiswaDashboard />} />
</Route>;
```

## 4. API Base

Semua API endpoints base di: `process.env.REACT_APP_API_URL`

### API Response Format

```javascript
{
  "success": true,
  "message": "Success message",
  "data": { /* actual data */ }
}
```

## 5. Error Handling

Semua hooks sudah include error handling:

```javascript
const { loading, error, data } = useKelas();

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

## 6. Local Storage

Token dan user info automatically disimpan di localStorage:

- Token key: `token`
- User key: `user`

## Notes

- Semua requests automatically include authorization header jika token ada
- Jika token expired (401), automatic redirect ke login
- Supported roles: `guru`, `siswa`, `admin`
