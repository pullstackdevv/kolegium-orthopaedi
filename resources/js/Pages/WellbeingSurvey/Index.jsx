import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import HomepageLayout from "../../Layouts/HomepageLayout";
import MemberVerification from "../../components/WellbeingSurvey/MemberVerification";

export default function WellbeingSurveyIndex() {
  const { props } = usePage();
  const { affiliation, crisisResources } = props;
  const [verifiedMember, setVerifiedMember] = useState(null);

  const handleMemberVerified = (memberData) => {
    setVerifiedMember(memberData);
    
    // Navigate to survey show page with member data
    router.visit("/wellbeing-survey/show", {
      data: {
        affiliation,
        crisisResources,
        member: memberData,
      },
    });
  };

  return (
    <HomepageLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Well-Being Survey</h1>
            <p className="text-blue-100">
              Indonesian Orthopaedic & Traumatology Education Dashboard
            </p>
          </div>

          {/* Member Verification */}
          <MemberVerification 
            affiliation={affiliation}
            onVerified={handleMemberVerified}
          />
        </div>
      </div>
    </HomepageLayout>
  );
}
