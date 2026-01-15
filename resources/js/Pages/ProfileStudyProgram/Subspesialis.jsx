import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

export default function Subspesialis() {
  const universityTemplates = [
    {
      code: "FK",
      name: "FK-UI",
      fullName: "Universitas Indonesia",
      description:
        "The subspecialist specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 77,
      staff: 20,
    },
    {
      code: "FK",
      name: "FK-UNAIR",
      fullName: "Universitas Indonesia",
      description:
        "The subspecialist specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 88,
      staff: 18,
    },
  ];

  const [universities, setUniversities] = useState(universityTemplates);

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    return `${window.location.origin}${logoPath}`;
  };

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const response = await api.get("/public/affiliations", {
          params: { type: "subspesialis" },
        });

        if (response.data?.status !== "success") {
          setUniversities([]);
          return;
        }

        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        // Preserve API ordering (by created_at) - map directly without template index
        const merged = list.map((a) => {
          const defaultTemplate = universityTemplates[0] ?? {};
          return {
            ...defaultTemplate,
            id: a.id,
            code: a.code ? a.code.charAt(0) + a.code.split('-')[1]?.charAt(0) : defaultTemplate.code,
            name: a.name ?? defaultTemplate.name,
            fullName: a.name ?? defaultTemplate.fullName,
            affiliationCode: a.code ?? defaultTemplate.code,
            logo: a.logo ?? null,
            since: a.since ?? null,
            students: defaultTemplate.students,
            staff: defaultTemplate.staff
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
    { name: "PPDS 1", href: "/profile-study-program/ppds1", active: false },
    { name: "Clinical Fellowship", href: "/profile-study-program/clinical-fellowship", active: false },
    { name: "Subspesialis", href: "/profile-study-program/subspesialis", active: true }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/profile-study-program/ppds1" className="hover:underline">Study Program Profile</Link>
            <span>/</span>
            <span>Subspesialis</span>
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
                href={university?.id ? `/profile-study-program/subspesialis/${university.id}` : `/profile-study-program/subspesialis/fk-ui-${index + 1}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 block"
              >
                <div className="flex items-center gap-3 mb-4">
                  {university.logo ? (
                    <img 
                      src={getLogoUrl(university.logo)} 
                      alt={university.name}
                      className="w-12 h-12 object-contain rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ${university.logo ? 'hidden' : ''}`}>
                    <span className="text-blue-600 font-bold text-lg">{university.code}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{university.name}</h3>
                    {university.since && (
                      <p className="text-xs text-gray-500">Since {university.since}</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {university.description}
                </p>

                <p className="text-xs text-gray-500 mb-4">
                  {university.fullName} | {university.kps}
                </p>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Trainee: {university.students}</span>
                    <span className="text-sm text-gray-600">Active Staff: {university.staff || 0}</span>
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
