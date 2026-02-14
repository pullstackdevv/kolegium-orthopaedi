import { Building2 } from "lucide-react";

export default function CrisisResources({ resources }) {
  if (!resources) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-l-4 border-l-primary">
      {/* Title */}
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        Educational Support
      </h2>

      {/* Two-column layout: Addresses & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Addresses */}
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Gedung Menara Era, Lantai 8, Unit 8-04<br />
            Jl. Senen Raya 135 – 137, Jakarta 10410, INDONESIA
          </p>
          <p>
            Jl. Hang Jebat Blok F3, RT.5/RW.8, Gunung, Kec. Kby. Baru,<br />
            Kota Jakarta Selatan, Daerah Khusus Ibukota<br />
            Jakarta 12120, Indonesia
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-sm text-gray-700">
          <p>telp +62 21 385 9651</p>
          <p>mobile telp +62 812 9030 9390</p>
          <p>fax +62 21-3859659</p>
          <p>email : kolegiumorthopaeditraumatologi@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
