
import Link from "next/link";

export default function NotFound() {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-6 border border-gray-200"
      >
        <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full">
          {/* Ikon atau 404 besar */}
          <div 
            className="text-7xl font-extrabold mb-4"
          >
            404
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            Halaman Tidak Ditemukan
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin halaman tersebut telah dihapus atau URL-nya salah.
          </p>
          
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-xl text-gray-900 font-extrabold no-underline border border-gray-200"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }