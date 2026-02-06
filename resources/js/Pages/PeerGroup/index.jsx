import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Users, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import HomepageLayout from "../../Layouts/HomepageLayout";

export default function PeerGroup() {
  // Peer Groups Data
  const peerGroups = [
    {
      id: 1,
      name: "IOSSA",
      fullName: "Indonesian Orthopaedic Spine Surgeon Association",
      president: "Dr. dr. I Gusti Lanang Ngurah Agung Artha Wiguna, Sp.OT(K)",
      description: "A professional organization dedicated to advancing spine surgery in Indonesia. IOSSA promotes excellence in education, research, and clinical practice through academic collaboration, training programs, and national symposia.",
      members: 80
    },
    {
      id: 2,
      name: "INAMSOS",
      fullName: "Indonesian Musculoskeletal Oncology Society",
      president: "dr. Mujaddid Idulhaq, Sp.OT(K)",
      description: "INAMSOS focuses on the study, research, and treatment of musculoskeletal tumors. The society supports clinical collaboration, oncologic education, and innovation in orthopaedic oncology across Indonesia.",
      members: 65
    },
    {
      id: 3,
      name: "IHKS",
      fullName: "Indonesian Hip and Knee Society",
      president: "dr. Kiki Novito, Sp.OT(K)",
      description: "IHKS unites orthopaedic surgeons specializing in hip and knee surgery. It aims to improve patient outcomes through continuous education, joint replacement research, and professional development.",
      members: 95
    },
    {
      id: 4,
      name: "INASES",
      fullName: "Indonesian Shoulder and Elbow Society",
      president: "Committee-led organization",
      description: "INASES brings together experts in shoulder and elbow surgery to enhance knowledge, research, and surgical skills through fellowship, workshops, and academic exchange.",
      members: 45
    },
    {
      id: 5,
      name: "IPOS",
      fullName: "Indonesian Pediatric Orthopaedic Society",
      president: "Prof. Dr. Yoyos Dias Ismiarto, dr., Sp.OT.Subsp.A.(K)., M.Kes., CCD",
      description: "IPOS is committed to improving musculoskeletal health in children through education, research, and community outreach in pediatric orthopaedics.",
      members: 72
    },
    {
      id: 6,
      name: "IOSSMA",
      fullName: "Indonesian Orthopaedic Sports Medicine Association",
      president: "dr. Ghuna Arioharjo Utoyo, AIFO-K, Sp.OT(K)",
      description: "IOSSMA promotes excellence in sports medicine and injury management. It supports clinical advancement, scientific publication, and national collaboration in orthopaedic sports medicine.",
      members: 88
    },
    {
      id: 7,
      name: "INASHUM",
      fullName: "Indonesian Society for Upper Limb and Microsurgery",
      president: "Dr. dr. Made Bramantya Karna, Sp.OT(K)",
      description: "INASHUM focuses on upper limb reconstruction, microsurgery, and functional restoration. The society enhances surgeon competency through education, research, and clinical innovation.",
      members: 54
    },
    {
      id: 8,
      name: "INAFAS",
      fullName: "Indonesian Foot and Ankle Society",
      president: "dr. Andri Primadhi, Sp.OT(K)",
      description: "INAFAS develops knowledge and best practices in foot and ankle surgery. It promotes collaborative learning, research, and improved patient care in this subspecialty field.",
      members: 61
    },
    {
      id: 9,
      name: "IOTS",
      fullName: "Indonesian Orthopaedic Trauma Society",
      president: "Not specified",
      description: "IOTS focuses on trauma management, fracture care, and post-injury reconstruction. The society advances trauma education, clinical standards, and multidisciplinary cooperation in orthopaedic trauma care.",
      members: 78
    }
  ];

  return (
    <HomepageLayout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-r from-primary to-secondary py-6">
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
          <h1 className="text-3xl font-bold text-primary mb-8">Peer Group</h1>

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
                  <p className="text-xs text-gray-500">President: {group.president}</p>
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{group.description}</p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Members : {group.members}</span>
                  </div>
                  <Link 
                    href={`/peer-group/${group.id}`}
                    className="text-primary hover:text-secondary text-sm font-medium"
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
