import { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import api, {
  userApi,
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
} from "../../api/index";
import Modal from "../../components/common/Modal";
import { useToast } from "../../hooks/useToast";

const ENTITY_CONFIG = {
  users: {
    label: "Users",
    api: userApi,
    columns: ["id", "name", "email", "role"],
    createFields: ["email", "name", "role", "password"],
  },
  kelas: {
    label: "Kelas",
    api: kelasApi,
    columns: ["id", "nama", "tahun_ajaran", "semester"],
    createFields: ["nama", "tahun_ajaran", "semester"],
  },
  mapel: {
    label: "Mapel",
    api: mapelApi,
    columns: ["id", "nama"],
    createFields: ["nama"],
  },
  guru: {
    label: "Guru",
    api: guruApi,
    columns: ["id", "nama", "email", "user_id"],
    createFields: ["user_id", "nama"],
  },
  siswa: {
    label: "Siswa",
    api: siswaApi,
    columns: ["id", "nama", "email", "user_id", "kelas_id", "kelas_nama"],
    createFields: ["user_id", "nama", "kelas_id"],
  },
  materi: {
    label: "Materi",
    api: {
      getAll: (page = 1, limit = 200) => materiApi.getAll(null, page, limit),
      getById: (id) => materiApi.getById(id),
      create: (d) => materiApi.create(d),
      update: (id, d) => materiApi.update(id, d),
      delete: (id) => materiApi.delete(id),
    },
    columns: ["id", "judul", "deskripsi", "guru_mapel_id", "gambar"],
    createFields: ["guru_mapel_id", "judul", "deskripsi", "file_url", "gambar"],
  },
  tugas: {
    label: "Tugas",
    api: {
      getAll: (page = 1, limit = 200) => tugasApi.getAll(null, page, limit),
      getById: (id) => tugasApi.getById(id),
      create: (d) => tugasApi.create(d),
      update: (id, d) => tugasApi.update(id, d),
      delete: (id) => tugasApi.delete(id),
    },
    columns: ["id", "judul", "deskripsi", "kelas_id", "deadline"],
    createFields: [
      "guru_mapel_id",
      "kelas_id",
      "judul",
      "deskripsi",
      "deadline",
    ],
  },
  nilai_mapel: {
    label: "Nilai Mapel",
    api: nilaiApi,
    columns: ["id", "siswa_id", "guru_mapel_id", "nilai", "semester"],
    createFields: ["siswa_id", "guru_mapel_id", "nilai", "semester"],
  },
  absensi: {
    label: "Absensi",
    api: {
      getAll: (page = 1, limit = 200) => absensiApi.getAll(null, page, limit),
      getById: (id) => absensiApi.getById(id),
      create: (d) => absensiApi.create(d),
      update: (id, d) => absensiApi.update(id, d),
      delete: (id) => absensiApi.delete(id),
    },
    columns: ["id", "guru_mapel_id", "kelas_id", "tanggal"],
    createFields: ["guru_mapel_id", "kelas_id", "tanggal"],
  },
  diskusi: {
    label: "Diskusi",
    api: {
      getAll: (page = 1, limit = 200) => diskusiApi.getAll(null, page, limit),
      getById: (id) => diskusiApi.getById(id),
      create: (d) => diskusiApi.create(d),
      update: (id, d) => diskusiApi.update(id, d),
      delete: (id) => diskusiApi.delete(id),
      getPosts: (id) => diskusiApi.getPosts(id),
      reply: (id, d) => diskusiApi.reply(id, d),
    },
    columns: ["id", "judul", "deskripsi", "kelas_id", "guru_mapel_id"],
    createFields: ["guru_mapel_id", "kelas_id", "judul", "deskripsi"],
  },
  spp: {
    label: "Pembayaran SPP",
    api: sppApi,
    columns: ["id", "siswa_id", "bulan", "tahun", "jumlah", "status"],
    createFields: ["siswa_id", "bulan", "tahun", "jumlah", "metode_pembayaran"],
  },
  // generic endpoints using default api client
  guru_mapel: {
    label: "Guru Mapel",
    api: {
      getAll: (p = 1, l = 200) => api.get(`/guru_mapel?page=${p}&limit=${l}`),
      getById: (id) => api.get(`/guru_mapel/${id}`),
      create: (d) => api.post(`/guru_mapel`, d),
      update: (id, d) => api.put(`/guru_mapel/${id}`, d),
      delete: (id) => api.delete(`/guru_mapel/${id}`),
    },
    columns: ["id", "guru_id", "mapel_id", "kelas_id"],
    createFields: ["guru_id", "mapel_id", "kelas_id"],
  },
  tugas_submit: {
    label: "Tugas Submit",
    api: {
      getAll: (p = 1, l = 200) => api.get(`/tugas_submit?page=${p}&limit=${l}`),
      getById: (id) => api.get(`/tugas_submit/${id}`),
      create: (d) => api.post(`/tugas_submit`, d),
      update: (id, d) => api.put(`/tugas_submit/${id}`, d),
      delete: (id) => api.delete(`/tugas_submit/${id}`),
    },
    columns: ["id", "tugas_id", "siswa_id", "file_url", "submitted_at"],
    createFields: ["tugas_id", "siswa_id", "file_url", "jawaban"],
  },
  materi_view: {
    label: "Materi View",
    api: {
      getAll: (p = 1, l = 200) => api.get(`/materi_view?page=${p}&limit=${l}`),
      getById: (id) => api.get(`/materi_view/${id}`),
      create: (d) => api.post(`/materi_view`, d),
      update: (id, d) => api.put(`/materi_view/${id}`, d),
      delete: (id) => api.delete(`/materi_view/${id}`),
    },
    columns: ["id", "materi_id", "siswa_id", "viewed_at"],
    createFields: ["materi_id", "siswa_id"],
  },
  diskusi_post: {
    label: "Diskusi Post",
    api: {
      getAll: (p = 1, l = 200) => api.get(`/diskusi_post?page=${p}&limit=${l}`),
      getById: (id) => api.get(`/diskusi_post/${id}`),
      create: (d) => api.post(`/diskusi_post`, d),
      update: (id, d) => api.put(`/diskusi_post/${id}`, d),
      delete: (id) => api.delete(`/diskusi_post/${id}`),
    },
    columns: ["id", "diskusi_id", "siswa_id", "isi", "created_at"],
    createFields: ["diskusi_id", "siswa_id", "isi"],
  },
  absensi_detail: {
    label: "Absensi Detail",
    api: {
      getAll: (p = 1, l = 200) =>
        api.get(`/absensi_detail?page=${p}&limit=${l}`),
      getById: (id) => api.get(`/absensi_detail/${id}`),
      create: (d) => api.post(`/absensi_detail`, d),
      update: (id, d) => api.put(`/absensi_detail/${id}`, d),
      delete: (id) => api.delete(`/absensi_detail/${id}`),
    },
    columns: ["id", "absensi_id", "siswa_id", "status"],
    createFields: ["absensi_id", "siswa_id", "status"],
  },
  roles: {
    label: "Roles",
    api: {
      getAll: (p = 1, l = 200) => api.get(`/roles?page=${p}&limit=${l}`),
      getById: (id) => api.get(`/roles/${id}`),
      create: (d) => api.post(`/roles`, d),
      update: (id, d) => api.put(`/roles/${id}`, d),
      delete: (id) => api.delete(`/roles/${id}`),
    },
    columns: ["id", "nama", "deskripsi"],
    createFields: ["nama", "deskripsi"],
  },
};

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qEntity = searchParams.get("entity") || "users";
  const [entity, setEntity] = useState(qEntity);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { addToast } = useToast();

  const cfg = useMemo(() => ENTITY_CONFIG[entity], [entity]);
  const fetchItemsFor = async (ent) => {
    const conf = ENTITY_CONFIG[ent];
    if (!conf) return;
    setLoading(true);
    setError(null);
    try {
      const res = await conf.api.getAll(1, 200);
      const data = res.data?.data || [];
      setItems(data);
    } catch (err) {
      console.error("Admin fetch error", err);
      setError(err.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => fetchItemsFor(entity);

  // react to changes in the query param (sidebar links update the query param)
  useEffect(() => {
    if (!qEntity) return;
    if (qEntity !== entity) setEntity(qEntity);
    fetchItemsFor(qEntity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qEntity]);

  // when entity changes via UI, update query param
  useEffect(() => {
    setSearchParams({ entity });
    // fetchItems will run because entity is in dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this record?")) return;
    try {
      await cfg.api.delete(id);
      addToast("Deleted", { type: "success" });
      fetchItems();
    } catch (err) {
      console.error("Delete failed", err);
      addToast("Delete failed", { type: "error" });
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      // If gambar is a File object, upload it first
      const payload = { ...formData };
      if (payload.gambar && payload.gambar instanceof File) {
        const f = new FormData();
        f.append("file", payload.gambar);
        const uploadRes = await api.post("/uploads", f, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        payload.gambar = uploadRes.data?.url || payload.gambar;
      }

      if (editItem) {
        await cfg.api.update(editItem.id, payload);
        addToast("Updated", { type: "success" });
      } else {
        await cfg.api.create(payload);
        addToast("Created", { type: "success" });
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      console.error("Save failed", err);
      addToast(err.response?.data?.message || "Save failed", { type: "error" });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Manage database entities (CRUD)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {Object.keys(ENTITY_CONFIG).map((k) => (
              <option value={k} key={k}>
                {ENTITY_CONFIG[k].label}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={openCreate}>
            Create
          </button>
        </div>
      </div>

      <div className="mt-6">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && (
          <div className="overflow-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  {cfg.columns.map((c) => (
                    <th className="px-4 py-2" key={c}>
                      {c}
                    </th>
                  ))}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t">
                    {cfg.columns.map((c) => (
                      <td className="px-4 py-2" key={c}>
                        {it[c] ?? "-"}
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 border rounded"
                          onClick={() => openEdit(it)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 border rounded text-red-600"
                          onClick={() => handleDelete(it.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? `Edit ${cfg.label}` : `Create ${cfg.label}`}
        actions={[]}
      >
        <AdminEntityForm
          fields={cfg.createFields}
          initial={editItem}
          onCancel={() => setShowModal(false)}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
}

function AdminEntityForm({ fields = [], initial = null, onCancel, onSave }) {
  const [form, setForm] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      base[f] = initial?.[f] ?? "";
    });
    return base;
  });

  useEffect(() => {
    const base = {};
    fields.forEach((f) => {
      base[f] = initial?.[f] ?? "";
    });
    setForm(base);
  }, [initial, fields]);

  const handleChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-3">
      {fields.map((f) => (
        <div key={f} className="flex flex-col">
          <label className="text-sm font-medium mb-1">{f}</label>
          {f === "gambar" ? (
            <div className="space-y-2">
              {typeof form[f] === "string" && form[f] ? (
                <img src={form[f]} alt="preview" style={{ maxWidth: 200 }} />
              ) : null}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange(f, e.target.files?.[0] ?? "")}
                className="border rounded px-3 py-2"
              />
            </div>
          ) : (
            <input
              value={form[f] ?? ""}
              onChange={(e) => handleChange(f, e.target.value)}
              className="border rounded px-3 py-2"
            />
          )}
        </div>
      ))}

      <div className="flex justify-end gap-2 mt-3">
        <button className="px-3 py-2 border rounded" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="px-3 py-2 bg-primary text-white rounded"
          onClick={() => onSave(form)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

AdminEntityForm.propTypes = {
  fields: PropTypes.array,
  initial: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
