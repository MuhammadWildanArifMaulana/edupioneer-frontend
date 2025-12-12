import { useState, useCallback } from "react";
import {
  kelasApi,
  mapelApi,
  guruApi,
  siswaApi,
  materiApi,
  tugasApi,
  nilaiApi,
  absensiApi,
  diskusiApi,
  sppApi,
  userApi,
} from "../api/index";

// ============= USE KELAS =============
export const useKelas = () => {
  const [kelas, setKelas] = useState(null);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await kelasApi.getAll(page, limit);
      setKelasList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch kelas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await kelasApi.getById(id);
      setKelas(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch kelas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await kelasApi.create(data);
        setKelasList([...kelasList, response.data.data]);
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create kelas");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [kelasList]
  );

  const update = useCallback(
    async (id, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await kelasApi.update(id, data);
        setKelasList(
          kelasList.map((k) => (k.id === id ? response.data.data : k))
        );
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to update kelas");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [kelasList]
  );

  const delete_ = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        await kelasApi.delete(id);
        setKelasList(kelasList.filter((k) => k.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete kelas");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [kelasList]
  );

  const getSiswa = useCallback(async (kelasId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await kelasApi.getSiswa(kelasId);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch siswa");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    kelas,
    kelasList,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    delete: delete_,
    getSiswa,
  };
};

// ============= USE GURU =============
export const useGuru = () => {
  const [guru, setGuru] = useState(null);
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await guruApi.getAll(page, limit);
      setGuruList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch guru");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await guruApi.getById(id);
      setGuru(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch guru");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await guruApi.create(data);
        setGuruList([...guruList, response.data.data]);
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create guru");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [guruList]
  );

  return {
    guru,
    guruList,
    loading,
    error,
    getAll,
    getById,
    create,
  };
};

// ============= USE SISWA =============
export const useSiswa = () => {
  const [siswa, setSiswa] = useState(null);
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await siswaApi.getAll(page, limit);
      setSiswaList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch siswa");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await siswaApi.getById(id);
      setSiswa(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch siswa");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getByKelas = useCallback(async (kelasId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await siswaApi.getByKelas(kelasId, page, limit);
      setSiswaList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch siswa");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    siswa,
    siswaList,
    loading,
    error,
    getAll,
    getById,
    getByKelas,
  };
};

// ============= USE TUGAS =============
export const useTugas = () => {
  const [tugas, setTugas] = useState(null);
  const [tugasList, setTugasList] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (kelasId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tugasApi.getAll(kelasId, page, limit);
      setTugasList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tugas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tugasApi.getById(id);
      setTugas(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tugas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submit = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tugasApi.submit(data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit tugas");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSubmits = useCallback(async (tugasId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tugasApi.getSubmits(tugasId);
      setSubmissions(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch submissions");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tugas,
    tugasList,
    submissions,
    loading,
    error,
    getAll,
    getById,
    submit,
    getSubmits,
  };
};

// ============= USE MATERI =============
export const useMateri = () => {
  const [materi, setMateri] = useState(null);
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (guruMapelId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materiApi.getAll(guruMapelId, page, limit);
      setMateriList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch materi");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await materiApi.getById(id);
      setMateri(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch materi");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    materi,
    materiList,
    loading,
    error,
    getAll,
    getById,
  };
};

// ============= USE NILAI =============
export const useNilai = () => {
  const [nilai, setNilai] = useState(null);
  const [nilaiList, setNilaiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await nilaiApi.getAll(page, limit);
      setNilaiList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch nilai");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBySiswa = useCallback(async (siswaId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await nilaiApi.getBySiswa(siswaId);
      setNilaiList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch nilai");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    nilai,
    nilaiList,
    loading,
    error,
    getAll,
    getBySiswa,
  };
};

// ============= USE ABSENSI =============
export const useAbsensi = () => {
  const [absensi, setAbsensi] = useState(null);
  const [absensiList, setAbsensiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (kelasId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await absensiApi.getAll(kelasId, page, limit);
      setAbsensiList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch absensi");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBySiswa = useCallback(async (siswaId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await absensiApi.getBySiswa(siswaId);
      setAbsensiList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch absensi");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    absensi,
    absensiList,
    loading,
    error,
    getAll,
    getBySiswa,
  };
};

// ============= USE DISKUSI =============
export const useDiskusi = () => {
  const [diskusi, setDiskusi] = useState(null);
  const [diskusiList, setDiskusiList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (kelasId, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await diskusiApi.getAll(kelasId, page, limit);
      setDiskusiList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch diskusi");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await diskusiApi.getById(id);
      setDiskusi(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch diskusi");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    diskusi,
    diskusiList,
    loading,
    error,
    getAll,
    getById,
  };
};

// ============= USE SPP =============
export const useSPP = () => {
  const [spp, setSpp] = useState(null);
  const [sppList, setSppList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sppApi.getAll(page, limit);
      setSppList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch SPP");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBySiswa = useCallback(async (siswaId, tahun) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sppApi.getBySiswa(siswaId, tahun);
      setSppList(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch SPP");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    spp,
    sppList,
    loading,
    error,
    getAll,
    getBySiswa,
  };
};
