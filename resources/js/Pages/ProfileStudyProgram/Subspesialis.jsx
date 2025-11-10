import { Link } from "@inertiajs/react";
import HomepageLayout from "../../Layouts/HomepageLayout";

export default function Subspesialis() {
  const universities = [
    {
      code: "FK",
      name: "FK-UI",
      fullName: "Universitas Indonesia",
      description: "Program lanjutan untuk Traumatologi — manajemen trauma & rekonstruksi.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 50
    },
    {
      code: "FK",
      name: "FK-UI",
      fullName: "Universitas Indonesia",
      description: "Program lanjutan untuk Traumatologi — manajemen trauma & rekonstruksi.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 50
    },
    {
      code: "FK",
      name: "FK-UI",
      fullName: "Universitas Indonesia",
      description: "Program lanjutan untuk Traumatologi — manajemen trauma & rekonstruksi.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 50
    }
  ];

  const tabs = [
    { name: "PPDS1", href: "/profile-study-program/ppds1", active: false },
    { name: "Clinical Fellowship", href: "/profile-study-program/clinical-fellowship", active: false },
    { name: "Subspesialis", href: "/profile-study-program/subspesialis", active: true }
  ];

  return (
    <HomepageLayout>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Profil Program Studi</h1>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab, index) => (
              <Link
                key={index}
                href={tab.href}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  tab.active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">{university.code}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{university.name}</h3>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {university.description}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  {university.fullName} | {university.kps}
                </p>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Mahasiswa Aktif</span>
                    <span className="text-lg font-bold text-blue-600">: {university.students}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
