import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import api from "@/api/axios";

export default function PPDS1() {
  // Data universitas PPDS1
  const universityTemplates = [
    {
      code: "FK",
      name: "FK-UI",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 120,
    },
    {
      code: "FK",
      name: "FK-UNAIR",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 110,
    },
    {
      code: "FK",
      name: "FK-UNPAD",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 145,
    },
    {
      code: "FK",
      name: "FK-UNHAS",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 66,
    },
    {
      code: "FK",
      name: "FK-UGM",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 179,
    },
    {
      code: "FK",
      name: "FK-UDAYANA",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 170,
    },
    {
      code: "FK",
      name: "FK-USU",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 145,
    },
    {
      code: "FK",
      name: "FK-UBRA",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 120,
    },
    {
      code: "FK",
      name: "FK-USRI",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 77,
    },
    {
      code: "FK",
      name: "FK-UNAN",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 80,
    },
    {
      code: "FK",
      name: "FK-USK",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 124,
    },
    {
      code: "FK",
      name: "FK-ULM",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 80,
    },
    {
      code: "FK",
      name: "RS SOEHARSO",
      fullName: "Universitas Indonesia",
      description:
        "The first specialist medical education program for Orthopedics — focusing on general orthopedic surgery & trauma.",
      kps: "KPS: dr. Ihsan Oesman, SpOT",
      students: 95,
    },
  ];

  const [universities, setUniversities] = useState(universityTemplates);

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        const response = await api.get("/public/affiliations", {
          params: { type: "residen" },
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
            code: base.code,
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
    { name: "PPDS1", href: "/profile-study-program/ppds1", active: true },
    { name: "Clinical Fellowship", href: "/profile-study-program/clinical-fellowship", active: false },
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
            <span>PPDS1</span>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
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

      {/* University Cards Grid */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#254D95' }}>Profil Program Studi</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university, index) => (
              <Link
                key={index}
                href={university?.id ? `/profile-study-program/ppds1/${university.id}` : `/profile-study-program/ppds1/fk-ui-${index + 1}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 block"
              >
                {/* University Badge & Name */}
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

                {/* University Info & KPS */}
                <p className="text-xs text-gray-500 mb-6">
                  {university.fullName} | {university.kps}
                </p>

                {/* Student Count */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Resident : {university.students}</span>
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
