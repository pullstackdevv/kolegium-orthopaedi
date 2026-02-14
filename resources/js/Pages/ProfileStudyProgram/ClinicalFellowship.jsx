import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import { Skeleton } from "../../components/ui/skeleton";
import api from "@/api/axios";

const DEFAULT_DESCRIPTION = "A continuing education program for specialist doctors to deepen clinical expertise in a particular subspecialty area.";
const DEFAULT_STUDENTS = 10;
const DEFAULT_STAFF = 15;

function getNameAbbreviation(name) {
  if (!name) return "RS";
  const upper = name.toUpperCase();
  if (upper.startsWith("FK-") || upper.startsWith("FK ")) {
    const rest = name.substring(3).trim();
    if (rest.length <= 6) return rest.toUpperCase() || "FK";
  }
  const uniIdx = upper.indexOf("UNIVERSITAS");
  if (uniIdx !== -1) {
    const uniPart = name.substring(uniIdx).trim();
    return uniPart.split(/\s+/).map(w => w[0]).join("").toUpperCase();
  }
  const parts = name.split("-");
  if (parts.length > 1) return parts[0].trim();
  return name.split(/\s+/).map(w => w[0]).join("").substring(0, 3).toUpperCase();
}

export default function ClinicalFellowship() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    return `${window.location.origin}${logoPath}`;
  };

  useEffect(() => {
    const fetchAffiliations = async () => {
      setLoading(true);
      try {
        const response = await api.get("/public/affiliations", {
          params: { type: "clinical_fellowship" },
          headers: { "X-Skip-Auth-Redirect": "1" },
        });

        if (response.data?.status === "success") {
          const list = Array.isArray(response.data?.data) ? response.data.data : [];
          const mapped = list.map((a) => ({
            id: a.id,
            code: a.code ?? "",
            name: a.name ?? "",
            abbreviation: getNameAbbreviation(a.name),
            description: a.profile_description || DEFAULT_DESCRIPTION,
            subTitle: a.profile_sub_title || "",
            affiliationCode: a.code ?? "",
            logo: a.profile_logo || a.logo || null,
            since: a.since ?? null,
            students: a.active_members || DEFAULT_STUDENTS,
            staff: (a.staff_count || a.teacher_staff_count) || DEFAULT_STAFF,
          }));
          setUniversities(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch affiliations", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliations();
  }, []);

  const tabs = [
    { name: "PPDS 1", href: "/profile-study-program/ppds1", active: false },
    { name: "Clinical Fellowship", href: "/profile-study-program/clinical-fellowship", active: true },
    { name: "Subspecialist", href: "/profile-study-program/subspesialis", active: false }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/profile-study-program/ppds1" className="hover:underline">Study Program Profile</Link>
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
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-secondary hover:border-secondary/40"
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
            <h1 className="text-3xl font-bold text-primary">Study Program Profile</h1>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-3 w-1/2 mb-6" />
                  <div className="pt-4 border-t border-gray-200 flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No data available.</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <Link
                key={university.id}
                href={`/profile-study-program/clinical-fellowship/${university.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 block"
              >
                {/* Hospital Logo & Name */}
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
                  <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 ${university.logo ? 'hidden' : ''}`}>
                    <span className="text-primary font-bold text-base">{university.abbreviation}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{university.name}</h3>
                    {university.since && (
                      <p className="text-xs text-gray-500">Since {university.since}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {university.description}
                </p>

                {/* Sub Title */}
                {university.subTitle && (
                  <p className="text-xs text-gray-500 mb-6">{university.subTitle}</p>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Fellow: {university.students}</span>
                    <span className="text-sm text-gray-600">Active Staff: {university.staff || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          )}
        </div>
      </section>
    </HomepageLayout>
  );
}
