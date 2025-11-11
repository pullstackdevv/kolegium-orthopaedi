import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import HomepageLayout from "../Layouts/HomepageLayout";

export default function PeerGroup() {
  // Peer Groups Data
  const peerGroups = [
    {
      id: 1,
      name: "IOSSA",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 8
    },
    {
      id: 2,
      name: "INAMSOS",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 15
    },
    {
      id: 3,
      name: "IHKS",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 20
    },
    {
      id: 4,
      name: "IOSSA",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 48
    },
    {
      id: 5,
      name: "INAMSOS",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 77
    },
    {
      id: 6,
      name: "IHKS",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 45
    },
    {
      id: 7,
      name: "IOSSA",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 49
    },
    {
      id: 8,
      name: "INAMSOS",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 12
    },
    {
      id: 9,
      name: "IHKS",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      agenda: "Annual seminar (April), microsurgery workshop (September), monthly case review.",
      members: 17
    }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>Peer Group</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <h1 className="text-3xl font-bold text-blue-600 mb-8">Peer Group</h1>

          {/* Peer Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {peerGroups.map((group) => (
              <div 
                key={group.id} 
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Group Name */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">{group.name}</h2>
                
                {/* President */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">President: Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)</p>
                </div>
                
                {/* Agenda */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700">{group.agenda}</p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Anggota : {group.members}</span>
                  </div>
                  <Link 
                    href={`/peer-group/${group.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </HomepageLayout>
  );
}
