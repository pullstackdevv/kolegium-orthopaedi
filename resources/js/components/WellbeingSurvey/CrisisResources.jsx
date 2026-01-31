import { Phone, Clock, AlertCircle } from "lucide-react";

export default function CrisisResources({ resources }) {
  if (!resources) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <AlertCircle className="w-6 h-6 text-red-600" />
        Support & Crisis Resources
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Crisis Center */}
        {resources.local && (
          <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {resources.local.name}
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              {resources.local.description}
            </p>
          </div>
        )}

        {/* Emergency Unit */}
        {resources.emergency && (
          <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded-lg">
            <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {resources.emergency.name}
            </h3>
            <p className="text-sm text-red-800 mb-3">
              {resources.emergency.description}
            </p>
          </div>
        )}

        {/* Lifeline */}
        {resources.lifeline && (
          <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {resources.lifeline.name}
            </h3>
            <p className="text-sm text-purple-800 font-semibold mb-2">
              {resources.lifeline.phone}
            </p>
            <p className="text-xs text-purple-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resources.lifeline.availability}
            </p>
          </div>
        )}

        {/* Professional Committee */}
        {resources.professional_committee && (
          <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {resources.professional_committee.name}
            </h3>
            <p className="text-sm text-green-800 font-semibold mb-2">
              {resources.professional_committee.phone}
            </p>
            <p className="text-xs text-green-700 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {resources.professional_committee.availability}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Important:</span> These resources are available 24/7 for immediate support. You are not alone, and help is always available.
        </p>
      </div>
    </div>
  );
}
