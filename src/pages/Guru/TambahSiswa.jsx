import { useState } from "react";
import { useParams } from "react-router-dom";
import { allStudents } from "../../data/allStudents";
import { materiKimiaXI } from "../../data/materiKimiaXI";
import SearchIcon from "../../assets/icons/Search.svg";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

export default function TambahSiswa() {
  const { id } = useParams();

  const kelas = materiKimiaXI.find((k) => k.id === id);
  const [query, setQuery] = useState("");
  const [siswaDiKelas, setSiswaDiKelas] = useState(kelas?.siswa || []);

  const hasilCari = allStudents.filter((s) =>
    s.nama.toLowerCase().includes(query.toLowerCase())
  );

  const tambahKeKelas = (siswa) => {
    if (siswaDiKelas.some((x) => x.id === siswa.id)) return;
    const update = [...siswaDiKelas, siswa];
    setSiswaDiKelas(update);
    kelas.siswa = update;
  };

  return (
    <div className="p-6 w-full flex justify-center">
      <Card variant="blue" size="lg" className="w-full max-w-[1300px]">
        <h2 className="text-xl font-bold mb-6">Tambah Siswa</h2>

        {/* SEARCH */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-60">
            <Input
              placeholder="Cari Siswa"
              icon={SearchIcon}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {hasilCari.map((siswa) => {
                const sudahAda = siswaDiKelas.some((x) => x.id === siswa.id);
                return (
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

                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={sudahAda}
                          onClick={() => tambahKeKelas(siswa)}
                          className="px-3 py-1 text-xs sm:text-sm whitespace-nowrap rounded-md"
                        >
                          {sudahAda ? "Ditambahkan" : "Tambah"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
