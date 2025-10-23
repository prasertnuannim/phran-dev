export default function ComingSoonPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center px-6">
      <h1 className="text-6xl md:text-7xl font-extrabold text-green-400 mb-4">
        พราน Dev
      </h1>

      <p className="text-2xl md:text-3xl text-gray-300 mb-8">
        “ล่าความฉลาดในทุกระบบของคุณ”
      </p>

      <p className="text-gray-400 text-lg mb-12">
        เราคือทีมพัฒนาและระบบอัตโนมัติ ที่รวมพลังของ{" "}
        <span className="text-green-400 font-semibold">AI + Automation + IoT</span>{" "}
        เพื่อสร้างธุรกิจที่ทำงานแทนคุณได้
      </p>

      <div className="text-2xl md:text-3xl font-bold text-gray-500 animate-pulse">
        เตรียมพบกับเราเร็ว ๆ นี้...
      </div>

      <footer className="absolute bottom-6 text-gray-600 text-sm">
        © {new Date().getFullYear()} พราน Dev | phran.dev
      </footer>
    </main>
  );
}