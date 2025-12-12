// DATA DUMMY — Materi Kimia XI
export const materiKimiaXI = [
  {
    id: "kimia-xi-mipa-1",
    namaKelas: "Kimia - XI MIPA 1",
    guru: "Ayu Yunita, S.Pd.",
    list: [
      {
        id: 101,
        judulMateri: "Materi 1: Struktur Atom dan Sistem Periodik",
        deskripsi: `Apa yang Akan Anda Pelajari?
Model-Model Atom: perkembangan model atom dari Dalton sampai mekanika kuantum.
Nomor Atom & Nomor Massa: perbedaan & cara menentukan isotop.
Konfigurasi Elektron: aturan Hund, Aufbau, dan larangan Pauli.
Tren Periodik: perubahan jari‑jari atom, energi ionisasi, afinitas elektron, dll.`,

        file_url: "https://drive.google.com/file/d/xxxxxxx/view?usp=sharing",
        fileName: "Struktur atom.pdf",
        thumbnail: "/src/assets/Images/Atom.webp",

        tugas: [
          {
            id: 301,
            judul: "Tugas struktur atom",
            deskripsi:
              "Jawablah soal struktur atom nomor 1–5 pada buku pegangan halaman 32.",
            deadline: "11/11/2025",
          },
          {
            id: 302,
            judul: "Tugas ikatan kimia",
            deskripsi:
              "Jelaskan 3 jenis ikatan kimia beserta contohnya dalam kehidupan sehari‑hari.",
            deadline: "20/11/2025",
          },
        ],
      },
      {
        id: 102,
        judulMateri: "Materi 2: Ikatan Kimia dan Bentuk Molekul",
        deskripsi: `Fokus Pembelajaran:
Ikatan Ion • Ikatan Kovalen • Ikatan Logam
Bentuk Molekul (Teori VSEPR) • Polaritas Molekul.`,

        file_url: "https://drive.google.com/file/d/yyyyyyy/view?usp=sharing",
        fileName: "Ikatan kimia & molekul.pdf",
        thumbnail: "/src/assets/Images/Molecule.webp",

        tugas: [{ id: 303, judul: "Tugas ikatan kimia & molekul" }],
      },
      {
        id: 103,
        judulMateri: "Materi 3: Replikasi dari Materi 2 (dummy)",
        deskripsi: `Fokus Pembelajaran:
(Sama seperti dummy sebelumnya)`,

        file_url: "https://drive.google.com/file/d/zzzzzzz/view?usp=sharing",
        fileName: "Ikatan kimia & molekul.pdf",
        thumbnail: "/src/assets/Images/Molecule.webp",

        tugas: [{ id: 304, judul: "Tugas latihan ikatan kimia" }],
      },
    ],
  },
];
