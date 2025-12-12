import { useState } from "react";
import { useParams } from "react-router-dom";
import { materiKimiaXI } from "../../data/materiKimiaXI";
import SearchIcon from "../../assets/icons/Search.svg";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

export default function EditSiswa() {
  const { id } = useParams();

  const kelas = materiKimiaXI.find((k) => k.id === id);
  if (!kelas) return <p className="p-6">Kelas tidak ditemukan</p>;

  const [query, setQuery] = useState("");
  const [siswaList, setSiswaList] = useState(kelas.siswa || []);

  const hasilCari = siswaList.filter((s) =>
    s.nama.toLowerCase().includes(query.toLowerCase())
  );

  const hapusSiswa = (siswa) => {
    const updated = siswaList.filter((x) => x.id !== siswa.id);
    setSiswaList(updated);
    kelas.siswa = updated;
  };

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">
          Daftar Siswa {kelas.namaKelas}
        </h2>

        {/* SEARCH */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-60">
            <Input
              placeholder="Cari Siswa"
              icon={SearchIcon}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="w-full min-w-[900px] bg-white shadow rounded-[12px] text-sm">
            <thead className="bg-[#00ABE4] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Foto profil</th>
                <th className="py-3 px-4 text-left">Nama siswa</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Nomor Telepon</th>
                <th className="py-3 px-4 text-center w-[120px]">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {hasilCari.map((siswa) => (
                <tr key={siswa.id} className="border-b">
                  <td className="py-3 px-4">
                    <img
                      src={siswa.foto}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{siswa.nama}</td>
                  <td className="py-3 px-4">{siswa.status}</td>
                  <td className="py-3 px-4">{siswa.email}</td>
                  <td className="py-3 px-4">{siswa.telepon}</td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      className="px-3 py-1 text-xs sm:text-sm whitespace-nowrap rounded-md min-w-[80px]"
                      onClick={() => hapusSiswa(siswa)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
