import PersonIcon from "../../assets/icons/Person.svg";
import SuitcaseIcon from "../../assets/icons/Suitcase.svg";
import EmailIcon from "../../assets/icons/Email.svg";
import PhoneIcon from "../../assets/icons/Phone.svg";
import EditIcon from "../../assets/icons/Edit.svg";
import ProfileIcon from "../../assets/icons/Profile.svg";

import Button from "../common/Button";
import Card from "../common/Card";

export default function ProfileViewCard({ profile, onEdit }) {
  const { name, email, status, phone, avatarUrl } = profile;

  return (
    <section className="w-full flex justify-center px-4 py-8">
      <Card variant="blue" size="lg" className="w-full max-w-[1250px]">
        {/* JUDUL */}
        <h1 className="text-xl font-bold text-black mb-4">Akun Saya</h1>

        {/* HEADER BIRU */}
        <div className="relative w-full bg-[#BBD9FB] h-[150px] rounded-t-[20px] flex items-center justify-center">
          {/* TOMBOL EDIT PROFIL */}
          <Button
            icon={EditIcon}
            variant="primary"
            onClick={onEdit}
            className="absolute top-6 right-6 h-[39px] px-4 rounded-[8px] z-20 flex items-center gap-2"
          >
            <span className="hidden sm:inline text-sm font-semibold">
              Edit Profil
            </span>
          </Button>

          {/* AVATAR */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="
                absolute left-1/2 transform -translate-x-1/2
                w-[135px] h-[135px]
                rounded-full object-cover
                border-[7px] border-white
                -bottom-[65px]
                z-10
              "
            />
          ) : (
            <div
              className="
                absolute left-1/2 transform -translate-x-1/2
                w-[135px] h-[135px]
                rounded-full flex items-center justify-center
                bg-[#E6F3FF] border-[7px] border-white -bottom-[65px] z-10
              "
            >
              <img
                src={ProfileIcon}
                alt="avatar icon"
                className="w-12 h-12 opacity-90"
              />
            </div>
          )}
        </div>

        {/* CARD PUTIH */}
        <div className="bg-white rounded-b-[20px] shadow p-10 pt-[95px] mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* NAMA */}
            <ProfileField icon={PersonIcon} label="Nama Lengkap" value={name} />

            {/* EMAIL */}
            <ProfileField
              icon={EmailIcon}
              label="Email"
              value={email}
              className="break-all"
            />

            {/* STATUS */}
            <ProfileField icon={SuitcaseIcon} label="Status" value={status} />

            {/* TELEPON */}
            <ProfileField
              icon={PhoneIcon}
              label="Nomor Telepon"
              value={phone}
            />
          </div>
        </div>
      </Card>
    </section>
  );
}

function ProfileField({ icon, label, value, className = "" }) {
  return (
    <div>
      <div className="flex items-center gap-2 font-semibold text-gray-800 text-base">
        <img src={icon} className="w-5 h-5" />
        {label}
      </div>
      <p className={`text-gray-700 mt-1 ${className}`}>{value}</p>
      <div className="w-full h-[2px] bg-[#00ABE4] mt-1" />
    </div>
  );
}
