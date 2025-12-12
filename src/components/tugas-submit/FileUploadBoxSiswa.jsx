import UploadIcon from "../../assets/icons/Plus.svg";

export default function FileUploadBoxSiswa({ file, setFile }) {
  const handleChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    const ext = f.name.split(".").pop();
    const renamed = `Tugas_${Date.now()}.${ext}`;
    const renamedFile = new File([f], renamed, { type: f.type });

    setFile(renamedFile);
  };

  return (
    <label
      className="
      w-full border rounded-[10px] py-3 px-4 flex justify-between items-center
      cursor-pointer hover:bg-[#E9F1FA] transition
    "
    >
      <span className="text-sm text-black">
        {file ? file.name : "Upload tugas"}
      </span>
      <img src={UploadIcon} className="w-4 h-4" />
      <input type="file" hidden onChange={handleChange} />
    </label>
  );
}
