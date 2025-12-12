import axios from "axios";

// NOTE: during local debugging we may override backend port if needed
// Vite exposes env vars via `import.meta.env`. Use `VITE_API_BASE_URL` if set.
// Default to port 5000 to match local backend preference.
// Prefer Vite env var `VITE_API_BASE_URL`, fall back to `REACT_APP_API_URL` for local compat.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  // Helpful debug message during development/build when env var is missing
  // Vite expects env vars prefixed with VITE_, so set `VITE_API_BASE_URL` in deployment.
  // eslint-disable-next-line no-console
  console.error(
    "API base URL not set. Please set VITE_API_BASE_URL in your environment (Vercel Environment Variables)."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============= KELAS API =============
export const kelasApi = {
  getAll: (page = 1, limit = 10, guruId = null) => {
    const url = guruId
      ? `/kelas?page=${page}&limit=${limit}&guruId=${guruId}`
      : `/kelas?page=${page}&limit=${limit}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/kelas/${id}`),
  create: (data) => api.post("/kelas", data),
  update: (id, data) => api.put(`/kelas/${id}`, data),
  delete: (id) => api.delete(`/kelas/${id}`),
  getSiswa: (kelasId) => api.get(`/kelas/${kelasId}/siswa`),
  // student join request
  requestJoin: (kelasId) => api.post(`/kelas/${kelasId}/join-requests`),
  // list pending requests for kelas (guru/admin)
  getJoinRequests: (kelasId) => api.get(`/kelas/${kelasId}/join-requests`),
};

// ============= MAPEL API =============
export const mapelApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/mapel?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/mapel/${id}`),
  create: (data) => api.post("/mapel", data),
  update: (id, data) => api.put(`/mapel/${id}`, data),
  delete: (id) => api.delete(`/mapel/${id}`),
};

// ============= GURU API =============
export const guruApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/guru?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/guru/${id}`),
  getMapel: (guruId) => api.get(`/guru/${guruId}/mapel`),
  create: (data) => api.post("/guru", data),
  update: (id, data) => api.put(`/guru/${id}`, data),
  delete: (id) => api.delete(`/guru/${id}`),
  assignMapel: (guruId, data) => api.post(`/guru/${guruId}/assign-mapel`, data),
};

// ============= SISWA API =============
export const siswaApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/siswa?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/siswa/${id}`),
  getByKelas: (kelasId, page = 1, limit = 10) =>
    api.get(`/siswa?kelasId=${kelasId}&page=${page}&limit=${limit}`),
  create: (data) => api.post("/siswa", data),
  update: (id, data) => api.put(`/siswa/${id}`, data),
  delete: (id) => api.delete(`/siswa/${id}`),
  enrollKelas: (siswaId, kelasId) =>
    api.post(`/siswa/${siswaId}/enroll/${kelasId}`),
};

// ============= MATERI API =============
export const materiApi = {
  // Accept optional guru_mapel_id as first parameter (backend expects `guru_mapel_id`)
  getAll: (guruMapelId = null, page = 1, limit = 10) => {
    const q = [];
    if (guruMapelId) q.push(`guru_mapel_id=${guruMapelId}`);
    q.push(`page=${page}`);
    q.push(`limit=${limit}`);
    return api.get(`/materi?${q.join("&")}`);
  },
  getById: (id) => api.get(`/materi/${id}`),
  create: (data) => api.post("/materi", data),
  update: (id, data) => api.put(`/materi/${id}`, data),
  delete: (id) => api.delete(`/materi/${id}`),
};

// ============= TUGAS API =============
export const tugasApi = {
  // Backend expects optional `kelas_id` as query param
  getAll: (kelasId = null, page = 1, limit = 10) => {
    const q = [];
    if (kelasId) q.push(`kelas_id=${kelasId}`);
    q.push(`page=${page}`);
    q.push(`limit=${limit}`);
    return api.get(`/tugas?${q.join("&")}`);
  },
  getById: (id) => api.get(`/tugas/${id}`),
  create: (data) => api.post("/tugas", data),
  update: (id, data) => api.put(`/tugas/${id}`, data),
  delete: (id) => api.delete(`/tugas/${id}`),
  submit: (data) => api.post("/tugas/submit", data),
  // Fetch submissions across all tugas for the authenticated guru
  getSubmissions: () => api.get(`/tugas/submissions`),
  getSubmits: (tugasId) => api.get(`/tugas/${tugasId}/submits`),
  updateSubmission: (submissionId, data) =>
    api.put(`/tugas/submission/${submissionId}`, data),
  getSubmissionById: (submissionId) =>
    api.get(`/tugas/submission/${submissionId}`),
};

export const joinApi = {
  decide: (joinRequestId, action) =>
    api.put(`/join-requests/${joinRequestId}`, { action }),
  listForGuru: () => api.get("/guru/me/join-requests"),
};

// ============= NILAI API =============
export const nilaiApi = {
  // Accept optional siswaId filter
  getAll: (page = 1, limit = 10, siswaId = null) => {
    const q = [`page=${page}`, `limit=${limit}`];
    if (siswaId) q.push(`siswa_id=${siswaId}`);
    return api.get(`/nilai?${q.join("&")}`);
  },
  getById: (id) => api.get(`/nilai/${id}`),
  getBySiswa: (siswaId) => api.get(`/nilai/siswa/${siswaId}`),
  getByTugas: (tugasId) => api.get(`/nilai/tugas/${tugasId}`),
  create: (data) => api.post("/nilai", data),
  update: (id, data) => api.put(`/nilai/${id}`, data),
  delete: (id) => api.delete(`/nilai/${id}`),
};

// ============= ABSENSI API =============
export const absensiApi = {
  getAll: (kelasId, page = 1, limit = 10) => {
    const q = [];
    if (kelasId) q.push(`kelasId=${kelasId}`);
    q.push(`page=${page}`);
    q.push(`limit=${limit}`);
    return api.get(`/absensi?${q.join("&")}`);
  },
  getById: (id) => api.get(`/absensi/${id}`),
  // backend expects siswa_id as a query parameter on GET /api/absensi
  getBySiswa: (siswaId) => api.get(`/absensi?siswa_id=${siswaId}`),
  create: (data) => api.post("/absensi", data),
  update: (id, data) => api.put(`/absensi/${id}`, data),
  delete: (id) => api.delete(`/absensi/${id}`),
};

// ============= DISKUSI API =============
export const diskusiApi = {
  // backend expects `kelas_id` as query param and supports optional pagination
  getAll: (kelasId, page = 1, limit = 10) => {
    const q = [];
    if (kelasId) q.push(`kelas_id=${kelasId}`);
    q.push(`page=${page}`);
    q.push(`limit=${limit}`);
    return api.get(`/diskusi?${q.join("&")}`);
  },
  getById: (id) => api.get(`/diskusi/${id}`),
  create: (data) => api.post("/diskusi", data),
  update: (id, data) => api.put(`/diskusi/${id}`, data),
  delete: (id) => api.delete(`/diskusi/${id}`),
  // backend route for posting a comment is POST /api/diskusi/:id/post
  reply: (diskusiId, data) => api.post(`/diskusi/${diskusiId}/post`, data),
  // fetch posts for a diskusi
  getPosts: (diskusiId) => api.get(`/diskusi/${diskusiId}/posts`),
};

// ============= SPP API =============
export const sppApi = {
  getAll: (page = 1, limit = 10) => api.get(`/spp?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/spp/${id}`),
  getBySiswa: (siswaId, tahun) =>
    api.get(`/spp/siswa/${siswaId}${tahun ? `?tahun=${tahun}` : ""}`),
  create: (data) => api.post("/spp", data),
  updateStatus: (id, status) => api.put(`/spp/${id}/status`, { status }),
};

// ============= USER API =============
export const userApi = {
  getAll: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  uploadAvatar: (id, formData) =>
    api.put(`/users/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => api.delete(`/users/${id}`),
  changePassword: (id, currentPassword, newPassword) =>
    api.put(`/users/${id}/password`, {
      current_password: currentPassword,
      new_password: newPassword,
    }),
};

export default api;
