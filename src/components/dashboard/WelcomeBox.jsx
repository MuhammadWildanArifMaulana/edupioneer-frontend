export default function WelcomeBox({ nama }) {
const firstName = nama ? nama.split(" ")[0] : "";

  return (
    <section className="mb-4">
      <h2 className="text-xl font-bold text-black">
        Selamat Datang, {firstName}!
      </h2>
      <p className="text-base text-black">
        Semoga harimu menyenangkan!
      </p>
    </section>
  );
}