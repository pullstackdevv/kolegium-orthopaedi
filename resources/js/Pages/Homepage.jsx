import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { ArrowRight, CheckCircle } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function Homepage() {
  const features = [
    {
      icon: "mdi:hospital-box",
      title: "Pendidikan Berkelanjutan",
      description: "Program pelatihan dan sertifikasi untuk dokter spesialis orthopaedi dan traumatologi"
    },
    {
      icon: "mdi:people-outline",
      title: "Komunitas Profesional",
      description: "Jaringan dokter spesialis terbesar di Indonesia dengan standar etika tertinggi"
    },
    {
      icon: "mdi:book-open-outline",
      title: "Riset & Inovasi",
      description: "Mendukung penelitian dan pengembangan ilmu orthopaedi dan traumatologi"
    },
    {
      icon: "mdi:heart-outline",
      title: "Pelayanan Kesehatan",
      description: "Meningkatkan kualitas pelayanan kesehatan orthopaedi di seluruh Indonesia"
    }
  ];

  const programs = [
    {
      title: "Program Pendidikan",
      description: "Pelatihan spesialis orthopaedi dan traumatologi dengan kurikulum internasional",
      icon: "mdi:school-outline"
    },
    {
      title: "Konferensi Tahunan",
      description: "Pertemuan ilmiah tahunan dengan pembicara internasional terkemuka",
      icon: "mdi:presentation-play"
    },
    {
      title: "Sertifikasi Profesional",
      description: "Program sertifikasi untuk meningkatkan kompetensi dokter spesialis",
      icon: "mdi:certificate-outline"
    }
  ];

  return (
    <HomepageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Kolegium Orthopaedi & Traumatologi Indonesia
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 leading-relaxed">
                Organisasi profesional terkemuka yang berkomitmen meningkatkan kualitas pelayanan kesehatan orthopaedi dan traumatologi di Indonesia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/cms/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Bergabung Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Pelajari Lebih Lanjut aja
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-500 bg-opacity-30 rounded-2xl p-8 border border-blue-400 border-opacity-50">
                <Icon icon="mdi:hospital-box" className="w-32 h-32 text-blue-100 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">5000+</div>
              <p className="text-gray-600 font-medium">Anggota Aktif</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600 font-medium">Cabang Daerah</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">30+</div>
              <p className="text-gray-600 font-medium">Tahun Berdiri</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-gray-600 font-medium">Profesional</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Tentang Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kolegium Orthopaedi & Traumatologi Indonesia adalah organisasi profesional yang didirikan untuk meningkatkan standar pelayanan kesehatan orthopaedi dan traumatologi di Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                <Icon icon={feature.icon} className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Program Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Berbagai program unggulan untuk mendukung pengembangan profesional dan peningkatan kualitas pelayanan kesehatan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 hover:border-blue-300 transition-colors">
                <Icon icon={program.icon} className="w-16 h-16 text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-6">{program.description}</p>
                <Link href="#" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Pelajari Lebih Lanjut
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                Keuntungan Menjadi Anggota
              </h2>
              <ul className="space-y-4">
                {[
                  "Akses ke program pendidikan dan pelatihan berkelanjutan",
                  "Jaringan profesional dengan dokter spesialis terkemuka",
                  "Sertifikasi dan kredensial internasional",
                  "Akses ke jurnal dan publikasi ilmiah",
                  "Dukungan dalam pengembangan karir",
                  "Komunitas yang saling mendukung dan berbagi pengetahuan"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-12 border border-blue-200">
              <Icon icon="mdi:check-circle-outline" className="w-48 h-48 text-blue-600 mx-auto opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan jadilah bagian dari komunitas profesional orthopaedi dan traumatologi terbesar di Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cms/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+62274515151"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}