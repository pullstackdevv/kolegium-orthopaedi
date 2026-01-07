import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

export default function ClinicalFellowship() {
  const universityTemplates = [
    {
      code: "RS",
      name: "RSUD Dr. Saiful Anwar Malang",
      fullName: "RSUP Dr.Sardjito",
      description:
        "A continuing education program for specialist doctors to deepen clinical expertise in a particular subspecialty area.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 6,
    },
    {
      code: "RS",
      name: "RSUP Dr. Hasan Sadikin Bandung",
      fullName: "RSUP Dr.Sardjito",
      description:
        "A continuing education program for specialist doctors to deepen clinical expertise in a particular subspecialty area.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 29,
    },
    {
      code: "RS",
      name: "RSUP Dr. Sardjito Yogyakarta",
      fullName: "RSUP Dr.Sardjito",
      description:
        "A continuing education program for specialist doctors to deepen clinical expertise in a particular subspecialty area.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 6,
    },
    {
      code: "RS",
      name: "RSUD Dr. Moewardi Solo",
      fullName: "RSUP Dr.Sardjito",
      description:
        "A continuing education program for specialist doctors to deepen clinical expertise in a particular subspecialty area.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 8,
    },
  ];

  const [universities, setUniversities] = useState(universityTemplates);

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const response = await api.get("/public/affiliations", {
          params: { type: "clinical_fellowship" },
        });

        if (response.data?.status !== "success") {
          setUniversities([]);
          return;
        }

        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        const merged = list.map((a, idx) => {
          const base = universityTemplates[idx] ?? universityTemplates[0] ?? {};
          return {
            ...base,
            id: a.id,
            code: a.code ? a.code.charAt(0) + a.code.split('-')[1].charAt(0) : base.code,
            name: a.name ?? base.name,
            fullName: a.name ?? base.fullName,
            affiliationCode: a.code ?? base.code
          };
        });

        setUniversities(merged);
      } catch (e) {
        setUniversities(universityTemplates);
      }
    };

    fetchAffiliations();
  }, []);

  const tabs = [
    { name: "PPDS1", href: "/profile-study-program/ppds1", active: false },
    { name: "Clinical Fellowship", href: "/profile-study-program/clinical-fellowship", active: true },
    { name: "Subspesialist", href: "/profile-study-program/subspesialis", active: false }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Beranda</Link>
            <span>/</span>
            <Link href="/profile-study-program/ppds1" className="hover:underline">Profil Program Studi</Link>
            <span>/</span>
            <span>Clinical Fellowship</span>
          </div>
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#254D95' }}>Study Program Profile</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <Link
                key={index}
                href={`/profile-study-program/clinical-fellowship/rsup-sardjito-${index + 1}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 block"
              >
                {/* Hospital Badge & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-base">{university.code}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{university.name}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {university.description}
                </p>

                {/* Hospital Info & KPS */}
                <p className="text-xs text-gray-500 mb-6">
                  {university.fullName} | {university.kps}
                </p>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Fellow : {university.students}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
